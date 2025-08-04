import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';

export const runtime = 'nodejs';

/**
 * GET /api/rituals/today
 * Returns the current ritual for the user, or assigns a new one if none exists
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔮 Getting today\'s ritual for user:', user.id);

    // Check for current ritual
    const currentRitual = await db.execute(sql`
      SELECT 
        r.id,
        r.title,
        r.description,
        r.steps,
        r.difficulty,
        r.xp_reward,
        r.byte_reward,
        r.estimated_time,
        r.category,
        r.emotional_tone,
        r.tier,
        ur.delivered_at,
        ur.completed_at
      FROM user_rituals ur
      JOIN rituals r ON r.id = ur.ritual_id
      WHERE ur.user_id = ${user.id} 
        AND ur.is_current = true
      LIMIT 1
    `);

    // If user has current ritual, return it
    if (currentRitual.length > 0) {
      const ritual = currentRitual[0];
      console.log('📋 Found current ritual:', ritual.title);
      
      return NextResponse.json({
        ritual: {
          id: ritual.id,
          title: ritual.title,
          description: ritual.description,
          steps: ritual.steps,
          difficulty: ritual.difficulty,
          xpReward: ritual.xp_reward,
          byteReward: ritual.byte_reward,
          estimatedTime: ritual.estimated_time,
          category: ritual.category,
          emotionalTone: ritual.emotional_tone,
          tier: ritual.tier,
          deliveredAt: ritual.delivered_at,
          completedAt: ritual.completed_at,
          isCompleted: !!ritual.completed_at
        }
      });
    }

    // No current ritual, assign a new one
    console.log('🎲 No current ritual, assigning new one...');
    
    const newRitualResult = await db.execute(sql`
      SELECT * FROM get_next_ritual_for_user(${user.id})
    `);

    if (newRitualResult.length === 0) {
      // Fallback: get any ritual they haven't done
      const fallbackRitual = await db.execute(sql`
        SELECT id, title, description, steps, difficulty, xp_reward, byte_reward, estimated_time
        FROM rituals 
        WHERE id NOT IN (
          SELECT ritual_id FROM user_rituals WHERE user_id = ${user.id}
        )
        ORDER BY RANDOM()
        LIMIT 1
      `);

      if (fallbackRitual.length === 0) {
        return NextResponse.json({
          error: 'No available rituals',
          message: 'You\'ve completed all available rituals! New content coming soon.'
        }, { status: 404 });
      }

      newRitualResult.push(fallbackRitual[0]);
    }

    const newRitual = newRitualResult[0];

    // Assign this ritual to the user
    await db.execute(sql`
      INSERT INTO user_rituals (user_id, ritual_id, is_current)
      VALUES (${user.id}, ${newRitual.ritual_id}, true)
    `);

    console.log('✨ Assigned new ritual:', newRitual.title);

    return NextResponse.json({
      ritual: {
        id: newRitual.ritual_id,
        title: newRitual.title,
        description: newRitual.description,
        steps: newRitual.steps,
        difficulty: newRitual.difficulty,
        xpReward: newRitual.xp_reward,
        byteReward: newRitual.byte_reward,
        estimatedTime: newRitual.estimated_time,
        deliveredAt: new Date().toISOString(),
        completedAt: null,
        isCompleted: false
      }
    });

  } catch (error) {
    console.error('❌ Error fetching today\'s ritual:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ritual', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/rituals/today
 * Reroll today's ritual (once per 24h limit)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Reroll request for user:', user.id);

    // Check reroll cooldown
    const userInfo = await db.execute(sql`
      SELECT last_reroll_at FROM users WHERE id = ${user.id}
    `);

    const lastReroll = userInfo[0]?.last_reroll_at;
    const now = new Date();
    const cooldownHours = 24;

    if (lastReroll) {
      const timeSinceReroll = now.getTime() - new Date(lastReroll as string | number | Date).getTime();
      const hoursLeft = cooldownHours - (timeSinceReroll / (1000 * 60 * 60));
      
      if (hoursLeft > 0) {
        return NextResponse.json({
          error: 'Reroll on cooldown',
          hoursLeft: Math.ceil(hoursLeft)
        }, { status: 429 });
      }
    }

    // Mark current ritual as rerolled
    await db.execute(sql`
      UPDATE user_rituals 
      SET rerolled = true, is_current = false
      WHERE user_id = ${user.id} AND is_current = true
    `);

    // Update user's last reroll time
    await db.execute(sql`
      UPDATE users 
      SET last_reroll_at = ${now.toISOString()}
      WHERE id = ${user.id}
    `);

    console.log('🎲 Reroll completed, calling GET to assign new ritual...');

    // Use the GET logic to assign new ritual
    return GET(request);

  } catch (error) {
    console.error('❌ Error rerolling ritual:', error);
    return NextResponse.json(
      { error: 'Failed to reroll ritual', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
