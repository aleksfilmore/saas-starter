#!/usr/bin/env ts-node
/*
 * One-shot script to ensure core content tables exist in the connected database.
 * Safe + idempotent for production. Use: npx ts-node scripts/restore-core-tables.ts
 */
import 'dotenv/config';
import { db } from '@/lib/db';
import { getMissingCoreTables, restoreMissingTables } from '@/lib/db/health';

async function main() {
  try {
    const missing = await getMissingCoreTables();
    if (!missing.length) {
      console.log('[RESTORE] All core tables already present. Nothing to do.');
      process.exit(0);
    }
    console.log('[RESTORE] Missing tables:', missing.join(', '));
    const result = await restoreMissingTables(missing);
    console.log('[RESTORE] Restored:', result.restored);
    if (result.skipped.length) console.log('[RESTORE] Skipped:', result.skipped);
    console.log('[RESTORE] Done.');
  } catch (e:any) {
    console.error('[RESTORE] Failed:', e.message, e.stack);
    process.exit(1);
  } finally {
    // drizzle pg pool will exit when process ends
  }
}

main();
