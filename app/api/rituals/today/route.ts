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

    // Determine user tier for ritual selection
    const userTier = (user as any).subscription_tier === 'premium' ? 'premium' : 'free';
    console.log('👤 User tier:', userTier);

  // Check for current ritual
    const currentRitual = await db.execute(sql`
      SELECT 
        r.id,
        r.title,
        r.description,
        r.steps,
        r.difficulty,
        COALESCE(r.xp_reward, 15) as xp_reward,
        25 as bytes_reward,
        r.duration,
        r.category,
        r.tier_requirement as tier,
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
      
  const userRitualTier = (user as any).ritual_tier as string | undefined;
  const tierMismatch = userRitualTier && ritual.tier && userRitualTier !== ritual.tier;
      return NextResponse.json({
        ritual: {
          id: ritual.id,
          title: ritual.title,
          description: ritual.description,
          steps: ritual.steps,
          difficulty: ritual.difficulty,
          xpReward: ritual.xp_reward,
          byteReward: ritual.bytes_reward,
          estimatedTime: ritual.duration,
          category: ritual.category,
          tier: ritual.tier,
          deliveredAt: ritual.delivered_at,
          completedAt: ritual.completed_at,
          isCompleted: !!ritual.completed_at,
          tierMismatch
        },
        warning: tierMismatch ? `Assigned ritual tier (${ritual.tier}) differs from user tier (${userRitualTier}).` : undefined
      });
    }

    // No current ritual, assign a new one
    console.log('🎲 No current ritual, assigning new one...');
    console.log('🔧 Using NEW DIRECT LIBRARY QUERY (not database function)');
    
    // Use simplified ritual assignment from ritual_library
    const newRitualResult = await db.execute(sql`
      SELECT 
        id,
        title,
        description,
        steps,
        difficulty,
        COALESCE(xp_reward, 15) as xp_reward,
        25 as bytes_reward,
        duration,
        category,
        tier_requirement as tier
      FROM ritual_library 
      WHERE (
        ${userTier === 'premium' ? sql`(is_premium = true OR is_premium = false OR is_premium IS NULL)` : sql`(is_premium = false OR is_premium IS NULL)`}
      )
        AND category IS NOT NULL
        AND title IS NOT NULL
        AND is_active = true
        AND id NOT IN (
          SELECT DISTINCT ritual_id 
          FROM user_rituals 
          WHERE user_id = ${user.id}
        )
      ORDER BY RANDOM()
      LIMIT 1
    `);

    if (newRitualResult.length === 0) {
      // Fallback: get any ritual they haven't done from ritual_library
      const fallbackRitual = await db.execute(sql`
        SELECT 
          id, 
          title, 
          description, 
          steps, 
          difficulty, 
          COALESCE(xp_reward, 15) as xp_reward, 
          25 as bytes_reward, 
          duration,
          category,
          tier_requirement as tier
        FROM ritual_library 
        WHERE is_active = true
          AND id NOT IN (
            SELECT DISTINCT ritual_id FROM user_rituals WHERE user_id = ${user.id}
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
      INSERT INTO user_rituals (user_id, ritual_id, is_current, delivered_at)
      VALUES (${user.id}, ${newRitual.id}, true, NOW())
    `);

    console.log('✨ Assigned new ritual:', newRitual.title);

  const userRitualTier = (user as any).ritual_tier as string | undefined;
  const tierMismatch = userRitualTier && newRitual.tier && userRitualTier !== newRitual.tier;
    return NextResponse.json({
      ritual: {
        id: newRitual.id,
        title: newRitual.title,
        description: newRitual.description,
        steps: newRitual.steps,
        difficulty: newRitual.difficulty,
        xpReward: newRitual.xp_reward,
        byteReward: newRitual.bytes_reward,
        estimatedTime: newRitual.duration,
        deliveredAt: new Date().toISOString(),
        completedAt: null,
        isCompleted: false,
        tier: newRitual.tier,
        tierMismatch
      },
      warning: tierMismatch ? `Assigned ritual tier (${newRitual.tier}) differs from user tier (${userRitualTier}).` : undefined
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
      hoursLeft: Math.ceil(hoursLeft),
      cooldownHours
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
