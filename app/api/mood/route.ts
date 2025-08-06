import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { mood, notes } = await request.json();
    
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

    // Award XP and Bytes for mood check-in
    const xpEarned = 10;
    const bytesEarned = 5;

    await db
      .update(users)
      .set({
        xp: sql`${users.xp} + ${xpEarned}`,
        bytes: sql`${users.bytes} + ${bytesEarned}`,
      })
      .where(eq(users.id, user.id));

    // TODO: Store mood entry in a dedicated table for analytics
    // For now, we'll just award the XP/Bytes

    return NextResponse.json({
      success: true,
      xpEarned,
      bytesEarned,
      message: 'Mood logged successfully'
    });

  } catch (error) {
    console.error('Mood check-in API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
