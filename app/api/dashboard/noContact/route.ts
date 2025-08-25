import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';
import { users } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

/**
 * POST /api/dashboard/noContact
 * Marks the user's no-contact daily affirmation as complete for today.
 * (Separate from detailed /api/no-contact/checkin flow; this is lightweight dashboard version.)
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

    const existing = await db.execute(sql`SELECT no_contact FROM user_daily_actions WHERE user_id = ${user.id} AND action_date = CURRENT_DATE`);
    if (existing.length === 0) {
      await db.execute(sql`INSERT INTO user_daily_actions (user_id, action_date, no_contact) VALUES (${user.id}, CURRENT_DATE, true)`);
      try { await db.update(users).set({ noContactDays: sql`${users.noContactDays} + 1` }).where(eq(users.id, user.id)); } catch {}
      return NextResponse.json({ success: true, completed: true, alreadyCompleted: false });
    }
    if (existing[0].no_contact) {
      return NextResponse.json({ success: true, completed: true, alreadyCompleted: true });
    }
    await db.execute(sql`UPDATE user_daily_actions SET no_contact = true WHERE user_id = ${user.id} AND action_date = CURRENT_DATE`);
    try { await db.update(users).set({ noContactDays: sql`${users.noContactDays} + 1` }).where(eq(users.id, user.id)); } catch {}
    return NextResponse.json({ success: true, completed: true, alreadyCompleted: false });
  } catch (e) {
    console.error('No-contact action error', e);
    return NextResponse.json({ error: 'Failed to record no-contact action' }, { status: 500 });
  }
}
