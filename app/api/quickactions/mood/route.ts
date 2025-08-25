import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// POST /api/quickactions/mood - Log mood check-in
export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    const { mood, notes, suggestions } = body;

    // Validate mood data
    if (!mood || typeof mood.value !== 'number' || mood.value < 1 || mood.value > 7) {
      return NextResponse.json(
        { error: 'Invalid mood value. Must be 1-7.' },
        { status: 400 }
      );
    }

    // Bytes reward only (XP removed)
    const bytesEarned = 5;
    await db.update(users)
      .set({ bytes: user.bytes + bytesEarned })
      .where(eq(users.id, user.id));

    // Store mood entry for analytics and cross-platform sync
    // Note: This could be stored in a dedicated mood_entries table for better tracking
    const moodEntry = {
      id: randomUUID(),
      userId: user.id,
      mood: mood.value,
      label: mood.label,
      emoji: mood.emoji,
      description: mood.description,
      notes: notes || null,
      suggestions: suggestions || [],
      timestamp: new Date().toISOString(),
      platform: 'web', // Track source platform
      bytesEarned
    };

    // TODO: Store in dedicated mood_entries table for full analytics
    // For now, store in user metadata or use existing analytics system

    return NextResponse.json({
      success: true,
      data: moodEntry,
  rewards: { bytesEarned },
      message: 'Mood logged successfully'
    });

  } catch (error) {
    console.error('Mood check-in API error:', error);
    return NextResponse.json(
      { error: 'Failed to log mood check-in' },
      { status: 500 }
    );
  }
}

// GET /api/quickactions/mood - Get recent mood entries
export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    // TODO: Query from dedicated mood_entries table
    // For now, return mock data structure for mobile compatibility
    const mockMoodData = {
      recentEntries: [
        {
          id: randomUUID(),
          mood: 4,
          label: 'Running Stable',
          emoji: '😐',
          notes: 'Feeling balanced today',
          timestamp: new Date().toISOString(),
          platform: 'web'
        }
      ],
      averageMood: 4.2,
      moodTrend: 'stable', // 'improving', 'declining', 'stable'
      totalEntries: 1
    };

    return NextResponse.json({
      success: true,
      data: mockMoodData
    });

  } catch (error) {
    console.error('Mood retrieval API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve mood data' },
      { status: 500 }
    );
  }
}
