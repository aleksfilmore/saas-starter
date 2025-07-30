import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { dailyCheckIns } from '@/lib/db/schema';
import { validateRequest } from '@/lib/auth';
import { getUserId } from '@/lib/utils';
import { nanoid } from 'nanoid';
import { eq, and, gte, desc } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Daily check-in API - User object:', { id: user.id, type: typeof user.id });
    
    try {
      const parsedUserId = getUserId(user);
      console.log('Parsed user ID successfully:', parsedUserId);
    } catch (error) {
      console.error('Failed to parse user ID:', error);
      return NextResponse.json({ error: 'Invalid user session' }, { status: 400 });
    }
    
    const parsedUserId = getUserId(user);

    const body = await request.json();
    const { periodId, didTextTrash, mood, hadIntrusiveThoughts, notes } = body;

    // Validate required fields
    if (!periodId || typeof didTextTrash !== 'boolean' || typeof hadIntrusiveThoughts !== 'boolean') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!mood || mood < 1 || mood > 5) {
      return NextResponse.json({ error: 'Mood must be between 1 and 5' }, { status: 400 });
    }

    // Check if user has already checked in today for this period
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingCheckIn = await db
      .select()
      .from(dailyCheckIns)
      .where(
        and(
          eq(dailyCheckIns.userId, parsedUserId),
          eq(dailyCheckIns.periodId, periodId),
          gte(dailyCheckIns.checkInDate, today)
        )
      )
      .limit(1);

    if (existingCheckIn.length > 0) {
      return NextResponse.json({ error: 'Already checked in today' }, { status: 400 });
    }

    // Create the daily check-in
    const checkIn = await db
      .insert(dailyCheckIns)
      .values({
        id: nanoid(),
        userId: parsedUserId,
        periodId,
        checkInDate: new Date(),
        didTextTrash,
        mood,
        hadIntrusiveThoughts,
        notes,
      })
      .returning();

    return NextResponse.json({ 
      success: true, 
      checkIn: checkIn[0] 
    });

  } catch (error) {
    console.error('Error creating daily check-in:', error);
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

    console.log('Daily check-in GET API - User object:', { id: user.id, type: typeof user.id });
    
    try {
      const parsedUserId = getUserId(user);
      console.log('GET: Parsed user ID successfully:', parsedUserId);
    } catch (error) {
      console.error('GET: Failed to parse user ID:', error);
      return NextResponse.json({ error: 'Invalid user session' }, { status: 400 });
    }
    
    const parsedUserId = getUserId(user);

    const url = new URL(request.url);
    const periodId = url.searchParams.get('periodId');

    if (!periodId) {
      return NextResponse.json({ error: 'Period ID required' }, { status: 400 });
    }

    // Get recent check-ins for this period
    const checkIns = await db
      .select()
      .from(dailyCheckIns)
      .where(
        and(
          eq(dailyCheckIns.userId, parsedUserId),
          eq(dailyCheckIns.periodId, periodId)
        )
      )
      .orderBy(desc(dailyCheckIns.checkInDate))
      .limit(30); // Last 30 days

    return NextResponse.json({ checkIns });

  } catch (error) {
    console.error('Error fetching daily check-ins:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
