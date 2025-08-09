/**
 * CTRL+ALT+BLOCK™ v1.1 - Last Journal Entry API
 * Fetches last journal entry for similarity comparison per specification section 6
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { ritualEntries } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get most recent journal entry
    const lastEntry = await db
      .select({
        text: ritualEntries.howIFeel, // Use the reflection field
        textLength: ritualEntries.textLength,
        createdAt: ritualEntries.createdAt
      })
      .from(ritualEntries)
      .where(eq(ritualEntries.userId, sessionUser.id))
      .orderBy(desc(ritualEntries.createdAt))
      .limit(1);

    if (lastEntry.length === 0) {
      return NextResponse.json({
        text: '',
        hasLastEntry: false
      });
    }

    return NextResponse.json({
      text: lastEntry[0].text || '',
      textLength: lastEntry[0].textLength,
      createdAt: lastEntry[0].createdAt,
      hasLastEntry: true
    });

  } catch (error) {
    console.error('Last entry fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch last entry' },
      { status: 500 }
    );
  }
}
