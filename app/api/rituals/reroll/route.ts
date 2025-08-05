import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, rituals } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { rerollRitual } from '@/lib/ritual/ritual-engine';

export async function POST(request: NextRequest) {
  try {
    // Get user email from headers (temporary auth)
    const userEmail = request.headers.get('x-user-email') || 'admin@ctrlaltblock.com';
    
    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user data
    const userData = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail))
      .limit(1);

    if (!userData.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userData[0];

    // Check reroll limits (1 per day for freemium, unlimited for paid)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysRerolls = await db
      .select()
      .from(rituals)
      .where(and(
        eq(rituals.userId, user.id),
        eq(rituals.isReroll, true)
      ));

    const todaysRerollCount = todaysRerolls.filter(r => 
      r.createdAt >= today
    ).length;

    // Apply reroll limits based on tier
    const dashboardType = user.dashboardType || 'freemium';
    const maxRerolls = dashboardType === 'freemium' ? 1 : 3; // Freemium: 1/day, Paid: 3/day

    if (todaysRerollCount >= maxRerolls) {
      return NextResponse.json({
        error: `Daily reroll limit reached (${maxRerolls}/day)`,
        maxRerolls,
        currentRerolls: todaysRerollCount,
        tier: dashboardType
      }, { status: 429 });
    }

    // Perform the reroll
    const newRitual = await rerollRitual(user.id);

    if (!newRitual) {
      return NextResponse.json({
        error: 'Failed to generate new ritual'
      }, { status: 500 });
    }

    console.log('✅ New ritual generated via reroll:', newRitual.title);

    return NextResponse.json({
      success: true,
      ritual: {
        id: newRitual.id,
        title: newRitual.title,
        description: newRitual.description,
        category: newRitual.category,
        intensity: newRitual.intensity,
        duration: newRitual.duration,
        xpReward: newRitual.xpReward,
        bytesReward: newRitual.bytesReward
      },
      rerollsUsed: todaysRerollCount + 1,
      rerollsRemaining: maxRerolls - (todaysRerollCount + 1),
      message: `New ritual generated! ${maxRerolls - (todaysRerollCount + 1)} rerolls remaining today.`
    });

  } catch (error) {
    console.error('❌ Ritual reroll error:', error);
    return NextResponse.json(
      { error: 'Failed to generate new ritual' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
