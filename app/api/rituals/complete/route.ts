import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';
import { RITUAL_BANK } from '@/lib/rituals/ritual-bank';

export const runtime = 'nodejs';

/**
 * POST /api/rituals/complete
 * Mark a ritual as completed and award XP/Bytes based on user tier
 */
export async function POST(request: NextRequest) {
  try {
    const { ritualId, difficulty = 'medium' } = await request.json();
    
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!ritualId) {
      return NextResponse.json({ error: 'Missing ritualId' }, { status: 400 });
    }

    console.log('🎉 Completing ritual for user:', user.id, 'ritual:', ritualId);

    // Find the ritual in the ritual bank
    const ritual = RITUAL_BANK.find(r => r.id === ritualId);
    if (!ritual) {
      return NextResponse.json({ error: 'Ritual not found in bank' }, { status: 404 });
    }

    // Check if user has already completed this ritual today
    const existingCompletion = await db.execute(sql`
      SELECT id FROM user_ritual_assignments
      WHERE user_id = ${user.id} 
        AND ritual_key = ${ritualId}
        AND DATE(assigned_at) = CURRENT_DATE
        AND completed_at IS NOT NULL
      LIMIT 1
    `);

    if (existingCompletion.length > 0) {
      return NextResponse.json({ error: 'Ritual already completed today' }, { status: 400 });
    }

    // Mark the ritual as completed
    await db.execute(sql`
      UPDATE user_ritual_assignments 
      SET completed_at = NOW()
      WHERE user_id = ${user.id} 
        AND ritual_key = ${ritualId}
        AND DATE(assigned_at) = CURRENT_DATE
        AND completed_at IS NULL
    `);

    // Calculate rewards from the ritual bank
    const xpReward = ritual.xpReward;
    const byteReward = ritual.byteReward;

    // Update user stats
    const currentUserData = await db.execute(sql`
      SELECT xp, level, streak FROM users WHERE id = ${user.id}
    `);

    const currentUser = currentUserData[0] as { xp: number; level: number; streak: number } | undefined;
    const newXP = (currentUser?.xp || 0) + xpReward;
    const newLevel = Math.floor(newXP / 1000) + 1;
    const newStreak = (currentUser?.streak || 0) + 1;

    await db.execute(sql`
      UPDATE users 
      SET 
        xp = ${newXP},
        level = ${newLevel},
        streak = ${newStreak}
      WHERE id = ${user.id}
    `);

    const leveledUp = newLevel > (currentUser?.level || 1);

    console.log('✅ Ritual completed:', ritual.title, 'XP:', xpReward, 'Bytes:', byteReward);

    return NextResponse.json({
      success: true,
      ritual: {
        id: ritual.id,
        title: ritual.title,
        completedAt: new Date().toISOString()
      },
      rewards: {
        xp: xpReward,
        bytes: byteReward,
        leveledUp,
        newLevel
      },
      user: {
        xp: newXP,
        level: newLevel,
        streak: newStreak
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
