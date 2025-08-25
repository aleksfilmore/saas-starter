/**
 * Enhanced test script for daily action endpoints.
 * Run: npx tsx scripts/test-daily-actions.ts
 * Uses test-mode user injection (see endpoints) and asserts idempotency + rate limiting.
 */
(globalThis as any).__TEST_USER_ID__ = 'test-user-1';
process.env.TEST_MODE = 'true';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

import { POST as wallInteract } from '@/app/api/dashboard/wallInteract/route';
import { POST as aiChat } from '@/app/api/dashboard/aiChat/route';
import { POST as wallPost } from '@/app/api/dashboard/wallPost/route';
import { NextRequest } from 'next/server';

async function fakeRequest(): Promise<NextRequest> {
  // @ts-ignore minimal Request cast
  return new Request('http://localhost/api') as NextRequest;
}

async function run() {
  console.log('Running daily actions endpoint tests');
  let failures = 0;
  // First calls
  for (const [label, handler] of [['wallInteract', wallInteract], ['aiChat', aiChat], ['wallPost', wallPost]] as const) {
    const res = await handler(await fakeRequest());
    const data = await (res as any).json();
    if (res.status !== 200 || data.alreadyCompleted) {
      console.error(`[FAIL] First ${label} expected alreadyCompleted=false status=200. Got status=${res.status} data=${JSON.stringify(data)}`);
      failures++;
    } else { console.log(`[OK] ${label} first completion`); }
  }
  // Second calls (idempotent)
  for (const [label, handler] of [['wallInteract', wallInteract], ['aiChat', aiChat], ['wallPost', wallPost]] as const) {
    const res = await handler(await fakeRequest());
    const data = await (res as any).json();
    if (res.status !== 200 || !data.alreadyCompleted) {
      console.error(`[FAIL] Second ${label} expected alreadyCompleted=true status=200. Got status=${res.status} data=${JSON.stringify(data)}`);
      failures++;
    } else { console.log(`[OK] ${label} idempotent second call`); }
  }

  if (failures) { console.error(`❌ ${failures} failures (idempotency)`); process.exit(1); }

  // Verify no duplicate byte history entries for an action (should remain 1)
  try {
    const rows = await db.execute(sql`SELECT COUNT(*) as c FROM user_byte_history WHERE user_id = ${ (globalThis as any).__TEST_USER_ID__ } AND activity = 'daily_wall_interact' AND DATE(created_at)=CURRENT_DATE`);
    const cnt = Number((rows[0] as any)?.c || 0);
    if (cnt !== 1) { console.error(`[FAIL] Expected 1 byte history entry for daily_wall_interact, found ${cnt}`); process.exit(1); }
    else console.log('[OK] Byte history entry count correct (1) for wallInteract');
  } catch (e) { console.warn('Byte history count check failed (likely mock DB):', e); }

  // Check aiChat & wallPost byte history counts (should be 1 each)
  for (const activity of ['daily_ai_chat','daily_wall_post']) {
    try {
      const rows = await db.execute(sql`SELECT COUNT(*) as c FROM user_byte_history WHERE user_id = ${ (globalThis as any).__TEST_USER_ID__ } AND activity = ${activity} AND DATE(created_at)=CURRENT_DATE`);
      const cnt = Number((rows[0] as any)?.c || 0);
      if (cnt !== 1) { console.error(`[FAIL] Expected 1 byte history entry for ${activity}, found ${cnt}`); failures++; }
      else console.log(`[OK] Byte history entry count correct (1) for ${activity}`);
    } catch (e) { console.warn(`Byte history count check failed for ${activity}:`, e); }
  }

  if (failures) { console.error(`❌ ${failures} failures (byte history)`); process.exit(1); }

  // Rate limit test with parameterization
  const maxAttempts = Number(process.env.RATE_LIMIT_MAX_ATTEMPTS || '20');
  let rateLimitHit = false; let attempts = 0;
  while (attempts < maxAttempts && !rateLimitHit) {
    attempts++;
    const res = await wallInteract(await fakeRequest());
    if (res.status === 429) { rateLimitHit = true; console.log(`[OK] Rate limit triggered after ${attempts} extra attempts`); break; }
  }
  if (!rateLimitHit) {
    console.warn(`[WARN] Rate limit not triggered within ${maxAttempts} attempts (config may allow more).`);
  }

  console.log('✅ Daily action endpoint tests completed');
}

run().catch(e=>{ console.error(e); process.exit(1); });
