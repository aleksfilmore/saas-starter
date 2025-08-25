import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { 
  users, 
  anonymousPosts, 
  ritualCompletions, 
  subscriptionEvents,
  apiUsage,
  ritualLibrary,
  blogPosts
} from '@/lib/db/unified-schema';
import { gte, lte, count, sum, avg, eq, desc, and } from 'drizzle-orm';

export const runtime = 'nodejs';

// GET /api/admin/analytics/realtime - Get real-time analytics data
export async function GET(request: NextRequest) {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.email !== 'system_admin@ctrlaltblock.com') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;
    
    switch (range) {
      case '1d':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 48 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    }

    // Get user statistics
    const [totalUsersResult] = await db.select({ count: count() }).from(users);
    const totalUsers = totalUsersResult?.count || 0;

    const [currentPeriodUsersResult] = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, startDate));
    const currentPeriodUsers = currentPeriodUsersResult?.count || 0;

    const [previousPeriodUsersResult] = await db
      .select({ count: count() })
      .from(users)
      .where(and(
        gte(users.createdAt, previousStartDate),
        lte(users.createdAt, startDate)
      ));
    const previousPeriodUsers = previousPeriodUsersResult?.count || 0;

    const userGrowthRate = previousPeriodUsers > 0 
      ? ((currentPeriodUsers - previousPeriodUsers) / previousPeriodUsers) * 100 
      : 0;

    // Get subscription data (no dummy data - using zeros until real tracking implemented)
    const subscriptions = 0; // Real implementation needed
    const subscriptionGrowthRate = 0; // Real implementation needed
    const monthlyRevenue = 0; // Real implementation needed
    const revenueGrowthRate = 0; // Real implementation needed

    // Get Wall posts statistics
    const [wallPostsResult] = await db
      .select({ count: count() })
      .from(anonymousPosts)
      .where(gte(anonymousPosts.createdAt, startDate));
    const wallPosts = wallPostsResult?.count || 0;

    // Get ritual completions
    const [ritualCompletionsResult] = await db
      .select({ count: count() })
      .from(ritualCompletions)
      .where(gte(ritualCompletions.completedAt, startDate));
    const ritualsCompleted = ritualCompletionsResult?.count || 0;

    // Get API usage data (no dummy data - using zeros until real tracking implemented)
    const openaiUsage = {
      totalTokens: 0,
      totalCost: 0,
      requestsToday: 0,
      avgCostPerRequest: 0,
    };

    const stripeUsage = {
      totalTransactions: 0,
      successRate: 0,
      totalVolume: 0,
      averageTransaction: 0,
    };

    const resendUsage = {
      emailsSent: 0,
      deliveryRate: 0,
      openRate: 0,
      clickRate: 0,
    };

    // Get popular rituals
    const popularRituals = await db
      .select({
        title: ritualLibrary.title,
        category: ritualLibrary.category,
        completions: count(ritualCompletions.id),
      })
      .from(ritualLibrary)
      .leftJoin(ritualCompletions, eq(ritualLibrary.id, ritualCompletions.ritualId))
      .where(gte(ritualCompletions.completedAt, startDate))
      .groupBy(ritualLibrary.id, ritualLibrary.title, ritualLibrary.category)
      .orderBy(desc(count(ritualCompletions.id)))
      .limit(5);

    // Blog post data (no dummy data - using empty array until view tracking implemented)
    const topBlogPosts: { title: string; views: number; engagement: number }[] = [];

    const analyticsData = {
      overview: {
        totalUsers,
        activeUsers: 0, // Real implementation needed
        newUsersToday: currentPeriodUsers,
        userGrowthRate,
        totalRevenue: 0, // Real implementation needed
        monthlyRevenue,
        revenueGrowthRate,
        subscriptions,
        subscriptionGrowthRate,
      },
      apiUsage: {
        openai: openaiUsage,
        stripe: stripeUsage,
        resend: resendUsage,
      },
      userEngagement: {
        wallPosts,
        ritualsCompleted,
        avgSessionTime: 0, // Real implementation needed
        returningUsers: 0, // Real implementation needed
        churnRate: 0, // Real implementation needed
      },
      topContent: {
        popularRituals: popularRituals.length > 0 ? popularRituals : [],
        topBlogPosts,
      },
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}
