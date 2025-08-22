import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Users can only access their own progress unless they're admin
    if (sessionUser.id !== resolvedParams.userId) {
      const adminCheck = await db
        .select({ isAdmin: users.isAdmin })
        .from(users)
        .where(eq(users.id, sessionUser.id))
        .limit(1);
      
      if (!adminCheck.length || !adminCheck[0].isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const userData = await db
      .select()
      .from(users)
      .where(eq(users.id, resolvedParams.userId))
      .limit(1);

    if (!userData.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userData[0];

    return NextResponse.json({
      success: true,
      data: {
        currentStreak: user.noContactDays || 0,
        lastCheckinAt: user.lastNoContactCheckin,
        isStreakThreatened: user.noContactStreakThreatened || false,
        totalDays: user.noContactDays || 0,
        longestStreak: user.noContactDays || 0, // Would need streak history table for accurate longest
        shieldActive: false, // Would need shield system implementation
        nextMilestone: calculateNextMilestone(user.noContactDays || 0),
        milestoneRewards: getMilestoneRewards(user.noContactDays || 0)
      }
    });

  } catch (error) {
    console.error('Get no-contact progress API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateNextMilestone(currentDays: number): { days: number; reward: string } {
  const milestones = [7, 14, 30, 60, 90, 180, 365];
  const nextMilestone = milestones.find(m => m > currentDays) || 365;
  
  const rewards = {
    7: '8 Bytes + Weekly Warrior badge',
    14: '12 Bytes + Two Week Champion badge',
    30: '20 Bytes + Monthly Master badge',
    60: '30 Bytes + 60-Day Defender badge',
    90: '50 Bytes + 90-Day Guardian badge',
    180: '75 Bytes + Half-Year Hero badge',
    365: '100 Bytes + Year-Long Legend badge'
  };

  return {
    days: nextMilestone,
    reward: rewards[nextMilestone as keyof typeof rewards] || 'Special recognition'
  };
}

function getMilestoneRewards(currentDays: number): Array<{ days: number; reward: string; achieved: boolean }> {
  const milestones = [
    { days: 7, reward: '8 Bytes + Weekly Warrior badge' },
    { days: 14, reward: '12 Bytes + Two Week Champion badge' },
    { days: 30, reward: '20 Bytes + Monthly Master badge' },
    { days: 60, reward: '30 Bytes + 60-Day Defender badge' },
    { days: 90, reward: '50 Bytes + 90-Day Guardian badge' },
    { days: 180, reward: '75 Bytes + Half-Year Hero badge' },
    { days: 365, reward: '100 Bytes + Year-Long Legend badge' }
  ];

  return milestones.map(milestone => ({
    ...milestone,
    achieved: currentDays >= milestone.days
  }));
}
