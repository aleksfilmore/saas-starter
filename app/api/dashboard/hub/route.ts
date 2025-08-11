import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, dailyRitualCompletions } from '@/lib/db/unified-schema';
import { eq, and, gte, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get fresh user data
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate XP and level
    const currentXP = userData.xp || 0;
    const level = userData.level || 1;
    const nextLevelXP = level * 100;
    const progressFraction = Math.min(1, (currentXP % 100) / 100);

    // Calculate streaks
  const ritualStreak = (userData as any).ritual_streak || 0;
  const noContactStreak = (userData as any).no_contact_streak || 0;

    // Generate mock rituals for today (this would come from a rituals table in production)
    const todaysRituals = [
      {
        id: '1',
        title: 'Morning Affirmation',
        difficulty: 'easy' as const,
        completed: false,
        duration: '2 min',
        icon: '🌅'
      },
      {
        id: '2',
        title: 'Boundary Setting Practice',
        difficulty: 'medium' as const,
        completed: false,
        duration: '5 min',
        icon: '🛡️'
      },
      {
        id: '3',
        title: 'Evening Reflection',
        difficulty: 'easy' as const,
        completed: false,
        duration: '3 min',
        icon: '🌙'
      }
    ];

    // Generate mock wall posts (this would come from a wall_posts table in production)
    const wallPosts = [
      {
        id: '1',
        content: 'Just realized I deserve better treatment. Small win but it feels huge.',
        archetype: 'Explorer',
        timeAgo: '2m',
        reactions: 8,
        anonymous: true
      },
      {
        id: '2',
        content: 'Three weeks no contact. The urge to text is still there but getting weaker.',
        archetype: 'Firewall Builder',
        timeAgo: '15m',
        reactions: 12,
        anonymous: true
      },
      {
        id: '3',
        content: 'Had my first boundary conversation today. Scary but proud of myself.',
        archetype: 'Secure Node',
        timeAgo: '1h',
        reactions: 15,
        anonymous: true
      }
    ];

    // Generate badges based on user progress
    const badges = [
      {
        id: '1',
        name: 'First Steps',
        icon: '👟',
        unlocked: currentXP >= 10
      },
      {
        id: '2',
        name: 'Week Warrior',
        icon: '⚔️',
        unlocked: ritualStreak >= 7
      },
      {
        id: '3',
        name: 'AI Explorer',
        icon: '🤖',
  unlocked: true
      },
      {
        id: '4',
        name: 'No Contact Champion',
        icon: '🛡️',
        unlocked: noContactStreak >= 30
      },
      {
        id: '5',
        name: 'Community Helper',
        icon: '❤️',
        unlocked: currentXP >= 200
      }
    ];

    // Generate daily insight based on date (consistent for each day)
    const insights = [
      "Your consistent ritual practice is building new neural pathways. Each small action compounds.",
      "Progress isn't always linear. Celebrate the small victories on your healing journey.",
      "Remember: You're not broken, you're breaking free from patterns that no longer serve you.",
      "Every boundary you set is a gift to your future self.",
      "The fact that you're here shows incredible courage and self-awareness.",
      "Healing happens in the space between what was and what could be.",
      "Your courage to face today is already a victory worth celebrating.",
      "Small consistent actions create profound transformations over time.",
      "You're not starting over, you're starting fresh with more wisdom.",
      "Every moment you choose yourself is a moment of revolutionary self-love."
    ];
    
    // Use current date to ensure same insight for the entire day
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const dailyInsight = insights[dayOfYear % insights.length];

    // Calculate motivation meter
    const recentActivity = Math.min(10, ritualStreak + (currentXP % 50) / 10);
    const motivationLevel = Math.max(1, Math.min(10, Math.floor(recentActivity) + 1));
    
    const motivationMessages = [
      'Just Getting Started', 'Building Momentum', 'Finding Your Rhythm', 
      'Making Progress', 'Steady Growth', 'Strong Foundation', 
      'Momentum Building!', 'On Fire!', 'Unstoppable!', 'Transformation Master!'
    ];

    // Real completed rituals count (total lifetime)
    let completedRituals = 0;
    try {
      const sinceEpoch = new Date(0);
      const countRes = await db
        .select({ count: sql<number>`COUNT(${dailyRitualCompletions.id})` })
        .from(dailyRitualCompletions)
        .where(eq(dailyRitualCompletions.user_id, user.id));
      completedRituals = countRes[0]?.count || 0;
    } catch (e) {
      console.warn('Failed to count completed rituals, falling back heuristic', e);
      completedRituals = ritualStreak * 3;
    }

    // Build real streak history for last 14 days using completion rows
    let streakHistory: Array<{ date: string; completed: boolean }> = [];
    try {
      const days = 14;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (days - 1));
      startDate.setHours(0,0,0,0);
      const rows = await db
        .select({ d: sql<string>`DATE(${dailyRitualCompletions.completed_at})` })
        .from(dailyRitualCompletions)
        .where(and(
          eq(dailyRitualCompletions.user_id, user.id),
          gte(dailyRitualCompletions.completed_at, startDate)
        ));
      const completedSet = new Set(rows.map(r => r.d));
      for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const iso = d.toISOString().slice(0,10);
        streakHistory.push({ date: iso, completed: completedSet.has(iso) });
      }
    } catch (e) {
      console.warn('Failed to build streak history, using synthetic', e);
      streakHistory = Array.from({ length: 14 }).map((_, i) => {
        const daysAgo = 13 - i;
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        const inStreak = daysAgo < ritualStreak;
        return { date: date.toISOString().slice(0,10), completed: inStreak };
      });
    }

    const dashboardData = {
      streaks: {
        rituals: ritualStreak,
        noContact: noContactStreak
      },
      xp: {
        current: currentXP,
        level: level,
        nextLevelXP: nextLevelXP,
        progressFraction: progressFraction
      },
      badges: badges,
      todaysRituals: todaysRituals,
      wallPosts: wallPosts,
      dailyInsight: dailyInsight,
      motivationMeter: {
        level: motivationLevel,
        message: motivationMessages[motivationLevel - 1]
      },
      completedRituals,
      streakHistory
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('Dashboard hub API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
