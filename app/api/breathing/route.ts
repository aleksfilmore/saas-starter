import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { pattern, completedCycles } = await request.json();
    
    // Get user email from headers (temporary auth method)
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

    // Award XP and Bytes based on exercise difficulty and completion
    const baseXP = 25;
    const baseBytes = 15;
    
    // Bonus for difficulty
    const difficultyMultiplier = pattern.difficulty === 'advanced' ? 1.5 : 
                                 pattern.difficulty === 'intermediate' ? 1.2 : 1;
    
    const xpEarned = Math.floor(baseXP * difficultyMultiplier);
    const bytesEarned = Math.floor(baseBytes * difficultyMultiplier);

    await db
      .update(users)
      .set({
        xp: sql`${users.xp} + ${xpEarned}`,
        bytes: sql`${users.bytes} + ${bytesEarned}`,
      })
      .where(eq(users.id, user.id));

    // TODO: Store breathing exercise completion in dedicated table for analytics

    return NextResponse.json({
      success: true,
      xpEarned,
      bytesEarned,
      message: `${pattern.name} completed successfully`
    });

  } catch (error) {
    console.error('Breathing exercise API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
