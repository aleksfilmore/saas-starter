import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, rituals, ritualCompletions, xpTransactions, byteTransactions } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { calculateRewards } from '@/lib/user/user-tier-service';
import { generateId } from '@/lib/utils';

export const runtime = 'nodejs';

/**
 * POST /api/rituals/complete
 * Mark a ritual as completed and award XP/Bytes based on user tier
 */
export async function POST(request: NextRequest) {
  try {
    const { ritualId, difficulty = 'medium', notes, mood } = await request.json();
    
    // Get authenticated user
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!ritualId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('🎉 Completing ritual for user:', sessionUser.email, 'ritual:', ritualId);

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

    // Get the ritual from the rituals table (template/definition table)
    let ritual;
    try {
      const ritualData = await db
        .select()
        .from(rituals)
        .where(eq(rituals.id, ritualId))
        .limit(1);

      if (!ritualData.length) {
        return NextResponse.json({ error: 'Ritual not found' }, { status: 404 });
      }

      ritual = ritualData[0];
    } catch (ritualError) {
      console.error('❌ Error querying ritual:', ritualError);
      
      // If the rituals table has a different structure, let's try to create a dummy ritual
      // This is a fallback for development
      ritual = {
        id: ritualId,
        title: 'Unknown Ritual',
        description: 'Ritual completion',
        category: 'general'
      };
      
      console.log('⚠️ Using fallback ritual data');
    }

    // Check if user has already completed this ritual today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    try {
      const existingCompletion = await db
        .select()
        .from(ritualCompletions)
        .where(and(
          eq(ritualCompletions.userId, user.id),
          eq(ritualCompletions.ritualId, ritualId)
        ))
        .limit(1);

      if (existingCompletion.length > 0) {
        return NextResponse.json({ error: 'Ritual already completed today' }, { status: 400 });
      }
    } catch (completionError) {
      console.warn('⚠️ Could not check existing completions:', completionError);
      // Continue with completion - better to allow than block
    }

    // Calculate rewards based on difficulty and user tier
    const baseRewards: Record<string, { xp: number, bytes: number }> = {
      easy: { xp: 25, bytes: 5 },
      medium: { xp: 50, bytes: 10 },
      hard: { xp: 100, bytes: 20 }
    };

    const baseReward = baseRewards[difficulty] || baseRewards.medium;
    const dashboardType = user.dashboardType || 'freemium';
    const rewards = calculateRewards(
      dashboardType as any,
      baseReward.xp,
      baseReward.bytes
    );

    // Record ritual completion in ritual_completions table
    try {
      await db.insert(ritualCompletions).values({
        id: generateId(),
        userId: user.id,
        ritualId: ritualId,
        completedAt: new Date(),
        notes: notes || null,
        mood: mood || null,
        createdAt: new Date()
      });
    } catch (insertError) {
      console.error('❌ Error recording ritual completion:', insertError);
      return NextResponse.json({ error: 'Failed to record ritual completion' }, { status: 500 });
    }

    // Update user stats
    const newXP = (user.xp || 0) + rewards.xp;
    const newBytes = (user.bytes || 0) + rewards.bytes;
    const newLevel = Math.floor(newXP / 1000) + 1;
    
    // Calculate streak
    const lastRitual = user.lastRitualCompleted;
    const isConsecutiveDay = lastRitual && 
      (today.getTime() - lastRitual.getTime()) <= (48 * 60 * 60 * 1000); // Within 48 hours
    
    const newStreak = isConsecutiveDay ? (user.streakDays || 0) + 1 : 1;
    const newLongestStreak = Math.max(user.longestStreak || 0, newStreak);

    await db
      .update(users)
      .set({
        xp: newXP,
        bytes: newBytes,
        level: newLevel,
        streakDays: newStreak,
        longestStreak: newLongestStreak,
        lastRitualCompleted: new Date(),
        protocolDay: (user.protocolDay || 0) + 1
      })
      .where(eq(users.id, user.id));

    // Record transactions
    try {
      await db.insert(xpTransactions).values({
        id: generateId(),
        userId: user.id,
        amount: rewards.xp,
        source: 'ritual_completion',
        description: `Completed ritual: ${ritual.title}`,
        relatedId: ritualId,
        createdAt: new Date()
      });

      await db.insert(byteTransactions).values({
        id: generateId(),
        userId: user.id,
        amount: rewards.bytes,
        source: 'ritual_completion',
        description: `Completed ritual: ${ritual.title}`,
        relatedId: ritualId,
        createdAt: new Date()
      });
    } catch (transactionError) {
      console.warn('Failed to record transactions:', transactionError);
      // Continue without failing the ritual completion
    }

    // Check for milestones
    const leveledUp = newLevel > (user.level || 1);
    const streakMilestones = [7, 14, 30, 60, 90];
    const achievedMilestone = streakMilestones.includes(newStreak);

    // Build milestones array
    const milestones = [];

    if (leveledUp) {
      milestones.push({
        type: 'LEVEL_UP',
        title: `Level ${newLevel} Achieved!`,
        description: 'Your healing protocol has evolved.',
        xpBonus: 0,
        byteBonus: newLevel * 10
      });
    }

    if (achievedMilestone) {
      milestones.push({
        type: 'STREAK_MILESTONE',
        title: `${newStreak}-Day Streak!`,
        description: 'Consistency is the path to healing.',
        xpBonus: newStreak * 5,
        byteBonus: newStreak * 2
      });
    }

    // First ritual completion
    if ((user.protocolDay || 0) === 0) {
      milestones.push({
        type: 'FIRST_RITUAL_DONE',
        title: 'System Initialization Complete',
        description: 'You\'ve completed your first ritual. The glitch begins.',
        xpBonus: 25,
        byteBonus: 50
      });
    }

    console.log('✅ Ritual completed:', ritual.title, 'XP:', rewards.xp, 'Bytes:', rewards.bytes);

    return NextResponse.json({
      success: true,
      ritual: {
        id: ritual.id,
        title: ritual.title,
        completedAt: new Date().toISOString()
      },
      rewards: {
        xp: rewards.xp,
        bytes: rewards.bytes,
        leveledUp,
        newLevel,
        streakUpdate: {
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          achievedMilestone
        }
      },
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        xp: newXP,
        bytes: newBytes,
        level: newLevel,
        streak: newStreak,
        longestStreak: newLongestStreak,
        protocolDay: (user.protocolDay || 0) + 1,
        subscriptionTier: user.subscriptionTier,
        noContactDays: user.noContactDays || 0
      },
      milestones,
      stats: {
        totalCompleted: (user.protocolDay || 0) + 1
      }
    });

  } catch (error) {
    console.error('❌ Error completing ritual:', error);
    return NextResponse.json(
      { error: 'Failed to complete ritual', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
