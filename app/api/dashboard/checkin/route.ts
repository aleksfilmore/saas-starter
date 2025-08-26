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

    // daily_mood_logs structure now managed by formal migration 20250826_add_mood_data_to_daily_mood_logs.sql
    // (We intentionally remove on‑the‑fly CREATE/ALTER to avoid race conditions in production deployments.)
    // Minimal safety: soft existence check so a missing migration yields clear 500 instead of silent failure.
    try {
      await db.execute(sql`SELECT 1 FROM daily_mood_logs LIMIT 1`);
    } catch (e) {
      console.error('daily_mood_logs table missing – run migrations before allowing check-ins', e);
      return NextResponse.json({ error: 'Server not ready (migrations pending)' }, { status: 500 });
    }

    let body: any = {};
    try { body = await req.json(); } catch {}
  const mood = typeof body.mood === 'number' ? Math.min(10, Math.max(1, body.mood)) : null;
  const notes = typeof body.notes === 'string' ? body.notes.slice(0, 2000) : null;
  const gratitude = typeof body.gratitude === 'string' ? body.gratitude.slice(0, 500) : '';
  const challenge = typeof body.challenge === 'string' ? body.challenge.slice(0, 500) : '';
  const intention = typeof body.intention === 'string' ? body.intention.slice(0, 500) : '';
  const moodData = { gratitude, challenge, intention };

    const result = await db.execute(sql`SELECT checkin FROM user_daily_actions WHERE user_id = ${user.id} AND action_date = CURRENT_DATE`);
    let existingMood: any[] = [];
    try { existingMood = await db.execute(sql`SELECT mood FROM daily_mood_logs WHERE user_id = ${user.id} AND log_date = CURRENT_DATE`); } catch {}
    if (result.length === 0) {
      await db.execute(sql`INSERT INTO user_daily_actions (user_id, action_date, checkin) VALUES (${user.id}, CURRENT_DATE, true)`);
  // streakDays increment removed – ritual streak now sourced from user_daily_state
      if (!existingMood.length && (mood || notes || gratitude || challenge || intention)) {
        await db.execute(sql`INSERT INTO daily_mood_logs (user_id, log_date, mood, notes, mood_data) VALUES (${user.id}, CURRENT_DATE, ${mood ?? 3}, ${notes || ''}, ${JSON.stringify(moodData)})`);
      }
      return NextResponse.json({ success: true, completed: true, alreadyCompleted: false });
    }
    if (result[0].checkin) {
      if (!existingMood.length && (mood || notes || gratitude || challenge || intention)) {
        await db.execute(sql`INSERT INTO daily_mood_logs (user_id, log_date, mood, notes, mood_data) VALUES (${user.id}, CURRENT_DATE, ${mood ?? 3}, ${notes || ''}, ${JSON.stringify(moodData)})`);
      }
      return NextResponse.json({ success: true, completed: true, alreadyCompleted: true });
    }
  await db.execute(sql`UPDATE user_daily_actions SET checkin = true WHERE user_id = ${user.id} AND action_date = CURRENT_DATE`);
  // streakDays increment removed – ritual streak now sourced from user_daily_state
    if (!existingMood.length && (mood || notes || gratitude || challenge || intention)) {
      await db.execute(sql`INSERT INTO daily_mood_logs (user_id, log_date, mood, notes, mood_data) VALUES (${user.id}, CURRENT_DATE, ${mood ?? 3}, ${notes || ''}, ${JSON.stringify(moodData)})`);
    }
    return NextResponse.json({ success: true, completed: true, alreadyCompleted: false });
  } catch (e) {
    console.error('Daily checkin error', e);
    return NextResponse.json({ error: 'Failed to record check-in' }, { status: 500 });
  }
}
