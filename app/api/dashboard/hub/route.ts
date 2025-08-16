import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get fresh user data using SQL
    const userDataResult = await db.execute(sql`
      SELECT 
        id, email, tier, archetype, xp, bytes, level, 
        ritual_streak, no_contact_streak, selected_badge_id,
        last_checkin, last_ritual, created_at
      FROM users 
      WHERE id = ${user.id}
    `);

    if (userDataResult.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDataResult[0] as any;

    // Calculate XP and level
    const currentXP = userData.xp || 0;
    const level = userData.level || 1;
    const nextLevelXP = level * 100;
    const progressFraction = Math.min(1, (currentXP % 100) / 100);

    // Calculate streaks using correct field names
    const ritualStreak = userData.ritual_streak || 0;
    const noContactStreak = userData.no_contact_streak || 0;

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

    // Get real user badges from the badge system
    let badges = [];
    try {
      // Import from the correct schema location
      const userBadgeData = await db.execute(sql`
        SELECT badge_id, earned_at 
        FROM user_badges 
        WHERE user_id = ${user.id}
      `);

      // Get badge details
      const allBadges = await db.execute(sql`
        SELECT id, name, icon_url, is_active
        FROM badges
        WHERE is_active = true
      `);

      const earnedBadgeIds = new Set(userBadgeData.map((b: any) => b.badge_id));
      
      badges = allBadges.map((badge: any) => ({
        id: badge.id,
        name: badge.name,
        icon: badge.icon_url,
        unlocked: earnedBadgeIds.has(badge.id)
      }));
    } catch (error) {
      console.error('Failed to fetch real badges:', error);
      // Fallback to mock badges
      badges = [
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
    }

    // Generate daily insight based on user's progress
    const insights = [
      "Your consistent ritual practice is building new neural pathways. Each small action compounds.",
      "Progress isn't always linear. Celebrate the small victories on your healing journey.",
      "Remember: You're not broken, you're breaking free from patterns that no longer serve you.",
      "Every boundary you set is a gift to your future self.",
      "The fact that you're here shows incredible courage and self-awareness."
    ];
    
    const dailyInsight = insights[Math.floor(Math.random() * insights.length)];

    // Calculate motivation meter
    const recentActivity = Math.min(10, ritualStreak + (currentXP % 50) / 10);
    const motivationLevel = Math.max(1, Math.min(10, Math.floor(recentActivity) + 1));
    
    const motivationMessages = [
      'Just Getting Started', 'Building Momentum', 'Finding Your Rhythm', 
      'Making Progress', 'Steady Growth', 'Strong Foundation', 
      'Momentum Building!', 'On Fire!', 'Unstoppable!', 'Transformation Master!'
    ];

    // Real completed rituals count (simplified)
    let completedRituals = 0;
    try {
      const countResult = await db.execute(sql`
        SELECT COUNT(*) as count 
        FROM user_ritual_assignments 
        WHERE user_id = ${user.id} AND completed_at IS NOT NULL
      `);
      completedRituals = (countResult[0] as any)?.count || 0;
    } catch (e) {
      console.warn('Failed to count completed rituals, using streak estimate');
      completedRituals = ritualStreak * 3;
    }

    // Build simplified streak history
    let streakHistory: Array<{ date: string; completed: boolean }> = [];
    try {
      const days = 14;
      for (let i = 0; i < days; i++) {
        const daysAgo = 13 - i;
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        const inStreak = daysAgo < ritualStreak;
        streakHistory.push({ 
          date: date.toISOString().slice(0,10), 
          completed: inStreak 
        });
      }
    } catch (e) {
      console.warn('Failed to build streak history');
      streakHistory = [];
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
