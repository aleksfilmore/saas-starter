export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userDailyState, users } from '@/lib/db/unified-schema';
import { eq, sql } from 'drizzle-orm';
import { validateRequest } from '@/lib/auth';

// Returns normalized streak metrics
// ritual: consecutive days with at least one ritual completion (from user_daily_state today row)
// noContact: raw no_contact_days counter
// overall: ritual (default definition)
export async function GET() {
  try {
  const { user } = await validateRequest();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const today = new Date().toISOString().split('T')[0];

    // attempt to get today row
    const todayRow = await db.select().from(userDailyState)
      .where(sql`user_id = ${user.id} AND DATE(state_date) = ${today}`)
      .limit(1);

    let ritual = todayRow[0]?.streakDays ?? 0;

    // if zero, optionally look at yesterday only if today has no rituals yet (keep it simple)
    if (ritual === 0) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const yRow = await db.select().from(userDailyState)
        .where(sql`user_id = ${user.id} AND DATE(state_date) = ${yesterday}`)
        .limit(1);
      if (yRow[0]?.streakDays) ritual = yRow[0].streakDays; // keep streak preview before first completion today
    }

    // no contact from users table
  const baseUser = await db.select({ noContactDays: users.noContactDays }).from(users).where(eq(users.id, user.id)).limit(1);
    const noContact = baseUser[0]?.noContactDays || 0;

    return NextResponse.json({ ritual, noContact, overall: ritual });
  } catch (e: any) {
    console.error('streaks endpoint error', e);
    return NextResponse.json({ ritual: 0, noContact: 0, overall: 0 }, { status: 200 });
  }
}
