#!/usr/bin/env node
/**
 * Simple table inspector.
 * Usage: node scripts/inspect-tables.js voice_therapy_credits notifications daily_ritual_assignments
 * If no args provided, defaults to a core set.
 */
const { Client } = require('pg');
const tables = process.argv.slice(2);
const targetTables = tables.length ? tables : [
  'voice_therapy_credits',
  'notifications',
  'daily_ritual_assignments',
  'daily_ritual_completions'
];

async function main(){
  const candidates = [process.env.POSTGRES_URL, process.env.NETLIFY_DATABASE_URL, process.env.NETLIFY_DATABASE_URL_UNPOOLED].filter(Boolean);
  if(candidates.length === 0){
    console.error('No connection string env vars found (POSTGRES_URL / NETLIFY_DATABASE_URL).');
    process.exit(1);
  }
  let client = null;
  let lastErr;
  for(const cs of candidates){
    const c = new Client({ connectionString: cs, ssl: { rejectUnauthorized: false }});
    try {
      await c.connect();
      console.log(`[inspect] Connected using ${cs.split('@')[1]?.slice(0,40)}...`);
      client = c;
      break;
    } catch(e){
      lastErr = e;
    }
  }
  if(!client){
    console.error('Failed to connect with provided connection strings.', lastErr?.message);
    process.exit(1);
  }
  for (const t of targetTables){
    try {
      const res = await client.query(`SELECT column_name, data_type, is_nullable, column_default
                                      FROM information_schema.columns
                                      WHERE table_name = $1
                                      ORDER BY ordinal_position`, [t]);
      if(res.rows.length===0){
        console.log(`\nTable: ${t} (not found)`);
        continue;
      }
      console.log(`\nTable: ${t}`);
      res.rows.forEach(r=>{
        console.log(`  ${r.column_name.padEnd(28)} ${r.data_type.padEnd(16)} NULLABLE:${r.is_nullable==='YES'?'Y':'N'} DEFAULT:${r.column_default||''}`);
      });
    } catch(e){
      console.log(`\nTable: ${t} (error)`);
      console.error(e.message);
    }
  }
  await client.end();
}
main().catch(e=>{ console.error(e); process.exit(1); });