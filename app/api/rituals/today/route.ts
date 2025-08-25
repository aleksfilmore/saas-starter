import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';
import { FREE_RITUALS, ALL_RITUALS, getRandomRituals, type Ritual } from '@/lib/ritual-bank';

export const runtime = 'nodejs';

/**
 * GET /api/rituals/today
 * Returns the current ritual for the user, or assigns a new one if none exists
 */
export async function GET(request: NextRequest) {
  try {
  // DEPRECATED: use /api/dashboard/hub (for summary) or /api/daily-rituals/today
  // Kept temporarily for backward compatibility
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔮 Getting today\'s ritual for user:', user.id);

    // Determine if user has premium access
    const isPremium = (user as any)?.subscription_tier === 'premium' || 
                     (user as any)?.tier === 'firewall' ||
                     (user as any)?.ritual_tier === 'firewall';
    
    console.log('👤 User premium status:', isPremium);

    // Select ritual bank based on user tier
    const availableRituals = isPremium ? ALL_RITUALS : FREE_RITUALS;

    // Check for current ritual assignment
    const currentRitual = await db.execute(sql`
      SELECT 
        ritual_key,
        assigned_at,
        completed_at,
        rerolled
      FROM user_ritual_assignments
      WHERE user_id = ${user.id} 
        AND DATE(assigned_at) = CURRENT_DATE
        AND rerolled = false
      ORDER BY assigned_at DESC
      LIMIT 1
    `);

    let selectedRitual: Ritual;
    let isNewAssignment = false;

    if (currentRitual.length > 0 && currentRitual[0].ritual_key) {
      // Find the ritual from the ritual bank
      const foundRitual = availableRituals.find(r => r.id === currentRitual[0].ritual_key);
      if (foundRitual) {
        selectedRitual = foundRitual;
        console.log('📋 Found existing ritual assignment:', selectedRitual.title);
      } else {
        // Fallback if ritual key not found in bank - get random ritual
        const randomRituals = getRandomRituals(undefined, 1);
        selectedRitual = randomRituals[0];
        isNewAssignment = true;
      }
    } else {
      // No current ritual, assign a new one
      console.log('🎲 No current ritual, assigning new one');
      
      // Get rituals user hasn't done today
      const todaysCompletedRituals = await db.execute(sql`
        SELECT DISTINCT ritual_key 
        FROM user_ritual_assignments
        WHERE user_id = ${user.id} 
          AND DATE(assigned_at) = CURRENT_DATE
          AND completed_at IS NOT NULL
      `);

      const completedKeys = todaysCompletedRituals.map(r => r.ritual_key);
      console.log('✅ Already completed today:', completedKeys);

      // Filter available rituals to exclude completed ones
      const uncompletedRituals = availableRituals.filter(ritual => 
        !completedKeys.includes(ritual.id)
      );

      if (uncompletedRituals.length === 0) {
        // User has completed all available rituals for their tier today
        return NextResponse.json({
          error: 'No available rituals',
          message: 'You\'ve completed all available rituals for today! Check back tomorrow for fresh content.'
        }, { status: 404 });
      }

      // Select random ritual from uncompleted ones
      selectedRitual = uncompletedRituals[Math.floor(Math.random() * uncompletedRituals.length)];
      isNewAssignment = true;

      // Record the assignment
      await db.execute(sql`
        INSERT INTO user_ritual_assignments (user_id, ritual_key, assigned_at)
        VALUES (${user.id}, ${selectedRitual.id}, NOW())
      `);

      console.log('✨ Assigned new ritual:', selectedRitual.title);
    }

    // Check if ritual is completed
    const isCompleted = currentRitual.length > 0 && currentRitual[0].completed_at;

  // Deprecated XP model removed; provide only bytes rewards for backward compatibility consumers
  const difficultyBytes = {
      'easy': 15,
      'medium': 30,
      'hard': 60
    };

    return NextResponse.json({
      ritual: {
        id: selectedRitual.id,
        title: selectedRitual.title,
        description: selectedRitual.description,
        steps: [{
          title: selectedRitual.title,
          description: selectedRitual.description,
          duration: parseInt(selectedRitual.duration.replace(/\D/g, '')) || 15
        }],
        difficulty: selectedRitual.difficulty,
  byteReward: difficultyBytes[selectedRitual.difficulty], // formerly xpReward + byteReward (XP removed)
        estimatedTime: selectedRitual.duration,
        category: selectedRitual.category,
        tier: isPremium ? 'firewall' : 'ghost',
        deliveredAt: isNewAssignment ? new Date().toISOString() : currentRitual[0]?.assigned_at,
        completedAt: currentRitual[0]?.completed_at || null,
        isCompleted: !!isCompleted,
        isPremium: selectedRitual.isPremium || false
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
          hoursLeft: Math.ceil(hoursLeft),
          cooldownHours
        }, { status: 429 });
      }
    }

    // Mark current ritual assignment as rerolled
    await db.execute(sql`
      UPDATE user_ritual_assignments 
      SET rerolled = true
      WHERE user_id = ${user.id} 
        AND DATE(assigned_at) = CURRENT_DATE
        AND rerolled = false
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
