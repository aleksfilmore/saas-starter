#!/usr/bin/env node
/**
 * Manual SQL migration runner (bypass drizzle meta issues).
 * Executes each .sql file in lib/db/migrations (excluding /meta and any file containing '_down_').
 * Tracks applied files in _manual_migrations table (filename unique).
 */
const fs = require('fs');
const path = require('path');
// Load env
try { require('dotenv').config({ path: '.env.local' }); } catch {}
try { require('dotenv').config(); } catch {}

const POSTGRES_URL = process.env.POSTGRES_URL;
if(!POSTGRES_URL){
  console.error('[manual-migrate] POSTGRES_URL missing');
  process.exit(1);
}

const postgres = require('postgres');
const sql = postgres(POSTGRES_URL, { max: 1 });

async function ensureMeta(){
  await sql`CREATE TABLE IF NOT EXISTS _manual_migrations (
    id serial PRIMARY KEY,
    filename text NOT NULL UNIQUE,
    applied_at timestamptz NOT NULL DEFAULT now()
  );`;
}

async function alreadyApplied(filename){
  const rows = await sql`SELECT 1 FROM _manual_migrations WHERE filename = ${filename} LIMIT 1;`;
  return rows.length > 0;
}

async function markApplied(filename){
  await sql`INSERT INTO _manual_migrations (filename) VALUES (${filename}) ON CONFLICT DO NOTHING;`;
}

async function run(){
  const dir = path.join(process.cwd(), 'lib', 'db', 'migrations');
  const entries = fs.readdirSync(dir).filter(f => f.endsWith('.sql') && !f.includes('_down_') && f !== 'meta');
  entries.sort();
  await ensureMeta();
  let appliedCount = 0;
  for(const file of entries){
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if(!stat.isFile()) continue;
    if(await alreadyApplied(file)){
      console.log(`[manual-migrate] Skip (already) ${file}`);
      continue;
    }
    const content = fs.readFileSync(full, 'utf8').trim();
    if(!content){
      console.log(`[manual-migrate] Skip (empty) ${file}`);
      await markApplied(file);
      continue;
    }
    console.log(`[manual-migrate] Applying ${file}`);
    try {
      await sql.unsafe(content); // executes multi statements
      await markApplied(file);
      appliedCount++;
    } catch(err){
      console.error(`[manual-migrate] FAILED ${file}:`, err.message);
      console.error('Aborting further migrations.');
      process.exit(1);
    }
  }
  console.log(`[manual-migrate] Complete. Applied ${appliedCount} new migrations.`);
  await sql.end();
}

run().catch(e=>{ console.error(e); process.exit(1); });