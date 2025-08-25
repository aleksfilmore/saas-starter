import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

export const runtime = 'nodejs';

/**
 * POST /api/dashboard/ritual
 * Marks ritual action complete for the day (separate from full ritual completion flow).
 * Useful for placeholder tracking before full ritual completion integrated.
 */
export async function POST(_req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await db.execute(sql`CREATE TABLE IF NOT EXISTS user_daily_actions (
      user_id text NOT NULL,
      action_date date NOT NULL,
      checkin boolean NOT NULL DEFAULT false,
      no_contact boolean NOT NULL DEFAULT false,
      ritual boolean NOT NULL DEFAULT false,
      PRIMARY KEY (user_id, action_date)
    )`);

  const existing = await db.execute(sql`SELECT ritual FROM user_daily_actions WHERE user_id = ${user.id} AND action_date = CURRENT_DATE`);
    if (existing.length === 0) {
      await db.execute(sql`INSERT INTO user_daily_actions (user_id, action_date, ritual) VALUES (${user.id}, CURRENT_DATE, true)`);
      return NextResponse.json({ success: true, completed: true, alreadyCompleted: false });
    }
    if (existing[0].ritual) {
      return NextResponse.json({ success: true, completed: true, alreadyCompleted: true });
    }
    await db.execute(sql`UPDATE user_daily_actions SET ritual = true WHERE user_id = ${user.id} AND action_date = CURRENT_DATE`);
    return NextResponse.json({ success: true, completed: true, alreadyCompleted: false });
  } catch (e) {
    console.error('Ritual action error', e);
    return NextResponse.json({ error: 'Failed to record ritual action' }, { status: 500 });
  }
}
