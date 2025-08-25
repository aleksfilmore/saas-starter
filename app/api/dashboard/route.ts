import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

// NOTE: Legacy level/xp based stage logic removed. If UX stage tagging is needed,
// derive from streak + bytes (e.g. newcomer <5 streak & <250 bytes, core <1000 bytes,
// power >=1000 bytes or streak >=30). Left intentionally unimplemented here to
// avoid reintroducing derived gamification complexity in this lightweight route.

export async function GET(_request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Ensure daily actions helper table exists
    await db.execute(sql`CREATE TABLE IF NOT EXISTS user_daily_actions (
      user_id text NOT NULL,
      action_date date NOT NULL,
      checkin boolean NOT NULL DEFAULT false,
      no_contact boolean NOT NULL DEFAULT false,
      ritual boolean NOT NULL DEFAULT false,
      PRIMARY KEY (user_id, action_date)
    )`);

    // Load user fresh (minimal fields)
    const rows = await db.execute(sql`SELECT bytes, streak, no_contact_days FROM users WHERE id = ${user.id}`);
    const fresh = rows[0] || {};

    // Today's actions
    const today = await db.execute(sql`SELECT checkin, no_contact, ritual FROM user_daily_actions WHERE user_id = ${user.id} AND action_date = CURRENT_DATE`);
    const todayActions = {
      checkIn: today[0]?.checkin || false,
      noContact: today[0]?.no_contact || false,
      ritual: today[0]?.ritual || false,
    };

    // Simple counts (placeholder logic can be enhanced later)
  const totalRitualsResult = await db.execute(sql`SELECT COUNT(*) as c FROM user_ritual_assignments WHERE user_id = ${user.id} AND completed_at IS NOT NULL`);
  const totalRituals = parseInt(((totalRitualsResult[0] as any)?.c ?? '0').toString(), 10);

  // Derive total check-ins from helper table (count of days with checkin true)
  const totalCheckInsResult = await db.execute(sql`SELECT COUNT(*) as c FROM user_daily_actions WHERE user_id = ${user.id} AND checkin = true`);
  const totalCheckIns = parseInt(((totalCheckInsResult[0] as any)?.c ?? '0').toString(), 10);

  const totalNoContacts = fresh.no_contact_days || 0;

    // Build response matching DashboardV2 expectations
    const response = {
      user: {
        bytes: fresh.bytes || 0,
        streak: fresh.streak || 0,
        totalRituals,
  totalCheckIns,
  totalNoContacts,
        tier: (user as any).tier || (user as any).subscriptionTier || 'ghost'
      },
      todayActions,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
