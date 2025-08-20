import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Users can only access their own stats unless they're admin
    if (sessionUser.id !== params.id && sessionUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userData = await db
      .select()
      .from(users)
      .where(eq(users.id, params.id))
      .limit(1);

    if (!userData.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userData[0];

    // Calculate derived stats
    const currentLevel = user.level || 1;
    const currentXP = user.xp || 0;
    const xpForCurrentLevel = (currentLevel - 1) * 100;
    const xpForNextLevel = currentLevel * 100;
    const xpProgress = currentXP - xpForCurrentLevel;
    const xpNeeded = xpForNextLevel - currentXP;

    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        totalXP: currentXP,
        totalBytes: user.bytes || 0,
        currentLevel,
        xpProgress,
        xpNeeded: xpNeeded > 0 ? xpNeeded : 0,
        ritualStreak: user.streak || 0,
        noContactStreak: user.noContactDays || 0,
        totalRitualsCompleted: 0, // Would need ritual completions table
        totalCheckIns: 0, // Would need check-in history table
        achievements: [], // Would need achievements table
        lastActivity: user.lastRitualCompleted || user.lastNoContactCheckin || user.updatedAt,
        joinedAt: user.createdAt,
        tier: user.tier || 'ghost',
        subscriptionStatus: user.subscriptionTier,
        isActive: !user.isBanned,
      }
    });

  } catch (error) {
    console.error('Get user stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
