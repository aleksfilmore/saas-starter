import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { voiceTherapyCredits } from '@/lib/db/schema';
import { and, eq, gt } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check for active voice therapy credits that haven't expired
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

    return NextResponse.json({
      hasCredits: totalRemainingMinutes > 0,
      remainingMinutes: totalRemainingMinutes,
      activeCredits: activeCredits.length
    });
  } catch (error) {
    console.error('Voice therapy credits check error:', error);
    return NextResponse.json(
      { error: 'Failed to check credits' },
      { status: 500 }
    );
  }
}
