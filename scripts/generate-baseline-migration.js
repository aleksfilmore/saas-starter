#!/usr/bin/env node
/**
 * Generates a baseline snapshot migration capturing the CURRENT live database schema
 * so drizzle's journal can be bootstrapped without rewriting history.
 *
 * It introspects information_schema + pg_catalog to emit a single SQL file
 * that (re)creates objects only if they do NOT already exist (idempotent guards).
 *
 * Usage: npm run db:snapshot:baseline
 * Output: lib/db/migrations/000000_baseline_snapshot.sql (won't overwrite existing)
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const postgres = require('postgres');

const OUT_FILE = path.join(process.cwd(), 'lib', 'db', 'migrations', '000000_baseline_snapshot.sql');

async function main(){
  if (fs.existsSync(OUT_FILE)) {
    console.error('[baseline] File already exists, aborting to avoid overwrite:', path.basename(OUT_FILE));
    process.exit(1);
  }
  const url = process.env.POSTGRES_URL;
  if(!url){
    console.error('[baseline] POSTGRES_URL missing');
    process.exit(1);
  }
  const sql = postgres(url);
  try {
    // Tables
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name`;
    // Columns
    const cols = await sql`SELECT table_name,column_name,data_type,is_nullable,column_default,udt_name
      FROM information_schema.columns WHERE table_schema='public' ORDER BY table_name,ordinal_position`;
    // Enums
    const enums = await sql`SELECT t.typname AS enum_name, string_agg(e.enumlabel, ',' ORDER BY e.enumsortorder) AS labels
      FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid JOIN pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname='public' GROUP BY t.typname ORDER BY t.typname`;
    // Indexes (exclude PKs auto-created)
    const indexes = await sql`SELECT i.relname AS index_name, tab.relname AS table_name, pg_get_indexdef(ix.indexrelid) AS def
      FROM pg_class i JOIN pg_index ix ON i.oid = ix.indexrelid
      JOIN pg_class tab ON ix.indrelid = tab.oid
      JOIN pg_namespace ns ON ns.oid = tab.relnamespace
      WHERE ns.nspname='public' AND NOT ix.indisprimary
      ORDER BY tab.relname, i.relname`;

    let out = '-- Baseline snapshot (auto-generated)\n-- Generated at ' + new Date().toISOString() + '\n-- Idempotent guards included so it can be re-applied safely.\n\nBEGIN;\n\n';

    // Enums first
    for(const e of enums){
      out += `DO $$ BEGIN\n  CREATE TYPE "${e.enum_name}" AS ENUM (${e.labels.split(',').map(l=>"'"+l.replace(/'/g,"''")+"'").join(', ')});\nEXCEPTION WHEN duplicate_object THEN NULL; END $$;\n\n`;
    }

    for(const t of tables){
      const tCols = cols.filter(c=> c.table_name === t.table_name);
      out += `-- Table: ${t.table_name}\nDO $$ BEGIN\n  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='${t.table_name}') THEN\n    EXECUTE 'CREATE TABLE "${t.table_name}" (placeholder int)';\n  END IF;\nEND $$;\n`;
      // Add missing columns
      for(const c of tCols){
        let type = c.udt_name;
        if (c.data_type === 'USER-DEFINED') type = c.udt_name; // enum
        if (c.data_type === 'timestamp with time zone') type = 'timestamptz';
        if (c.data_type === 'integer') type = 'integer';
        if (c.data_type === 'text') type = 'text';
        if (c.data_type === 'boolean') type = 'boolean';
        if (c.data_type === 'jsonb') type = 'jsonb';
        const nullable = c.is_nullable === 'YES';
        const def = c.column_default ? ` DEFAULT ${c.column_default.replace(/'/g,"''")}` : '';
        out += `ALTER TABLE "${t.table_name}" ADD COLUMN IF NOT EXISTS "${c.column_name}" ${type}${def}${nullable?'':' NOT NULL'};\n`;
      }
      // Remove placeholder if added
      out += `DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='${t.table_name}' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "${t.table_name}" DROP COLUMN placeholder'; END IF; END $$;\n\n`;
    }

    // Indexes
    for(const idx of indexes){
      // def looks like: CREATE INDEX name ON table USING btree (...)
      // Replace CREATE INDEX with CREATE INDEX IF NOT EXISTS
      const safe = idx.def.replace('CREATE INDEX', 'CREATE INDEX IF NOT EXISTS');
      out += safe + ';\n';
    }

    out += '\nCOMMIT;\n';

    fs.writeFileSync(OUT_FILE, out, 'utf8');
    console.log('[baseline] Wrote', OUT_FILE);
  } finally {
    await sql.end();
  }
}

main().catch(e=>{ console.error('[baseline] Failed', e); process.exit(1); });
