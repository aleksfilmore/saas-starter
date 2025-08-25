/**
 * CTRL+ALT+BLOCK™ v1.1 - Progress Metrics API
 * Provides specification-compliant progress tracking data per section 10
 */

import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { eq, and, gte, desc, sql, count } from 'drizzle-orm';
import { users, ritualCompletions, journalDrafts } from '@/lib/db/unified-schema';

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email');
    
    if (!userEmail) {
      console.error('Progress metrics API: No user email provided');
      return NextResponse.json({ error: 'User email required' }, { status: 400 });
    }

    console.log('Progress metrics API: Fetching for user:', userEmail);

    // Try to get user data from database
    let userData;
    let userId = 'demo-user';
    let commitmentStartDate = new Date();
    
    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, userEmail))
        .limit(1);

      if (user.length > 0) {
        userData = user[0];
        userId = userData.id;
        commitmentStartDate = userData.createdAt || new Date();
        console.log('Progress metrics API: Found user ID:', userId);
      } else {
        console.warn('Progress metrics API: User not found, using mock data:', userEmail);
      }
    } catch (dbError) {
      console.warn('Progress metrics API: Database error, using mock data:', dbError);
    }

    // Calculate commitment progress
    const currentDay = calculateCurrentDay(commitmentStartDate);
    const commitmentProgress = Math.min(100, Math.round((currentDay / 30) * 100));
    const nextMilestone = getNextMilestone(currentDay);

    // Get stats (with fallbacks)
    let ritualStats = { completed: 0, total: 1 };
    let journalQualityMetrics = {
      validationPasses: 0,
      averageQuality: 0,
      averageWritingTime: 0,
      uniqueContentRatio: 0
    };
    let emotionalMetrics: {
      trend: 'improving' | 'stable' | 'declining' | 'volatile';
      averageMood: number;
      stability: number;
    } = {
      trend: 'stable',
      averageMood: 5,
      stability: 0.5
    };

    try {
      if (userData) {
        ritualStats = await getRitualStats(userId);
        journalQualityMetrics = await getJournalQualityMetrics(userId);
        emotionalMetrics = await getEmotionalMetrics(userId);
      } else {
        // Use mock data for demo
        ritualStats = { completed: Math.min(currentDay, 5), total: currentDay };
        journalQualityMetrics = {
          validationPasses: Math.min(currentDay, 3),
          averageQuality: 0.7,
          averageWritingTime: 62,
          uniqueContentRatio: 0.85
        };
        emotionalMetrics = {
          trend: 'improving',
          averageMood: 6.2,
          stability: 0.75
        };
      }
    } catch (error) {
      console.warn('Progress metrics API: Error fetching detailed stats:', error);
      // Use reasonable defaults
      ritualStats = { completed: Math.min(currentDay, 3), total: currentDay };
    }
    
    // Get achievements
    const achievements = await getUserAchievements(userId, ritualStats);

    console.log('Progress metrics API: Successfully calculated metrics');

  // Build response with fallback data (XP/Level removed – bytes + streak + consistency)
  const metrics = {
      // 30-Day Commitment Progress
      commitmentDay: currentDay,
      commitmentProgress,
      nextMilestone,
      
      // Core Streaks & Consistency
      currentStreak: userData?.streak || Math.min(currentDay, 3),
      longestStreak: userData?.longestStreak || userData?.streak || Math.min(currentDay, 3),
      ritualsCompleted: ritualStats.completed,
      totalRituals: ritualStats.total,
      consistencyScore: ritualStats.total > 0 ? Math.round((ritualStats.completed / ritualStats.total) * 100) : 0,
      
      // Journal Quality Metrics
      journalValidationPasses: journalQualityMetrics.validationPasses,
      averageJournalQuality: journalQualityMetrics.averageQuality,
      averageWritingTime: journalQualityMetrics.averageWritingTime,
      uniqueContentRatio: journalQualityMetrics.uniqueContentRatio,
      
      // Emotional Progress
      moodTrend: emotionalMetrics.trend,
      averageMood: emotionalMetrics.averageMood,
      moodStability: emotionalMetrics.stability,
      
  // Progress Currency (bytes only)
  bytes: userData?.bytes || (ritualStats.completed * 25), // simple fallback estimation
  achievements,
      
      // Therapy Integration (placeholder)
      therapySessions: Math.min(currentDay, 2),
      therapyEngagement: 'medium' as const,
      
      // Archetype Development
      archetype: userData?.emotionalArchetype || 'Data Flooder',
      archetypeProgress: Math.min(100, currentDay * 3.33), // Progress over 30 days
      personalizedContent: userData?.tier === 'firewall' || false
    };

    return NextResponse.json(metrics);

  } catch (error) {
    console.error('Progress metrics API error:', error);
    
    // Return basic fallback data to prevent complete failure
    const fallbackMetrics = {
      commitmentDay: 1,
      commitmentProgress: 3.33,
      nextMilestone: { day: 3, title: "Day 3/30 • Routine Installation" },
      currentStreak: 1,
      longestStreak: 1,
      ritualsCompleted: 1,
      totalRituals: 1,
      consistencyScore: 100,
      journalValidationPasses: 1,
      averageJournalQuality: 0.7,
      averageWritingTime: 45,
      uniqueContentRatio: 1.0,
      moodTrend: 'stable' as const,
      averageMood: 6.0,
      moodStability: 0.7,
  bytes: 25,
      achievements: [
        {
          id: 'first_ritual',
          title: 'First Steps',
          description: 'Complete your first ritual',
          earned: true,
          earnedAt: new Date().toISOString(),
          icon: '🎯'
        }
      ],
      therapySessions: 0,
      therapyEngagement: 'medium' as const,
      archetype: 'Data Flooder',
      archetypeProgress: 10,
      personalizedContent: false
    };

    return NextResponse.json(fallbackMetrics);
  }
}

/**
 * Calculate current day in commitment
 */
function calculateCurrentDay(startDate: Date): number {
  const now = new Date();
  const diffTime = now.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, diffDays);
}

/**
 * Get next milestone
 */
function getNextMilestone(currentDay: number): { day: number; title: string } | null {
  const milestones = [
    { day: 3, title: "Day 3/30 • Routine Installation" },
    { day: 7, title: "Day 7/30 • First Week Complete" },
    { day: 14, title: "Day 14/30 • Two-Week Milestone" },
    { day: 21, title: "Day 21/30 • Habit Formation Lock-In" },
    { day: 30, title: "Day 30/30 • System Upgrade Complete" }
  ];
  
  return milestones.find(m => m.day > currentDay) || null;
}

/**
 * Get ritual completion statistics
 */
async function getRitualStats(userId: string) {
  try {
    // Get total ritual completions
    const completions = await db
      .select({ count: count() })
      .from(ritualCompletions)
      .where(eq(ritualCompletions.userId, userId));

    const completed = completions[0]?.count || 0;
    
    // Calculate total possible rituals (days since joining)
    const user = await db
      .select({ createdAt: users.createdAt })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const joinDate = user[0]?.createdAt || new Date();
    const daysSinceJoining = Math.max(1, calculateCurrentDay(joinDate));
    
    return {
      completed,
      total: daysSinceJoining
    };
  } catch (error) {
    console.error('Error getting ritual stats:', error);
    return { completed: 0, total: 1 };
  }
}

/**
 * Get journal quality metrics
 */
async function getJournalQualityMetrics(userId: string) {
  try {
    // Get recent journal drafts for quality analysis
    const recentDrafts = await db
      .select()
      .from(journalDrafts)
      .where(eq(journalDrafts.userId, userId))
      .orderBy(desc(journalDrafts.lastSaved))
      .limit(30);

    if (recentDrafts.length === 0) {
      return {
        validationPasses: 0,
        averageQuality: 0,
        averageWritingTime: 0,
        uniqueContentRatio: 0
      };
    }

    // Calculate metrics
    const validationPasses = recentDrafts.filter(draft => {
      const content = draft.text || '';
      const wordCount = content.trim().split(/\s+/).length;
      const charCount = content.length;
      
      // Basic validation checks
      return charCount >= 120 || wordCount >= 30; // Simplified validation
    }).length;

    const totalWritingTime = recentDrafts.reduce((sum, draft) => {
      return sum + (draft.timingSeconds || 0);
    }, 0);

    const averageWritingTime = recentDrafts.length > 0 ? totalWritingTime / recentDrafts.length : 0;

    // Simple quality score based on length and time
    const averageQuality = recentDrafts.length > 0 ? 
      recentDrafts.reduce((sum, draft) => {
        const content = draft.text || '';
        const timeScore = Math.min(1, (draft.timingSeconds || 0) / 45); // 45s minimum
        const lengthScore = Math.min(1, content.length / 120); // 120 char minimum
        return sum + ((timeScore + lengthScore) / 2);
      }, 0) / recentDrafts.length : 0;

    // Unique content ratio (simplified)
    const uniqueContentRatio = recentDrafts.length > 1 ? 0.8 : 1.0; // Placeholder

    return {
      validationPasses,
      averageQuality,
      averageWritingTime,
      uniqueContentRatio
    };
  } catch (error) {
    console.error('Error getting journal quality metrics:', error);
    return {
      validationPasses: 0,
      averageQuality: 0,
      averageWritingTime: 0,
      uniqueContentRatio: 0
    };
  }
}

/**
 * Get emotional progress metrics
 */
async function getEmotionalMetrics(userId: string) {
  try {
    // Get recent ritual completions with mood data
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const recentCompletions = await db
      .select({ mood: ritualCompletions.mood, completedAt: ritualCompletions.completedAt })
      .from(ritualCompletions)
      .where(
        and(
          eq(ritualCompletions.userId, userId),
          gte(ritualCompletions.completedAt, last30Days)
        )
      )
      .orderBy(desc(ritualCompletions.completedAt));

    if (recentCompletions.length === 0) {
      return {
        trend: 'stable' as const,
        averageMood: 5,
        stability: 0.5
      };
    }

    const moods = recentCompletions
      .map(c => c.mood)
      .filter(m => m !== null && m !== undefined) as number[];

    if (moods.length === 0) {
      return {
        trend: 'stable' as const,
        averageMood: 5,
        stability: 0.5
      };
    }

    const averageMood = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;

    // Calculate trend (recent vs earlier)
    const recentMoods = moods.slice(0, Math.floor(moods.length / 2));
    const earlierMoods = moods.slice(Math.floor(moods.length / 2));

    let trend: 'improving' | 'stable' | 'declining' | 'volatile' = 'stable';
    
    if (recentMoods.length > 0 && earlierMoods.length > 0) {
      const recentAvg = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;
      const earlierAvg = earlierMoods.reduce((a, b) => a + b, 0) / earlierMoods.length;
      const diff = recentAvg - earlierAvg;

      if (diff > 0.5) trend = 'improving';
      else if (diff < -0.5) trend = 'declining';
      else {
        // Check volatility
        const variance = moods.reduce((sum, mood) => sum + Math.pow(mood - averageMood, 2), 0) / moods.length;
        if (variance > 2) trend = 'volatile';
      }
    }

    // Calculate stability (inverse of variance)
    const variance = moods.reduce((sum, mood) => sum + Math.pow(mood - averageMood, 2), 0) / moods.length;
    const stability = Math.max(0, Math.min(1, 1 - (variance / 10))); // Normalize to 0-1

    return {
      trend,
      averageMood,
      stability
    };
  } catch (error) {
    console.error('Error getting emotional metrics:', error);
    return {
      trend: 'stable' as const,
      averageMood: 5,
      stability: 0.5
    };
  }
}

/**
 * Get user achievements
 */
async function getUserAchievements(userId: string, ritualStats: { completed: number; total: number }) {
  const achievements = [
    {
      id: 'first_ritual',
      title: 'First Steps',
      description: 'Complete your first ritual',
      earned: ritualStats.completed > 0,
      earnedAt: ritualStats.completed > 0 ? new Date().toISOString() : undefined,
      icon: '🎯'
    },
    {
      id: 'week_streak',
      title: 'Week Warrior',
      description: 'Complete rituals for 7 days in a row',
      earned: false, // Would need streak calculation
      icon: '🔥'
    },
    {
      id: 'journal_master',
      title: 'Journal Master',
      description: 'Write 10 high-quality journal entries',
      earned: false, // Would need journal quality tracking
      icon: '📝'
    },
    {
      id: 'consistency_king',
      title: 'Consistency King',
      description: 'Maintain 80% completion rate',
      earned: (ritualStats.completed / ritualStats.total) >= 0.8,
      earnedAt: (ritualStats.completed / ritualStats.total) >= 0.8 ? new Date().toISOString() : undefined,
      icon: '👑'
    },
    {
      id: 'milestone_30',
      title: '30-Day Transformer',
      description: 'Complete the 30-day commitment',
      earned: false, // Would need commitment tracking
      icon: '🏆'
    }
  ];

  return achievements;
}

// Level calculation logic moved to shared utility in lib/gamification/leveling.ts
