import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users, dailyRituals, ritualCompletions, noContactPeriods, dailyCheckIns, anonymousPosts } from '@/lib/db/schema';
import { validateRequest } from '@/lib/auth';
import { getUserId } from '@/lib/utils';
import { sql, count, desc, gte, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin role check
    // For now, allowing any authenticated user to access admin data
    
    // System Health Metrics
    const totalUsers = await db.select({ count: count() }).from(users);
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // New registrations (need to add createdAt to users schema)
    // For now, approximate with user count
    
    // Active No Contact periods
    const activeNoContactPeriods = await db
      .select({ count: count() })
      .from(noContactPeriods)
      .where(eq(noContactPeriods.isActive, true));

    // Total rituals completed
    const totalRitualCompletions = await db.select({ count: count() }).from(ritualCompletions);

    // Recent anonymous posts (Wall of Wounds activity)
    const recentPosts = await db
      .select({ count: count() })
      .from(anonymousPosts)
      .where(gte(anonymousPosts.createdAt, sevenDaysAgo));

    // Most popular ritual categories
    const popularRitualCategories = await db
      .select({ 
        category: dailyRituals.category,
        completions: count(ritualCompletions.id)
      })
      .from(dailyRituals)
      .leftJoin(ritualCompletions, eq(dailyRituals.id, ritualCompletions.ritualId))
      .groupBy(dailyRituals.category)
      .orderBy(desc(count(ritualCompletions.id)))
      .limit(5);

    // Anonymous user activity overview
    const userActivityOverview = await db
      .select({
        userId: users.id,
        username: users.username,
        avatar: users.avatar,
        subscriptionTier: users.subscriptionTier,
        xpPoints: users.xpPoints,
        byteBalance: users.byteBalance,
        glowUpLevel: users.glowUpLevel,
        totalRituals: count(ritualCompletions.id)
      })
      .from(users)
      .leftJoin(ritualCompletions, eq(users.id, ritualCompletions.userId))
      .groupBy(users.id, users.username, users.avatar, users.subscriptionTier, users.xpPoints, users.byteBalance, users.glowUpLevel)
      .orderBy(desc(count(ritualCompletions.id)))
      .limit(20);

    return NextResponse.json({
      systemHealth: {
        totalUsers: totalUsers[0]?.count || 0,
        activeNoContactPeriods: activeNoContactPeriods[0]?.count || 0,
        totalRitualCompletions: totalRitualCompletions[0]?.count || 0,
        recentWallActivity: recentPosts[0]?.count || 0
      },
      gamification: {
        popularRitualCategories: popularRitualCategories,
        // TODO: Add XP/Byte distribution stats
      },
      userOverview: userActivityOverview.map(user => ({
        anonymousId: user.userId,
        codename: user.username || 'Unassigned Operative',
        avatar: user.avatar || 'default-glitch',
        tier: user.subscriptionTier || 'ghost_mode',
        glowUpLevel: user.glowUpLevel || 1,
        xpPoints: user.xpPoints || 0,
        byteBalance: user.byteBalance || 0,
        totalRituals: user.totalRituals || 0
      }))
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
