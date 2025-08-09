/**
 * Daily Ritual API - Complete a ritual
 * POST /api/daily-rituals/complete
 */

import { NextRequest, NextResponse } from 'next/server';
import { dailyRitualService } from '@/lib/rituals/daily-ritual-service-drizzle';
import { validateRequest } from '@/lib/auth';

interface CompleteRitualRequest {
  assignmentId: number;
  ritualId: string;
  journalText: string;
  moodRating: number;
  dwellTimeSeconds: number;
}

export async function POST(request: NextRequest) {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body: CompleteRitualRequest = await request.json();
    const { assignmentId, ritualId, journalText, moodRating, dwellTimeSeconds } = body;

    // Validate input
    if (!assignmentId || !ritualId || !journalText || typeof moodRating !== 'number' || typeof dwellTimeSeconds !== 'number') {
      return NextResponse.json({ 
        error: 'Missing required fields: assignmentId, ritualId, journalText, moodRating, dwellTimeSeconds' 
      }, { status: 400 });
    }

    if (moodRating < 1 || moodRating > 10) {
      return NextResponse.json({ 
        error: 'Mood rating must be between 1 and 10' 
      }, { status: 400 });
    }

    // Complete the ritual
    const result = await dailyRitualService.completeRitual(
      user.id,
      assignmentId,
      ritualId,
      journalText,
      moodRating,
      dwellTimeSeconds
    );

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error || 'Failed to complete ritual' 
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        xpEarned: result.xpEarned,
        bytesEarned: result.bytesEarned,
        streakDays: result.streakDays
      }
    });
  } catch (error) {
    console.error('Error completing ritual:', error);
    return NextResponse.json(
      { error: 'Failed to complete ritual' },
      { status: 500 }
    );
  }
}
