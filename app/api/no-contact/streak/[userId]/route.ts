import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Users can only update their own streak
    if (sessionUser.id !== resolvedParams.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { action, streakData } = body;

    const userData = await db
      .select()
      .from(users)
      .where(eq(users.id, resolvedParams.userId))
      .limit(1);

    if (!userData.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userData[0];
    const now = new Date();

    if (action === 'increment') {
      // Check if already checked in today
      if (user.lastNoContactCheckin) {
        const lastCheckin = new Date(user.lastNoContactCheckin);
        const timeSinceCheckin = now.getTime() - lastCheckin.getTime();
        const hoursSince = timeSinceCheckin / (1000 * 60 * 60);
        
        if (hoursSince < 24) {
          return NextResponse.json({ 
            error: 'Already checked in today', 
            message: 'You can check in again tomorrow',
            hoursUntilNext: 24 - hoursSince
          }, { status: 409 });
        }
      }

      // Award XP and Bytes for daily check-in
      const xpEarned = 15;
      const bytesEarned = 10;

      // Update user record
      await db
        .update(users)
        .set({
          lastNoContactCheckin: now,
          noContactDays: sql`${users.noContactDays} + 1`,
          noContactStreakThreatened: false,
          xp: sql`${users.xp} + ${xpEarned}`,
          bytes: sql`${users.bytes} + ${bytesEarned}`,
        })
        .where(eq(users.id, user.id));

      return NextResponse.json({
        success: true,
        message: 'Streak updated successfully',
        newStreak: (user.noContactDays || 0) + 1,
        xpEarned,
        bytesEarned
      });

    } else if (action === 'reset') {
      // Reset streak (contact was made)
      await db
        .update(users)
        .set({
          noContactDays: 0,
          noContactStreakThreatened: false,
          lastNoContactCheckin: now
        })
        .where(eq(users.id, user.id));

      return NextResponse.json({
        success: true,
        message: 'Streak reset. Starting fresh tomorrow.',
        newStreak: 0
      });

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Update no-contact streak API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
