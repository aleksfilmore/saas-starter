import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// POST /api/quickactions/gratitude - Log gratitude journal entry
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
    const { entries, totalWordCount } = body;

    // Validate gratitude entries
    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json(
        { error: 'Invalid gratitude entries' },
        { status: 400 }
      );
    }

    // XP/Bytes rewards based on entry count and word count
    const baseXP = 25;
    const entryBonus = entries.length * 5; // 5 XP per entry
    const wordBonus = Math.min(Math.floor(totalWordCount / 10), 25); // 1 XP per 10 words, max 25
    
    const xpEarned = baseXP + entryBonus + wordBonus;
    const bytesEarned = Math.floor(xpEarned * 0.6);

    // Update user XP and Bytes
    await db.update(users)
      .set({
        xp: user.xp + xpEarned,
        bytes: user.bytes + bytesEarned
      })
      .where(eq(users.id, user.id));

    // Store gratitude journal entry
    const gratitudeEntry = {
      id: randomUUID(),
      userId: user.id,
      exerciseType: 'gratitude',
      entries: entries.map((entry: any) => ({
        id: entry.id,
        category: entry.category,
        text: entry.text,
        prompt: entry.prompt || null
      })),
      totalEntries: entries.length,
      totalWordCount: totalWordCount || 0,
      timestamp: new Date().toISOString(),
      platform: 'web',
      xpEarned,
      bytesEarned
    };

    return NextResponse.json({
      success: true,
      data: gratitudeEntry,
      rewards: {
        xpEarned,
        bytesEarned
      },
      message: 'Gratitude journal completed successfully'
    });

  } catch (error) {
    console.error('Gratitude journal API error:', error);
    return NextResponse.json(
      { error: 'Failed to log gratitude journal' },
      { status: 500 }
    );
  }
}

// GET /api/quickactions/gratitude - Get gratitude journal history
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

    // TODO: Query from dedicated gratitude_entries table
    // For now, return mock data structure for mobile compatibility
    const mockGratitudeData = {
      recentEntries: [],
      totalEntries: 0,
      categoryCounts: {
        growth: 0,
        freedom: 0,
        support: 0,
        self: 0,
        future: 0
      },
      weeklyGoal: 5,
      weeklyProgress: 0,
      longestStreak: 0,
      currentStreak: 0
    };

    return NextResponse.json({
      success: true,
      data: mockGratitudeData
    });

  } catch (error) {
    console.error('Gratitude journal retrieval API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve gratitude journal data' },
      { status: 500 }
    );
  }
}
