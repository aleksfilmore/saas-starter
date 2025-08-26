import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { voiceTherapyCredits, voiceTherapySessions } from '@/lib/db/unified-schema';
import { and, eq, gt } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { duration } = await request.json();
    const minutesUsed = Math.ceil(duration / 60); // Convert seconds to minutes, round up

    if (minutesUsed <= 0) {
      return NextResponse.json({ error: 'Invalid session duration' }, { status: 400 });
    }

    // Find the user's active credits with the most minutes to deduct from
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
      )
      .orderBy(voiceTherapyCredits.minutesRemaining);

    if (activeCredits.length === 0) {
      return NextResponse.json({ error: 'No active voice therapy credits' }, { status: 400 });
    }

    // Use the credit with the most minutes (to preserve smaller credits for later)
    const creditToUse = activeCredits[activeCredits.length - 1];
    
    if (creditToUse.minutesRemaining < minutesUsed) {
      return NextResponse.json({ 
        error: `Insufficient credits. You have ${creditToUse.minutesRemaining} minutes remaining but used ${minutesUsed} minutes.` 
      }, { status: 400 });
    }

    // Deduct minutes from the credit
    const newMinutesRemaining = creditToUse.minutesRemaining - minutesUsed;
    
    await db
      .update(voiceTherapyCredits)
      .set({ 
        minutesRemaining: newMinutesRemaining,
        isActive: newMinutesRemaining > 0 // Deactivate if no minutes left
      })
      .where(eq(voiceTherapyCredits.id, creditToUse.id));

    // Record the session
    await db.insert(voiceTherapySessions).values({
      userId: user.id,
      minutesUsed: minutesUsed,
      // Map to unified schema column names
      startedAt: new Date(Date.now() - duration * 1000),
      endedAt: new Date(),
      transcript: null
    });
    
    return NextResponse.json({
      success: true,
      message: 'Voice therapy session ended',
      minutesUsed: minutesUsed,
      remainingMinutes: newMinutesRemaining
    });
  } catch (error) {
    console.error('Voice therapy end error:', error);
    return NextResponse.json(
      { error: 'Failed to end session' },
      { status: 500 }
    );
  }
}
