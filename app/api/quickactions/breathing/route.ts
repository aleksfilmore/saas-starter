import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// POST /api/quickactions/breathing - Log breathing exercise completion
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
    const { pattern, cycles, duration, difficulty } = body;

    // Validate breathing exercise data
    if (!pattern?.name || !cycles || cycles < 1) {
      return NextResponse.json(
        { error: 'Invalid breathing exercise data' },
        { status: 400 }
      );
    }

    // Bytes rewards based on difficulty and cycles (XP removed)
    const baseBytes = 8;
    const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.2 : 1.5;
    const cycleBonusBytes = Math.min(cycles, 10); // 1 byte per cycle up to 10
    const bytesEarned = Math.floor(baseBytes * difficultyMultiplier + cycleBonusBytes);

    await db.update(users)
      .set({ bytes: user.bytes + bytesEarned })
      .where(eq(users.id, user.id));

    // Store breathing exercise entry
    const breathingEntry = {
      id: randomUUID(),
      userId: user.id,
      exerciseType: 'breathing',
      patternName: pattern.name,
      patternId: pattern.id,
      cycles: cycles,
      duration: duration || 0,
      difficulty: difficulty || 'easy',
      timestamp: new Date().toISOString(),
      platform: 'web',
      bytesEarned
    };

    return NextResponse.json({
      success: true,
      data: breathingEntry,
  rewards: { bytesEarned },
      message: 'Breathing exercise completed successfully'
    });

  } catch (error) {
    console.error('Breathing exercise API error:', error);
    return NextResponse.json(
      { error: 'Failed to log breathing exercise' },
      { status: 500 }
    );
  }
}

// GET /api/quickactions/breathing - Get breathing exercise history
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

    // TODO: Query from dedicated breathing_exercises table
    // For now, return mock data structure for mobile compatibility
    const mockBreathingData = {
      recentExercises: [],
      totalSessions: 0,
      totalMinutes: 0,
      favoritePattern: null,
      weeklyGoal: 5,
      weeklyProgress: 0
    };

    return NextResponse.json({
      success: true,
      data: mockBreathingData
    });

  } catch (error) {
    console.error('Breathing exercise retrieval API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve breathing exercise data' },
      { status: 500 }
    );
  }
}
