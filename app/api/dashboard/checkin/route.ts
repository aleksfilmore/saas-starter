import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';
import { users } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

/**
 * POST /api/dashboard/checkin
 * Marks the user's daily general check-in as complete for today.
 * Idempotent: subsequent calls on same day return 200 with alreadyCompleted=true.
 */
export async function POST(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Ensure helper table exists (temporary until formal migration)
    await db.execute(sql`CREATE TABLE IF NOT EXISTS user_daily_actions (
      user_id text NOT NULL,
      action_date date NOT NULL,
      checkin boolean NOT NULL DEFAULT false,
      no_contact boolean NOT NULL DEFAULT false,
      ritual boolean NOT NULL DEFAULT false,
      PRIMARY KEY (user_id, action_date)
    )`);

    // Mood table (idempotent create)
    await db.execute(sql`CREATE TABLE IF NOT EXISTS daily_mood_logs (
      user_id TEXT NOT NULL,
      log_date DATE NOT NULL,
      mood INTEGER NOT NULL CHECK (mood BETWEEN 1 AND 5),
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, log_date)
    )`);

    let body: any = {};
    try { body = await req.json(); } catch {}
    const mood = typeof body.mood === 'number' ? Math.min(5, Math.max(1, body.mood)) : null;
    const notes = typeof body.notes === 'string' ? body.notes.slice(0, 1000) : null;

    const result = await db.execute(sql`SELECT checkin FROM user_daily_actions WHERE user_id = ${user.id} AND action_date = CURRENT_DATE`);
    let existingMood: any[] = [];
    try { existingMood = await db.execute(sql`SELECT mood FROM daily_mood_logs WHERE user_id = ${user.id} AND log_date = CURRENT_DATE`); } catch {}
    if (result.length === 0) {
      await db.execute(sql`INSERT INTO user_daily_actions (user_id, action_date, checkin) VALUES (${user.id}, CURRENT_DATE, true)`);
      // increment lightweight total_checkins counter via users.streakDays or add if dedicated column exists
      try { await db.update(users).set({ streakDays: sql`${users.streakDays} + 1` }).where(eq(users.id, user.id)); } catch {}
      if (!existingMood.length && (mood || notes)) {
        await db.execute(sql`INSERT INTO daily_mood_logs (user_id, log_date, mood, notes) VALUES (${user.id}, CURRENT_DATE, ${mood ?? 3}, ${notes || ''})`);
      }
      return NextResponse.json({ success: true, completed: true, alreadyCompleted: false });
    }
    if (result[0].checkin) {
      if (!existingMood.length && (mood || notes)) {
        await db.execute(sql`INSERT INTO daily_mood_logs (user_id, log_date, mood, notes) VALUES (${user.id}, CURRENT_DATE, ${mood ?? 3}, ${notes || ''})`);
      }
      return NextResponse.json({ success: true, completed: true, alreadyCompleted: true });
    }
    await db.execute(sql`UPDATE user_daily_actions SET checkin = true WHERE user_id = ${user.id} AND action_date = CURRENT_DATE`);
    try { await db.update(users).set({ streakDays: sql`${users.streakDays} + 1` }).where(eq(users.id, user.id)); } catch {}
    if (!existingMood.length && (mood || notes)) {
      await db.execute(sql`INSERT INTO daily_mood_logs (user_id, log_date, mood, notes) VALUES (${user.id}, CURRENT_DATE, ${mood ?? 3}, ${notes || ''})`);
    }
    return NextResponse.json({ success: true, completed: true, alreadyCompleted: false });
  } catch (e) {
    console.error('Daily checkin error', e);
    return NextResponse.json({ error: 'Failed to record check-in' }, { status: 500 });
  }
}
