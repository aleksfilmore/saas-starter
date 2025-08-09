/**
 * CTRL+ALT+BLOCK™ v1.1 - Rate Limit Check API
 * Implements ≤2 completes/10 min rate limiting per specification section 6
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { ritualCompletions } from '@/lib/db/schema';
import { eq, and, gte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check completions in last 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    
    const recentCompletions = await db
      .select({ completedAt: ritualCompletions.completedAt })
      .from(ritualCompletions)
      .where(
        and(
          eq(ritualCompletions.userId, sessionUser.id),
          gte(ritualCompletions.completedAt, tenMinutesAgo)
        )
      );

    const allowed = recentCompletions.length < 2;
    const nextAllowedTime = allowed ? null : new Date(
      Math.max(...recentCompletions.map(c => c.completedAt!.getTime())) + 10 * 60 * 1000
    );

    return NextResponse.json({
      allowed,
      recentCompletions: recentCompletions.length,
      maxPerTenMinutes: 2,
      nextAllowedTime,
      cooldownSeconds: nextAllowedTime ? Math.max(0, Math.ceil((nextAllowedTime.getTime() - Date.now()) / 1000)) : 0
    });

  } catch (error) {
    console.error('Rate limit check error:', error);
    return NextResponse.json(
      { error: 'Failed to check rate limit' },
      { status: 500 }
    );
  }
}
