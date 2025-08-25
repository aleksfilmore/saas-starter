#!/usr/bin/env node
/** Simple pre-migration guard: ensure POSTGRES_URL is present & sane */
// Load .env.local then .env
try { require('dotenv').config({ path: '.env.local' }); } catch {}
try { require('dotenv').config(); } catch {}

const requiredVar = 'POSTGRES_URL';
const url = process.env[requiredVar];
if(!url || !/^postgres:\/\//i.test(url)){
  console.error(`[db:guard] Missing or invalid ${requiredVar}. Aborting migration.`);
  process.exit(1);
}
// Basic redaction for logging
const redacted = url.replace(/:[^:@/]+@/, ':****@');
console.log(`[db:guard] ${requiredVar} present (${redacted})`);
// Optional: warn if sslmode not enforced (Neon usually requires it)
if(!/sslmode=/.test(url)){
  console.warn('[db:guard] WARNING: sslmode not specified in POSTGRES_URL.');
}