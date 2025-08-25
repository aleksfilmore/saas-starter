import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, rituals } from '@/lib/db/unified-schema';
import { eq, and } from 'drizzle-orm';
import { rerollRitual } from '@/lib/ritual/ritual-engine';
import { sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';

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

    // Firewall-only feature (swap)
    if (user.tier !== 'firewall') {
      return NextResponse.json({ error: 'Ritual swap is Firewall-only' }, { status: 403 });
    }

    // Check reroll limits: max 1 per day (explicit requirement)
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

  const maxRerolls = 1; // enforced cap
  if (todaysRerollCount >= maxRerolls) {
      return NextResponse.json({
    error: 'Daily swap limit reached (1/day)',
    maxRerolls,
    currentRerolls: todaysRerollCount,
    tier: user.tier
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

    // Record swap event
    try {
      await db.execute(sql`INSERT INTO user_ritual_swaps (id, user_id) VALUES (${randomUUID()}, ${user.id})`);
    } catch (e) { console.warn('Failed to record ritual swap', e); }

    // Compute updated counts
    let totalSwaps = 0; let todaySwaps = todaysRerollCount + 1;
    try {
      const totalRows = await db.execute(sql`SELECT COUNT(*) as c FROM user_ritual_swaps WHERE user_id = ${user.id}`);
      totalSwaps = parseInt(((totalRows[0] as any)?.c ?? '0').toString(),10);
    } catch {}

    // Emit badge event for ritual_swap
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/badges/check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          eventType: 'ritual_swap',
            payload: { totalSwaps, todaySwaps }
        })
      }).catch(()=>{});
    } catch {}

    return NextResponse.json({
      success: true,
      ritual: {
        id: newRitual.id,
        title: newRitual.title,
        description: newRitual.description,
        category: newRitual.category,
        intensity: newRitual.intensity,
        duration: newRitual.duration,
        bytesReward: newRitual.bytesReward
      },
      rerollsUsed: todaysRerollCount + 1,
      rerollsRemaining: maxRerolls - (todaysRerollCount + 1),
  message: `New ritual generated! No more swaps remaining today.`,
      swaps: {
        today: todaySwaps,
        total: totalSwaps,
        dailyLimit: maxRerolls
      }
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
