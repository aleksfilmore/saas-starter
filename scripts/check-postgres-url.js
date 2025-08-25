// Guard script: ensure POSTGRES_URL exists before running DB operations.
if (!process.env.POSTGRES_URL) {
  console.error('[DB GUARD] Missing POSTGRES_URL. Set it in .env.local or environment variables.');
  process.exit(1);
}
console.log('[DB GUARD] POSTGRES_URL detected.');
