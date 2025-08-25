import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';
import { AnalyticsEvents } from '@/lib/analytics/events';
import { emitAnalytics } from '@/lib/analytics/emit';
import { withRateLimit, strictRateLimit } from '@/lib/middleware/rate-limiter';

export const runtime = 'nodejs';
const BYTES_REWARD = 5;

async function handler(_req: NextRequest) {
  try {
    let { user } = await validateRequest();
    if (!user && process.env.TEST_MODE === 'true' && (globalThis as any).__TEST_USER_ID__) {
      user = { id: (globalThis as any).__TEST_USER_ID__ } as any;
    }
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await db.execute(sql`CREATE TABLE IF NOT EXISTS user_daily_actions (
      user_id text NOT NULL,
      action_date date NOT NULL,
      checkin boolean NOT NULL DEFAULT false,
      no_contact boolean NOT NULL DEFAULT false,
      ritual boolean NOT NULL DEFAULT false,
      wall_interact boolean NOT NULL DEFAULT false,
      ai_chat boolean NOT NULL DEFAULT false,
      wall_post boolean NOT NULL DEFAULT false,
      PRIMARY KEY (user_id, action_date)
    )`);

    const existing = await db.execute(sql`SELECT ai_chat FROM user_daily_actions WHERE user_id = ${user.id} AND action_date = CURRENT_DATE`);
    if (existing.length === 0) {
      await db.execute(sql`INSERT INTO user_daily_actions (user_id, action_date, ai_chat) VALUES (${user.id}, CURRENT_DATE, true)`);
  await awardBytes(user.id, 'daily_ai_chat', BYTES_REWARD);
  await emitAnalytics(AnalyticsEvents.DAILY_ACTION_AI_CHAT_COMPLETED, { userId: user.id, properties:{ source:'dashboard' } });
      return NextResponse.json({ success: true, completed: true, alreadyCompleted: false });
    }
    if (existing[0].ai_chat) {
      return NextResponse.json({ success: true, completed: true, alreadyCompleted: true });
    }
    await db.execute(sql`UPDATE user_daily_actions SET ai_chat = true WHERE user_id = ${user.id} AND action_date = CURRENT_DATE`);
  await awardBytes(user.id, 'daily_ai_chat', BYTES_REWARD);
  await emitAnalytics(AnalyticsEvents.DAILY_ACTION_AI_CHAT_COMPLETED, { userId: user.id, properties:{ source:'dashboard' } });
    return NextResponse.json({ success: true, completed: true, alreadyCompleted: false });
  } catch (e) {
    console.error('aiChat action error', e);
    return NextResponse.json({ error: 'Failed to record ai chat action' }, { status: 500 });
  }
}

export const POST = withRateLimit(handler, strictRateLimit);

async function awardBytes(userId: string, activity: string, amount: number) {
  try {
    await db.execute(sql`INSERT INTO user_byte_history (user_id, activity, amount, created_at) VALUES (${userId}, ${activity}, ${amount}, NOW())`);
    await db.execute(sql`UPDATE users SET bytes = bytes + ${amount} WHERE id = ${userId}`);
  } catch (e) { console.warn('awardBytes failed', e); }
}
// emit function removed (centralized)
