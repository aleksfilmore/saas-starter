#!/usr/bin/env ts-node
/**
 * Backfill user_daily_state rows for today for users missing an entry.
 * Sets streakDays based on prior day row if they had completions yesterday (simple heuristic).
 */
import { db } from '@/lib/db';
import { users, userDailyState } from '@/lib/db/unified-schema';
import { sql, eq } from 'drizzle-orm';

async function run() {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const allUsers = await db.select({ id: users.id }).from(users);
  let inserted = 0;

  for (const u of allUsers) {
    const existing = await db.select().from(userDailyState).where(sql`user_id = ${u.id} AND DATE(state_date) = ${today}`).limit(1);
    if (existing.length > 0) continue;

    // look at yesterday
    const y = await db.select({ streakDays: userDailyState.streakDays }).from(userDailyState).where(sql`user_id = ${u.id} AND DATE(state_date) = ${yesterday}`).limit(1);
    const priorStreak = y[0]?.streakDays || 0;

    await db.insert(userDailyState).values({
      userId: u.id,
      stateDate: new Date(today),
      ritualsCompletedToday: 0,
      dailyCapReached: false,
      hasRerolledToday: false,
      streakDays: priorStreak, // preview of current streak until a completion bumps it
      timezone: 'UTC',
      totalWeeksActive: 0
    });
    inserted++;
  }
  console.log(`Backfill complete. Inserted ${inserted} rows.`);
}

run().then(()=>process.exit(0)).catch(e=>{ console.error(e); process.exit(1); });
