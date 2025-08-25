import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

/*
 Backfill script:
 1. Reads distinct (user_id, DATE(assigned_at)) from legacy user_ritual_assignments (non-rerolled) for ghost users.
 2. Inserts into ghost_daily_assignments if not present, picking the last ritual_key of that day.
 3. Skips firewall/premium tiers.
*/

async function run() {
  console.log('[backfill] Starting ghost daily assignment backfill');
  const rows: any[] = await db.execute(sql`
    SELECT ura.user_id, DATE(ura.assigned_at) as day, ura.ritual_key
    FROM user_ritual_assignments ura
    JOIN users u ON u.id = ura.user_id
    WHERE ura.rerolled = false
      AND (u.tier = 'ghost' OR u.tier = 'freemium' OR u.tier IS NULL)
    ORDER BY ura.user_id, day, ura.assigned_at DESC
  `);
  // We'll keep the first seen per (user, day) thanks to DESC ordering
  const seen = new Set<string>();
  let inserted = 0;
  for (const r of rows) {
    const key = `${r.user_id}:${r.day}`;
    if (seen.has(key)) continue;
    seen.add(key);
    try {
      await db.execute(sql`
        INSERT INTO ghost_daily_assignments (user_id, assigned_date, timezone, ritual_id)
        VALUES (${r.user_id}, ${r.day}, 'UTC', ${r.ritual_key})
        ON CONFLICT (user_id, assigned_date) DO NOTHING
      `);
      inserted++;
    } catch (e) {
      console.warn('[backfill] insert failed', key, e);
    }
  }
  console.log(`[backfill] Completed. Inserted ${inserted} ghost daily assignments.`);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });