import { NextRequest, NextResponse } from 'next/server';

// Mock progress data - in production this would come from your database
const generateProgressData = (userEmail: string, timeRange: string) => {
  const baseData = {
    user: {
      level: 8,
      xp: 12500,
      nextLevelXP: 15000,
      progressToNext: 83.3,
      streak: 14,
      longestStreak: 28,
      bytes: 850,
      username: 'Healing Warrior',
      avatar: '🔥'
    },
    stats: {
      ritualsCompleted: 45,
      totalRituals: 60,
      wallPosts: 12,
      aiSessionsUsed: 23,
      totalDays: 42,
      averageMood: 4.2,
      improvementScore: 78
    },
    recent: {
      rituals: [
        {
          id: '1',
          title: 'Morning Meditation',
          completedAt: new Date().toISOString(),
          xpGained: 100
        },
        {
          id: '2', 
          title: 'Gratitude Journal',
          completedAt: new Date(Date.now() - 86400000).toISOString(),
          xpGained: 75
        },
        {
          id: '3',
          title: 'Breathing Exercise',
          completedAt: new Date(Date.now() - 172800000).toISOString(),
          xpGained: 50
        }
      ],
      moods: [
        {
          date: new Date().toISOString(),
          mood: 4,
          notes: 'Feeling more centered today'
        },
        {
          date: new Date(Date.now() - 86400000).toISOString(),
          mood: 3,
          notes: 'Had some difficult moments'
        },
        {
          date: new Date(Date.now() - 172800000).toISOString(),
          mood: 5,
          notes: 'Great breakthrough in therapy'
        },
        {
          date: new Date(Date.now() - 259200000).toISOString(),
          mood: 4,
          notes: 'Steady progress'
        },
        {
          date: new Date(Date.now() - 345600000).toISOString(),
          mood: 3,
          notes: 'Challenging day but pushed through'
        }
      ]
    }
  };

  // Adjust data based on time range
  if (timeRange === 'week') {
    baseData.recent.rituals = baseData.recent.rituals.slice(0, 3);
    baseData.recent.moods = baseData.recent.moods.slice(0, 7);
    baseData.stats.ritualsCompleted = 12;
  } else if (timeRange === 'month') {
    baseData.recent.rituals = baseData.recent.rituals.slice(0, 5);
    baseData.recent.moods = baseData.recent.moods.slice(0, 30);
    baseData.stats.ritualsCompleted = 28;
  }

  return baseData;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = request.headers.get('x-user-email');
    const timeRange = searchParams.get('range') || 'month';

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email required' },
        { status: 401 }
      );
    }

    const progressData = generateProgressData(userEmail, timeRange);

    return NextResponse.json(progressData);
  } catch (error) {
    console.error('Progress API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
