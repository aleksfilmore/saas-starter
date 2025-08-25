import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    // Users can only access their own stats unless they're admin
    if (sessionUser.id !== resolvedParams.id) {
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
      .where(eq(users.id, resolvedParams.id))
      .limit(1);

    if (!userData.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userData[0];

  // Derived progress: bytes milestones (every 1000 bytes)
  const bytes = user.bytes || 0;
  const milestone = Math.floor(bytes / 1000) + 1;
  const milestoneProgress = bytes % 1000;
  const milestoneRemaining = 1000 - milestoneProgress;

    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
  totalBytes: bytes,
  milestone,
  milestoneProgress,
  milestoneRemaining,
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
