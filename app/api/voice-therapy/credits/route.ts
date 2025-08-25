import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { voiceTherapyCredits } from '@/lib/db/unified-schema';
import { and, eq, gt } from 'drizzle-orm';

// voiceTherapyCredits table is defined in unified-schema. Migration must have run.
export async function GET(_request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      // Non-authenticated callers get neutral zero state (no leakage of existence of credits).
      return NextResponse.json({ hasCredits: false, remainingMinutes: 0, activeCredits: 0 });
    }
    const now = new Date();
    const activeCredits = await db
      .select()
      .from(voiceTherapyCredits)
      .where(
        and(
          eq(voiceTherapyCredits.userId, user.id),
          eq(voiceTherapyCredits.isActive, true),
          gt(voiceTherapyCredits.minutesRemaining, 0),
          gt(voiceTherapyCredits.expiryDate, now)
        )
      );
    const totalRemainingMinutes = activeCredits.reduce((acc, row) => acc + row.minutesRemaining, 0);
    return NextResponse.json({
      hasCredits: totalRemainingMinutes > 0,
      remainingMinutes: totalRemainingMinutes,
      activeCredits: activeCredits.length,
    });
  } catch (error) {
    console.error('Voice therapy credits check error:', error);
    return NextResponse.json({ error: 'Failed to check credits' }, { status: 500 });
  }
}
