import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { voiceTherapyCredits } from '@/lib/db/unified-schema';
import { and, eq, gt } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has active voice therapy credits
    const activeCredits = await db
      .select()
      .from(voiceTherapyCredits)
      .where(
        and(
          eq(voiceTherapyCredits.userId, user.id),
          eq(voiceTherapyCredits.isActive, true),
          gt(voiceTherapyCredits.minutesRemaining, 0),
          gt(voiceTherapyCredits.expiryDate, new Date())
        )
      );

    const totalRemainingMinutes = activeCredits.reduce(
      (total, credit) => total + credit.minutesRemaining, 
      0
    );

    if (totalRemainingMinutes === 0) {
      return NextResponse.json({ 
        error: 'No voice therapy credits available. Please purchase credits to start a session.' 
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      sessionId: 'session-' + Date.now() + '-' + user.id.slice(-6),
      message: 'Voice therapy session started',
      availableMinutes: totalRemainingMinutes
    });
  } catch (error) {
    console.error('Voice therapy start error:', error);
    return NextResponse.json(
      { error: 'Failed to start session' },
      { status: 500 }
    );
  }
}
