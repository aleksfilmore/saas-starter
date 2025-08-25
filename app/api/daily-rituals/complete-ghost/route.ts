import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';
import { RITUAL_BANK } from '@/lib/rituals/ritual-bank';
import { triggerRitualBadgeEvent } from '@/lib/rituals/badge-events';

// Lightweight completion for ghost (single ritual path) aligning response shape with premium `/api/daily-rituals/complete`.
export async function POST(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { ritualId } = await req.json();
    if (!ritualId) return NextResponse.json({ error: 'Missing ritualId' }, { status: 400 });

    const ritual = RITUAL_BANK.find(r => r.id === ritualId);
    if (!ritual) return NextResponse.json({ error: 'Ritual not found' }, { status: 404 });

    // Ensure assignment exists today (ghost_daily_assignments ensures uniqueness)
    const timezoneRow = await db.execute(sql`SELECT timezone FROM users WHERE id = ${user.id}`);
    const tz = timezoneRow[0]?.timezone || 'UTC';
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: String(tz), year: 'numeric', month: '2-digit', day: '2-digit' });
    const todayLocal = fmt.format(new Date());
    const existing = await db.execute(sql`SELECT id FROM ghost_daily_assignments WHERE user_id = ${user.id} AND assigned_date = ${todayLocal} AND ritual_id = ${ritualId}`);
    if (!existing.length) return NextResponse.json({ error: 'No active assignment' }, { status: 400 });
    // Track completion in ritual_history (increment)
    try {
      await db.execute(sql`UPDATE user_ritual_history SET completion_count = completion_count + 1 WHERE user_id = ${user.id} AND ritual_id = ${ritualId}`);
    } catch {}

    // Basic byte reward (reuse ritual.byteReward); xp phased out
  try { await db.execute(sql`UPDATE users SET bytes = bytes + ${ritual.byteReward}, ritual_streak = ritual_streak + 1, last_ritual = NOW() WHERE id = ${user.id}`); } catch {}
    triggerRitualBadgeEvent(user.id, { ritualId, category: ritual.category, mode: 'ghost' });
  return NextResponse.json({ success: true, data: { bytesEarned: ritual.byteReward, streakDays: 0 } });
  } catch (e) {
    console.error('Ghost ritual complete error', e);
    return NextResponse.json({ error: 'Failed to complete ritual' }, { status: 500 });
  }
}