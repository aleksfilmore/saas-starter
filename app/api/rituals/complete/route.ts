
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';
import { RITUAL_BANK } from '@/lib/rituals/ritual-bank';
import { ByteService } from '@/lib/shop/ByteService';

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

    // Check if user has already completed ANY ritual today for this specific assignment
    const existingCompletion = await db.execute(sql`
      SELECT id, ritual_key, completed_at FROM user_ritual_assignments
      WHERE user_id = ${user.id} 
        AND ritual_key = ${ritualId}
        AND DATE(assigned_at) = CURRENT_DATE
        AND rerolled = false
      ORDER BY assigned_at DESC
      LIMIT 1
    `);

    if (existingCompletion.length > 0 && existingCompletion[0].completed_at) {
      return NextResponse.json({ 
        error: 'Ritual already completed today',
        message: 'You have already completed this ritual today. Come back tomorrow for a new ritual!'
      }, { status: 400 });
    }

    if (existingCompletion.length === 0) {
      return NextResponse.json({ 
        error: 'No active ritual assignment',
        message: 'This ritual is not currently assigned to you.'
      }, { status: 400 });
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

    // 🎯 BYTE ECONOMY: Award bytes for ritual completion
    let actualBytesAwarded = 0;
    let streakBonus = 0;
    try {
      // Award base ritual completion bytes - use DAILY_RITUAL_1 for now
      const byteTransaction = await ByteService.awardBytes(
        user.id,
        'DAILY_RITUAL_1',
        {
          ritualId,
          difficulty: difficulty,
          description: `Completed ritual: ${ritual.title}`
        }
      );
      
      if (byteTransaction) {
        actualBytesAwarded = byteTransaction.bytesAwarded;
        console.log(`💰 Awarded ${actualBytesAwarded} Bytes for ritual completion`);
      }

      // 🏆 STREAK BONUS: Check for streak milestones and award bonus after getting the streak count
      
    } catch (byteError) {
      console.warn('⚠️ Byte award failed (non-blocking):', byteError);
      // Continue with ritual completion even if byte award fails
    }

    // Update user stats
    const currentUserData = await db.execute(sql`
      SELECT xp, level, ritual_streak FROM users WHERE id = ${user.id}
    `);

    const currentUser = currentUserData[0] as { xp: number; level: number; ritual_streak: number } | undefined;
    const newXP = (currentUser?.xp || 0) + xpReward;
    const newLevel = Math.floor(newXP / 1000) + 1;
    const newRitualStreak = (currentUser?.ritual_streak || 0) + 1;

    // Award streak bonuses after we have the streak count
    try {
      const currentStreakCount = newRitualStreak;
      
      // Award streak bonuses at specific milestones
      if (currentStreakCount === 2) {
        const streakTransaction = await ByteService.awardStreakBonus(user.id, 'ritual', currentStreakCount);
        if (streakTransaction && streakTransaction.success && streakTransaction.bytesAwarded) {
          streakBonus = streakTransaction.bytesAwarded;
          actualBytesAwarded += streakBonus;
          console.log(`🔥 2-day streak bonus: ${streakBonus} Bytes`);
        }
      } else if (currentStreakCount === 7) {
        const streakTransaction = await ByteService.awardStreakBonus(user.id, 'ritual', currentStreakCount);
        if (streakTransaction && streakTransaction.success && streakTransaction.bytesAwarded) {
          streakBonus = streakTransaction.bytesAwarded;
          actualBytesAwarded += streakBonus;
          console.log(`🔥 7-day streak bonus: ${streakBonus} Bytes`);
        }
      } else if (currentStreakCount === 30) {
        const streakTransaction = await ByteService.awardStreakBonus(user.id, 'ritual', currentStreakCount);
        if (streakTransaction && streakTransaction.success && streakTransaction.bytesAwarded) {
          streakBonus = streakTransaction.bytesAwarded;
          actualBytesAwarded += streakBonus;
          console.log(`🔥 30-day streak bonus: ${streakBonus} Bytes`);
        }
      }
      
    } catch (streakError) {
      console.warn('⚠️ Streak bonus failed (non-blocking):', streakError);
    }

    await db.execute(sql`
      UPDATE users 
      SET 
        xp = ${newXP},
        level = ${newLevel},
        ritual_streak = ${newRitualStreak}
      WHERE id = ${user.id}
    `);

    const leveledUp = newLevel > (currentUser?.level || 1);

    // 🎯 BADGE SYSTEM: Trigger badge check-in for ritual completion
    try {
      const badgeResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/badges/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          eventType: 'ritual_completed',
          payload: {
            ritualId: ritualId,
            journalWordCount: 0, // Could be extracted from ritual completion
            timeSpent: 300, // Default 5 minutes in seconds
            category: ritual.category || 'mindfulness'
          }
        })
      });
      
      if (badgeResponse.ok) {
        const badgeData = await badgeResponse.json();
        console.log('🎖️ Badge check-in successful:', badgeData);
      }
    } catch (badgeError) {
      // Don't fail the ritual completion if badge system has issues
      console.warn('⚠️ Badge check-in failed (non-blocking):', badgeError);
    }

    console.log('✅ Ritual completed:', ritual.title, 'XP:', xpReward, 'Bytes:', actualBytesAwarded);

    return NextResponse.json({
      success: true,
      ritual: {
        id: ritual.id,
        title: ritual.title,
        completedAt: new Date().toISOString()
      },
      rewards: {
        xp: xpReward,
        bytes: actualBytesAwarded, // Return actual bytes awarded
        streakBonus: streakBonus, // Include streak bonus info
        leveledUp,
        newLevel
      },
      user: {
        xp: newXP,
        level: newLevel,
        streak: newRitualStreak
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
