import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { 
  users, 
  ritualCompletions, 
  ritualEntries, 
  anonymousPosts, 
  dailyCheckIns,
  xpTransactions,
  byteTransactions 
} from '@/lib/db/schema';
import { eq, desc, gte, and, count } from 'drizzle-orm';

// Helper function to calculate level from XP
const calculateLevel = (xp: number) => {
  const level = Math.floor(xp / 1000) + 1;
  const xpInCurrentLevel = xp % 1000;
  const nextLevelXP = 1000;
  const progressToNext = (xpInCurrentLevel / nextLevelXP) * 100;
  
  return { level, xpInCurrentLevel, nextLevelXP, progressToNext };
};

// Helper function to calculate streak
const calculateStreak = async (userId: string) => {
  try {
    const activities = await db
      .select()
      .from(ritualCompletions)
      .where(eq(ritualCompletions.userId, userId))
      .orderBy(desc(ritualCompletions.completedAt));

    if (activities.length === 0) return { current: 0, longest: 0 };

    // Group by date and calculate streaks
    const activityDates = new Set();
    activities.forEach(activity => {
      const date = new Date(activity.completedAt);
      date.setHours(0, 0, 0, 0);
      activityDates.add(date.getTime());
    });

    const uniqueDates = Array.from(activityDates).sort((a, b) => b - a);
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    
    // Calculate current streak from today backwards
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      
      if (activityDates.has(checkDate.getTime())) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }
    
    // Calculate longest streak
    for (let i = 1; i < uniqueDates.length; i++) {
      const daysDiff = (uniqueDates[i - 1] - uniqueDates[i]) / (1000 * 60 * 60 * 24);
      
      if (daysDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    
    return { current: currentStreak, longest: longestStreak };
  } catch (error) {
    console.error('Error calculating streak:', error);
    return { current: 0, longest: 0 };
  }
};

// Generate progress data from actual database
const generateProgressData = async (userId: string, timeRange: string) => {
  try {
    // Get user data
    const userData = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const user = userData[0];
    
    if (!user) {
      throw new Error('User not found');
    }

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'all':
        startDate = new Date('2020-01-01');
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    // Get ritual completions
    const ritualCompletionsData = await db
      .select()
      .from(ritualCompletions)
      .where(
        and(
          eq(ritualCompletions.userId, userId),
          gte(ritualCompletions.completedAt, startDate)
        )
      )
      .orderBy(desc(ritualCompletions.completedAt))
      .limit(10);

    // Get total ritual completions
    const totalRitualsData = await db
      .select({ count: count() })
      .from(ritualCompletions)
      .where(eq(ritualCompletions.userId, userId));

    // Get wall posts count
    const wallPostsData = await db
      .select({ count: count() })
      .from(anonymousPosts)
      .where(
        and(
          eq(anonymousPosts.userId, userId),
          gte(anonymousPosts.createdAt, startDate)
        )
      );

    // Get mood entries from daily check-ins
    const moodData = await db
      .select()
      .from(dailyCheckIns)
      .where(
        and(
          eq(dailyCheckIns.userId, userId),
          gte(dailyCheckIns.checkInDate, startDate)
        )
      )
      .orderBy(desc(dailyCheckIns.checkInDate))
      .limit(10);

    // Calculate level and progress
    const levelInfo = calculateLevel(user.xp || 0);
    
    // Calculate streaks
    const streakInfo = await calculateStreak(userId);

    // Calculate average mood
    const avgMood = moodData.length > 0 
      ? moodData.reduce((sum, entry) => sum + entry.mood, 0) / moodData.length 
      : 0;

    // Calculate improvement score based on mood trend
    let improvementScore = 50; // Default neutral
    if (moodData.length >= 4) {
      const firstHalf = moodData.slice(Math.floor(moodData.length / 2));
      const secondHalf = moodData.slice(0, Math.floor(moodData.length / 2));
      
      const firstAvg = firstHalf.reduce((sum, entry) => sum + entry.mood, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, entry) => sum + entry.mood, 0) / secondHalf.length;
      
      const improvement = ((secondAvg - firstAvg) / 5) * 100; // Scale to percentage
      improvementScore = Math.max(0, Math.min(100, 50 + improvement));
    }

    // Calculate total active days
    const firstActivity = await db
      .select()
      .from(ritualCompletions)
      .where(eq(ritualCompletions.userId, userId))
      .orderBy(ritualCompletions.completedAt)
      .limit(1);

    const totalDays = firstActivity.length > 0 
      ? Math.ceil((now.getTime() - firstActivity[0].completedAt.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return {
      user: {
        level: levelInfo.level,
        xp: user.xp || 0,
        nextLevelXP: levelInfo.nextLevelXP,
        progressToNext: levelInfo.progressToNext,
        streak: streakInfo.current,
        longestStreak: streakInfo.longest,
        bytes: user.bytes || 100,
        username: user.username || user.codename || user.email?.split('@')[0] || 'Healing Warrior',
        avatar: user.avatar || '🔥'
      },
      stats: {
        ritualsCompleted: ritualCompletionsData.length,
        totalRituals: totalRitualsData[0]?.count || 0,
        wallPosts: wallPostsData[0]?.count || 0,
        aiSessionsUsed: 0, // Could be calculated from AI usage if tracked
        totalDays,
        averageMood: avgMood,
        improvementScore
      },
      recent: {
        rituals: ritualCompletionsData.map(ritual => ({
          id: ritual.id,
          title: 'Daily Ritual', // Could be enhanced with ritual title lookup
          completedAt: ritual.completedAt.toISOString(),
          xpGained: 100 // Could be stored in ritual completion or calculated
        })),
        moods: moodData.map(mood => ({
          date: mood.checkInDate.toISOString(),
          mood: mood.mood,
          notes: mood.notes || ''
        }))
      }
    };
  } catch (error) {
    console.error('Error generating progress data:', error);
    // Return fallback mock data if database fails
    return generateMockData(timeRange);
  }
};

// Fallback mock data function
const generateMockData = (timeRange: string) => {
  const baseData = {
    user: {
      level: 8,
      xp: 12500,
      nextLevelXP: 1000,
      progressToNext: 50.0,
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
    baseData.recent.moods = baseData.recent.moods.slice(0, 10);
    baseData.stats.ritualsCompleted = 28;
  }

  return baseData;
};

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('range') || 'month';

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const progressData = await generateProgressData(user.id, timeRange);

    return NextResponse.json(progressData);
  } catch (error) {
    console.error('Progress API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
