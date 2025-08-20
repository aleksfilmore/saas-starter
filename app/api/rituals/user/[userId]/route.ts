import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { getUserSubscription } from '@/lib/stripe/subscription';
import { RITUAL_BANK, getRandomRitual } from '@/lib/rituals/ritual-bank';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Users can only access their own rituals unless they're admin
    if (sessionUser.id !== params.userId && sessionUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get user's tier for ritual filtering
    const subscription = await getUserSubscription(params.userId);
    const isPremium = subscription.tier === 'PREMIUM';
    const userTier = isPremium ? 'firewall' : 'ghost';

    // Get today's ritual assignments
    const todaysRituals = await db.execute(sql`
      SELECT 
        ritual_key,
        assigned_at,
        completed_at,
        rerolled
      FROM user_ritual_assignments
      WHERE user_id = ${params.userId}
        AND DATE(assigned_at) = CURRENT_DATE
        AND rerolled = false
      ORDER BY assigned_at DESC
    `);

    // Get completed rituals for this user
    const completedRituals = await db.execute(sql`
      SELECT DISTINCT ritual_key 
      FROM user_ritual_assignments
      WHERE user_id = ${params.userId} 
        AND completed_at IS NOT NULL
    `);

    const completedKeys = completedRituals.map(r => r.ritual_key);

    // Filter rituals by user tier
    const tierHierarchy = { 'ghost': 0, 'firewall': 1 };
    const userTierLevel = tierHierarchy[userTier];
    
    const availableRituals = RITUAL_BANK.filter(ritual => {
      const ritualTierLevel = tierHierarchy[ritual.tier];
      return ritualTierLevel <= userTierLevel;
    });

    // Map today's assignments to full ritual data
    const userRituals = todaysRituals.map(assignment => {
      const ritual = RITUAL_BANK.find(r => r.id === assignment.ritual_key);
      if (!ritual) return null;

      return {
        id: ritual.id,
        title: ritual.title,
        description: ritual.description,
        steps: ritual.instructions.map((instruction, index) => ({
          title: `Step ${index + 1}`,
          description: instruction,
          duration: Math.ceil(ritual.difficultyLevel)
        })),
        difficulty: ritual.difficultyLevel <= 2 ? 'easy' : 
                   ritual.difficultyLevel <= 4 ? 'medium' : 'hard',
        xpReward: ritual.xpReward,
        byteReward: ritual.byteReward,
        estimatedTime: ritual.estimatedTime,
        category: ritual.category,
        tier: ritual.tier,
        assignedAt: assignment.assigned_at,
        completedAt: assignment.completed_at,
        isCompleted: !!assignment.completed_at,
        tags: ritual.tags
      };
    }).filter(Boolean);

    return NextResponse.json({
      success: true,
      data: {
        todaysRituals: userRituals,
        availableRituals: availableRituals.map(ritual => ({
          id: ritual.id,
          title: ritual.title,
          description: ritual.description,
          difficulty: ritual.difficultyLevel <= 2 ? 'easy' : 
                     ritual.difficultyLevel <= 4 ? 'medium' : 'hard',
          category: ritual.category,
          tier: ritual.tier,
          estimatedTime: ritual.estimatedTime,
          isCompleted: completedKeys.includes(ritual.id)
        })),
        userTier,
        canReroll: isPremium
      }
    });

  } catch (error) {
    console.error('Get user rituals API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
