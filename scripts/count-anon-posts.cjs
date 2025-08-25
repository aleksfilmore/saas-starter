#!/usr/bin/env node
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
try { const dotenv = require('dotenv'); const p = path.join(process.cwd(), '.env.local'); if (fs.existsSync(p)) dotenv.config({ path: p }); else dotenv.config(); } catch {}
if (!process.env.POSTGRES_URL) { console.error('POSTGRES_URL not set'); process.exit(1); }
(async () => {
  const client = new Client({ connectionString: process.env.POSTGRES_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const res = await client.query('SELECT COUNT(*)::int AS c FROM anonymous_posts');
    console.log('anonymous_posts count =', res.rows[0].c);
  } catch (e) {
    console.error('Query failed:', e.message);
  } finally { await client.end(); }
})();
