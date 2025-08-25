import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { noContactPeriods } from '@/lib/db/unified-schema';
import { validateRequest } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { periodId } = body;

    if (!periodId) {
      return NextResponse.json({ error: 'Period ID required' }, { status: 400 });
    }

    // Get the current period
    const period = await db
      .select()
      .from(noContactPeriods)
      .where(
        and(
          eq(noContactPeriods.id, periodId),
          eq(noContactPeriods.userId, user.id)
        )
      )
      .limit(1);

    if (period.length === 0) {
      return NextResponse.json({ error: 'Period not found' }, { status: 404 });
    }

    const currentPeriod = period[0];

    // Check if user can use a streak shield
    if (currentPeriod.streakShieldsUsed >= currentPeriod.maxStreakShieldsPerWeek) {
      return NextResponse.json({ error: 'No streak shields remaining this week' }, { status: 400 });
    }

    // Use a streak shield
    const updatedPeriod = await db
      .update(noContactPeriods)
      .set({ 
        streakShieldsUsed: currentPeriod.streakShieldsUsed + 1 
      })
      .where(eq(noContactPeriods.id, periodId))
      .returning();

    return NextResponse.json({ 
      success: true, 
      period: updatedPeriod[0] 
    });

  } catch (error) {
    console.error('Error using streak shield:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const periodId = url.searchParams.get('periodId');

    if (!periodId) {
      return NextResponse.json({ error: 'Period ID required' }, { status: 400 });
    }

    // Get the current period's streak shield status
    const period = await db
      .select()
      .from(noContactPeriods)
      .where(
        and(
          eq(noContactPeriods.id, periodId),
          eq(noContactPeriods.userId, user.id)
        )
      )
      .limit(1);

    if (period.length === 0) {
      return NextResponse.json({ error: 'Period not found' }, { status: 404 });
    }

    const { streakShieldsUsed, maxStreakShieldsPerWeek } = period[0];

    return NextResponse.json({ 
      streakShieldsUsed,
      maxStreakShieldsPerWeek,
      remaining: maxStreakShieldsPerWeek - streakShieldsUsed
    });

  } catch (error) {
    console.error('Error fetching streak shield status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
