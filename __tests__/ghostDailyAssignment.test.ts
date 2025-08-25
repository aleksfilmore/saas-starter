import { describe, it, expect, beforeAll } from '@jest/globals';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

// Thin integration-style test ensuring only one ghost assignment per user per local date.
// Assumes migrations applied and unified schema active.

const TEST_USER_ID = 'test-ghost-user-assign';

describe('ghost daily assignment uniqueness', () => {
  beforeAll(async () => {
    await db.execute(sql`DELETE FROM users WHERE id = ${TEST_USER_ID}`);
    await db.execute(sql`INSERT INTO users (id, email, password_hash, timezone, bytes) VALUES (${TEST_USER_ID}, 'ghost@test.local', 'hash', 'UTC', 0)`);
  });

  it('creates only one assignment per day even with multiple hub calls', async () => {
    // Simulate hub route selection logic (simplified)
    const callHubLike = async () => {
      // mimic logic in hub: attempt select then insert if missing
      const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC', year:'numeric', month:'2-digit', day:'2-digit'}).format(new Date());
      const existing: any[] = await db.execute(sql`SELECT ritual_id FROM ghost_daily_assignments WHERE user_id = ${TEST_USER_ID} AND assigned_date = ${today}`);
      if (!existing.length) {
        // use deterministic ritual id stub
        await db.execute(sql`INSERT INTO ghost_daily_assignments (user_id, assigned_date, timezone, ritual_id) VALUES (${TEST_USER_ID}, ${today}, 'UTC', 'grief-01') ON CONFLICT (user_id, assigned_date) DO NOTHING`);
      }
    };

    await Promise.all(Array.from({ length: 5 }).map(() => callHubLike()));

    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC', year:'numeric', month:'2-digit', day:'2-digit'}).format(new Date());
    const rows: any[] = await db.execute(sql`SELECT * FROM ghost_daily_assignments WHERE user_id = ${TEST_USER_ID} AND assigned_date = ${today}`);
    expect(rows.length).toBe(1);
    expect(rows[0].ritual_id).toBe('grief-01');
  });

  it('respects separate local dates across timezones (conceptual)', async () => {
    // Create second user with different timezone
    const USER2 = TEST_USER_ID + '-tz';
    await db.execute(sql`DELETE FROM users WHERE id = ${USER2}`);
    await db.execute(sql`INSERT INTO users (id, email, password_hash, timezone, bytes) VALUES (${USER2}, 'ghost2@test.local', 'hash', 'Pacific/Auckland', 0)`);
    const todayUTC = new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC', year:'numeric', month:'2-digit', day:'2-digit'}).format(new Date());
    const todayNZ = new Intl.DateTimeFormat('en-CA', { timeZone: 'Pacific/Auckland', year:'numeric', month:'2-digit', day:'2-digit'}).format(new Date());
    expect(todayUTC.length).toBe(10);
    expect(todayNZ.length).toBe(10);
    // Insert assignments for both users with their respective local dates
    await db.execute(sql`INSERT INTO ghost_daily_assignments (user_id, assigned_date, timezone, ritual_id) VALUES (${USER2}, ${todayNZ}, 'Pacific/Auckland', 'grief-02') ON CONFLICT DO NOTHING`);
    await db.execute(sql`INSERT INTO ghost_daily_assignments (user_id, assigned_date, timezone, ritual_id) VALUES (${TEST_USER_ID}, ${todayUTC}, 'UTC', 'grief-01') ON CONFLICT DO NOTHING`);
    const rowsUTC: any[] = await db.execute(sql`SELECT * FROM ghost_daily_assignments WHERE user_id = ${TEST_USER_ID} AND assigned_date = ${todayUTC}`);
    const rowsNZ: any[] = await db.execute(sql`SELECT * FROM ghost_daily_assignments WHERE user_id = ${USER2} AND assigned_date = ${todayNZ}`);
    expect(rowsUTC.length).toBe(1);
    expect(rowsNZ.length).toBe(1);
  });
});
