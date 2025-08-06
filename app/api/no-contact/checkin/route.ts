import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function PATCH(request: NextRequest) {
  try {
    // Use session-based authentication
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user data
    const userData = await db
      .select()
      .from(users)
      .where(eq(users.id, sessionUser.id))
      .limit(1);

    if (!userData.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userData[0];
    const now = new Date();
    
    // Check if already checked in today (prevent double check-ins)
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
        noContactStreakThreatened: false, // Reset threatened status
        xp: sql`${users.xp} + ${xpEarned}`,
        bytes: sql`${users.bytes} + ${bytesEarned}`,
        streakDays: sql`${users.streakDays} + 1`, // Also increment overall streak
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({
      success: true,
      message: 'Daily check-in completed successfully',
      xpEarned,
      bytesEarned,
      newStreakDays: (user.noContactDays || 0) + 1,
      nextCheckinAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
    });

  } catch (error) {
    console.error('No-contact check-in API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Use session-based authentication
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user data
    const userData = await db
      .select()
      .from(users)
      .where(eq(users.id, sessionUser.id))
      .limit(1);

    if (!userData.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userData[0];
    const now = new Date();
    
    let status = 'need_check';
    let hoursUntilThreatened = 0;
    let canCheckIn = true;
    
    if (user.lastNoContactCheckin) {
      const lastCheckin = new Date(user.lastNoContactCheckin);
      const hoursSinceCheckin = (now.getTime() - lastCheckin.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceCheckin < 24) {
        status = 'ok';
        canCheckIn = false;
        hoursUntilThreatened = 0;
      } else if (hoursSinceCheckin >= 24 && hoursSinceCheckin < 36) {
        status = 'need_check';
        hoursUntilThreatened = 36 - hoursSinceCheckin;
        canCheckIn = true;
      } else {
        status = 'threatened';
        canCheckIn = true;
      }
    }

    return NextResponse.json({
      status,
      canCheckIn,
      hoursUntilThreatened,
      currentStreak: user.noContactDays || 0,
      lastCheckinAt: user.lastNoContactCheckin?.toISOString() || null,
      isStreakThreatened: user.noContactStreakThreatened || false
    });

  } catch (error) {
    console.error('No-contact status API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
