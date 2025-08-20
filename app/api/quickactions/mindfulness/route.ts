import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// POST /api/quickactions/mindfulness - Log mindfulness exercise completion
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
    const { exercise, duration, steps, reflection } = body;

    // Validate mindfulness exercise data
    if (!exercise?.name || !duration) {
      return NextResponse.json(
        { error: 'Invalid mindfulness exercise data' },
        { status: 400 }
      );
    }

    // XP/Bytes rewards based on duration and difficulty
    const baseXP = 20;
    const durationBonus = Math.min(duration * 3, 30); // Max 30 bonus XP
    const difficultyMultiplier = exercise.difficulty === 'easy' ? 1 : 
                                exercise.difficulty === 'medium' ? 1.3 : 1.6;
    
    const xpEarned = Math.floor((baseXP + durationBonus) * difficultyMultiplier);
    const bytesEarned = Math.floor(xpEarned * 0.5);

    // Update user XP and Bytes
    await db.update(users)
      .set({
        xp: user.xp + xpEarned,
        bytes: user.bytes + bytesEarned
      })
      .where(eq(users.id, user.id));

    // Store mindfulness exercise entry
    const mindfulnessEntry = {
      id: randomUUID(),
      userId: user.id,
      exerciseType: 'mindfulness',
      exerciseName: exercise.name,
      exerciseId: exercise.id,
      duration: duration,
      steps: steps || [],
      reflection: reflection || null,
      difficulty: exercise.difficulty || 'easy',
      category: exercise.category || 'general',
      timestamp: new Date().toISOString(),
      platform: 'web',
      xpEarned,
      bytesEarned
    };

    return NextResponse.json({
      success: true,
      data: mindfulnessEntry,
      rewards: {
        xpEarned,
        bytesEarned
      },
      message: 'Mindfulness exercise completed successfully'
    });

  } catch (error) {
    console.error('Mindfulness exercise API error:', error);
    return NextResponse.json(
      { error: 'Failed to log mindfulness exercise' },
      { status: 500 }
    );
  }
}

// GET /api/quickactions/mindfulness - Get mindfulness exercise history
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

    // TODO: Query from dedicated mindfulness_exercises table
    // For now, return mock data structure for mobile compatibility
    const mockMindfulnessData = {
      recentExercises: [],
      totalSessions: 0,
      totalMinutes: 0,
      favoriteExercise: null,
      categories: {
        grounding: 0,
        breathing: 0,
        acceptance: 0,
        awareness: 0
      },
      weeklyGoal: 3,
      weeklyProgress: 0
    };

    return NextResponse.json({
      success: true,
      data: mockMindfulnessData
    });

  } catch (error) {
    console.error('Mindfulness exercise retrieval API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve mindfulness exercise data' },
      { status: 500 }
    );
  }
}
