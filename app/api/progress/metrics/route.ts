/**
 * CTRL+ALT+BLOCK™ v1.1 - Progress Metrics API
 * Provides specification-compliant progress tracking data per section 10
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { eq, and, gte, desc, sql, count } from 'drizzle-orm';
import { users, ritualCompletions, journalDrafts } from '@/lib/db/schema';
import { getNextLevelXP } from '@/lib/gamification/leveling';

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email');
    
    if (!userEmail) {
      console.error('Progress metrics API: No user email provided');
      return NextResponse.json({ error: 'User email required' }, { status: 400 });
    }

    console.log('Progress metrics API: Fetching for user:', userEmail);

    // Get user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail))
      .limit(1);

    if (user.length === 0) {
      console.error('Progress metrics API: User not found:', userEmail);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = user[0];
    const userId = userData.id;
    
    console.log('Progress metrics API: Found user ID:', userId);

    // Calculate commitment progress
    const commitmentStartDate = userData.createdAt || new Date();
    const currentDay = calculateCurrentDay(commitmentStartDate);
    const commitmentProgress = Math.min(100, Math.round((currentDay / 30) * 100));
    const nextMilestone = getNextMilestone(currentDay);

    // Get ritual completion stats
    const ritualStats = await getRitualStats(userId);
    
    // Get journal quality metrics
    const journalQualityMetrics = await getJournalQualityMetrics(userId);
    
    // Get emotional progress
    const emotionalMetrics = await getEmotionalMetrics(userId);
    
    // Get achievements
    const achievements = await getUserAchievements(userId, ritualStats);

    console.log('Progress metrics API: Successfully calculated metrics');

    // Build response
    const metrics = {
      // 30-Day Commitment Progress
      commitmentDay: currentDay,
      commitmentProgress,
      nextMilestone,
      
      // Core Streaks & Consistency
      currentStreak: userData.streak || 0,
      longestStreak: userData.longestStreak || userData.streak || 0,
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
      
      // Gamification
      xp: userData.xp || 0,
      level: userData.level || 1,
      nextLevelXp: getNextLevelXP(userData.level || 1),
      achievements,
      
      // Therapy Integration (placeholder)
      therapySessions: 0,
      therapyEngagement: 'medium' as const,
      
      // Archetype Development
      archetype: userData.emotionalArchetype,
      archetypeProgress: 0, // Placeholder - would track progress through archetype development
      personalizedContent: userData.tier === 'firewall'
    };

    return NextResponse.json(metrics);

  } catch (error) {
    console.error('Progress metrics API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch progress metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
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
