import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/unified-schema';
import { eq, sql } from 'drizzle-orm';

// Return highest priority nudge suggestion for current user.
// Priority heuristic v1:
// 1. Inactivity > 6h since last ritual & no ritual today => easy_win
// 2. Streak risk: streak > 0 and last ritual yesterday (>20h) => streak_save
// 3. Low momentum (xp < 50 & <2 completions in 3d) => momentum_seed
// 4. Default encouragement.
export async function GET(_req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [row] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const lastCompleted = row.last_ritual ? new Date(row.last_ritual) : null;
    const now = new Date();
    const hoursSince = lastCompleted ? (now.getTime() - lastCompleted.getTime()) / 36e5 : Infinity;

    const todayISO = new Date().toISOString().slice(0,10);
    const todayCountRes = await db.execute(sql`SELECT COUNT(*)::int AS c FROM daily_ritual_completions WHERE user_id = ${user.id} AND DATE(completed_at) = ${todayISO}`);
    const todayCount = (todayCountRes as any).rows?.[0]?.c || 0;

    const threeAgo = new Date(); threeAgo.setDate(threeAgo.getDate()-3); threeAgo.setHours(0,0,0,0);
    const recentCountRes = await db.execute(sql`SELECT COUNT(*)::int AS c FROM daily_ritual_completions WHERE user_id = ${user.id} AND completed_at >= ${threeAgo}`);
    const recentCount = (recentCountRes as any).rows?.[0]?.c || 0;

    let nudgeType: string = 'encourage';
    let message = 'Keep showing up—tiny actions compound.';

    if (hoursSince > 6 && todayCount === 0) {
      nudgeType = 'easy_win';
      message = 'Quick 2‑min ritual now protects your streak momentum.';
    } else if (row.ritual_streak > 0 && hoursSince > 20) {
      nudgeType = 'streak_save';
      message = `Your ${row.ritual_streak}‑day streak is vulnerable—lock it in with one action.`;
    } else if ((row.xp || 0) < 50 && recentCount < 2) {
      nudgeType = 'momentum_seed';
      message = 'Plant another small win to start your momentum curve.';
    }

    return NextResponse.json({ nudge: { type: nudgeType, message, hoursSinceLast: hoursSince } });
  } catch (e) {
    console.error('Nudge error', e);
    return NextResponse.json({ error: 'Failed to compute nudge' }, { status: 500 });
  }
}
