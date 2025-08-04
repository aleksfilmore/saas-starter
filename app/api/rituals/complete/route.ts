import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';

export const runtime = 'nodejs';

/**
 * POST /api/rituals/complete
 * Mark a ritual as completed and award XP/Bytes
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ritualId } = await request.json();
    
    if (!ritualId) {
      return NextResponse.json({ error: 'Ritual ID required' }, { status: 400 });
    }

    console.log('🎉 Completing ritual for user:', user.id, 'ritual:', ritualId);

    // Check if ritual is current and not already completed
    const currentRitual = await db.execute(sql`
      SELECT ur.*, r.title, r.xp_reward, r.byte_reward
      FROM user_rituals ur
      JOIN rituals r ON r.id = ur.ritual_id
      WHERE ur.user_id = ${user.id} 
        AND ur.ritual_id = ${ritualId}
        AND ur.is_current = true
        AND ur.completed_at IS NULL
    `);

    if (currentRitual.length === 0) {
      return NextResponse.json({
        error: 'Ritual not found or already completed'
      }, { status: 404 });
    }

    const ritual = currentRitual[0];

    // Complete the ritual using the stored function
    const result = await db.execute(sql`
      SELECT complete_ritual(${user.id}, ${ritualId}) as result
    `);

    const completionResult = result[0]?.result;

    console.log('✅ Ritual completed:', ritual.title);

    // Check for milestones
    const userStats = await db.execute(sql`
      SELECT 
        COUNT(*) as completed_count,
        bool_or(r.category = 'cult-missions') as has_cult_mission
      FROM user_rituals ur
      JOIN rituals r ON r.id = ur.ritual_id
      WHERE ur.user_id = ${user.id} 
        AND ur.completed_at IS NOT NULL
    `);

    const completedCount = parseInt(String(userStats[0]?.completed_count) || '0');
    const milestones = [];

    // First ritual milestone
    if (completedCount === 1) {
      milestones.push({
        type: 'FIRST_RITUAL_DONE',
        title: 'System Initialization Complete',
        description: 'You\'ve completed your first ritual. The glitch begins.',
        xpBonus: 25,
        byteBonus: 50
      });

      // Update user UX stage if still in starter
      await db.execute(sql`
        UPDATE users 
        SET ux_stage = 'starter'
        WHERE id = ${user.id} AND ux_stage = 'welcome'
      `);
    }

    // Weekly milestone
    if (completedCount % 7 === 0 && completedCount > 0) {
      milestones.push({
        type: 'WEEKLY_STREAK',
        title: `Week ${completedCount / 7} Complete`,
        description: 'Seven days of intentional chaos. Keep the momentum.',
        xpBonus: 50,
        byteBonus: 75
      });
    }

    return NextResponse.json({
      success: true,
      ritual: {
        id: ritualId,
        title: ritual.title,
        completedAt: new Date().toISOString()
      },
      rewards: {
        xp: ritual.xp_reward,
        bytes: ritual.byte_reward
      },
      milestones,
      stats: {
        totalCompleted: completedCount
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
