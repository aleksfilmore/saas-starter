// Prestart script: optionally run schema health check against local dev server if already running.
// Loads .env.* before inspecting POSTGRES_URL so local development picks it up.
// For production CI you may want to run db:recover:core first.

try {
  // Prefer .env.local (Next.js convention) if it exists, otherwise fall back to .env
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const dotenv = require('dotenv');
  if (fs.existsSync('.env.local')) {
    dotenv.config({ path: '.env.local' });
  } else {
    dotenv.config();
  }
} catch {}

if (!process.env.POSTGRES_URL) {
  console.warn('[PRESTART] POSTGRES_URL not set; skipping schema check.');
  // Exit cleanly so chained command continues.
  process.exit(0);
}

(async () => {
  const { Client } = await import('pg');
  const client = new Client({ connectionString: process.env.POSTGRES_URL, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    const expected = ['anonymous_posts','wall_post_comments','wall_post_reactions','ritual_entries'];
    const missing = [];
    for (const t of expected) {
      try { await client.query(`SELECT 1 FROM ${t} LIMIT 1`); } catch { missing.push(t); }
    }
    if (missing.length) {
      console.warn(`[PRESTART] Missing tables detected: ${missing.join(', ')}. Consider running: npm run db:recover:core`);
    } else {
      console.log('[PRESTART] Core tables present.');
    }
  } catch (e) {
    console.warn('[PRESTART] Prestart check failed:', e.message);
  } finally {
    await client.end();
  }
})();
