import 'dotenv/config';

async function main() {
  const base = process.env.STARTUP_HEALTH_BASE_URL || 'http://localhost:3001';
  const url = `${base}/api/system/schema-health`;
  try {
  const res = await fetch(url, { method: 'GET' });
    if (!res.ok) {
      console.error(`[SCHEMA-CHECK] Health endpoint returned status ${res.status}`);
      process.exit(1);
    }
    const data: any = await res.json();
    if (!data.ok) {
      console.error(`[SCHEMA-CHECK] Missing tables: ${data.missing.join(', ')}`);
      process.exit(1);
    }
    console.log('[SCHEMA-CHECK] All expected tables present.');
  } catch (e) {
    console.error('[SCHEMA-CHECK] Failed to contact schema health endpoint:', e);
    process.exit(1);
  }
}

main();
