import { db } from '@/lib/db/drizzle';
import { 
  users, 
  sessions, 
  anonymousPosts, 
  wallPostReactions,
  rituals,
  ritualCompletions,
  analyticsEvents 
} from '@/lib/db/schema';
import { eq, gte, lte, count, sql, desc, asc } from 'drizzle-orm';

export interface AnalyticsMetrics {
  userMetrics: {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    newUsersThisWeek: number;
    retentionRate: number;
    churnRate: number;
  };
  engagementMetrics: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionDuration: number;
    wallPostsCreated: number;
    wallReactionsGiven: number;
    ritualsCompleted: number;
  };
  conversionMetrics: {
    signupToSubscription: number;
    freeToPayingConversion: number;
    subscriptionRetention: number;
    monthlyRecurringRevenue: number;
    averageRevenuePerUser: number;
  };
  contentMetrics: {
    mostPopularCategories: Array<{ category: string; count: number }>;
    topPerformingPosts: Array<{ id: string; reactions: number; content: string }>;
    userContentCreation: number;
  };
}

export class AnalyticsService {
  static async getDashboardMetrics(timeframe: '24h' | '7d' | '30d' = '30d'): Promise<AnalyticsMetrics> {
    const now = new Date();
    const timeframeDays = timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : 30;
    const startDate = new Date(now.getTime() - timeframeDays * 24 * 60 * 60 * 1000);

    try {
      const [
        userMetrics,
        engagementMetrics,
        conversionMetrics,
        contentMetrics
      ] = await Promise.all([
        this.getUserMetrics(startDate, now),
        this.getEngagementMetrics(startDate, now),
        this.getConversionMetrics(startDate, now),
        this.getContentMetrics(startDate, now)
      ]);

      return {
        userMetrics,
        engagementMetrics,
        conversionMetrics,
        contentMetrics
      };
    } catch (error) {
      console.error('Analytics service error:', error);
      throw new Error('Failed to fetch analytics metrics');
    }
  }

  private static async getUserMetrics(startDate: Date, endDate: Date) {
    const totalUsers = await db.select({ count: count() }).from(users);
    
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const newUsersToday = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, todayStart));

    const newUsersThisWeek = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, weekStart));

    // Active users (users with sessions in the timeframe)
    const activeUsers = await db
      .select({ count: count() })
      .from(sessions)
      .where(gte(sessions.expiresAt, startDate));

    return {
      totalUsers: totalUsers[0]?.count || 0,
      activeUsers: activeUsers[0]?.count || 0,
      newUsersToday: newUsersToday[0]?.count || 0,
      newUsersThisWeek: newUsersThisWeek[0]?.count || 0,
      retentionRate: 0, // Calculate based on cohort analysis
      churnRate: 0 // Calculate based on subscription cancellations
    };
  }

  private static async getEngagementMetrics(startDate: Date, endDate: Date) {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [dailyActive, weeklyActive, monthlyActive] = await Promise.all([
      db.select({ count: count() }).from(sessions).where(gte(sessions.expiresAt, oneDayAgo)),
      db.select({ count: count() }).from(sessions).where(gte(sessions.expiresAt, oneWeekAgo)),
      db.select({ count: count() }).from(sessions).where(gte(sessions.expiresAt, oneMonthAgo))
    ]);

    const wallPostsCreated = await db
      .select({ count: count() })
      .from(anonymousPosts)
      .where(gte(anonymousPosts.createdAt, startDate));

    const wallReactionsGiven = await db
      .select({ count: count() })
      .from(wallPostReactions)
      .where(gte(wallPostReactions.createdAt, startDate));

    const ritualsCompleted = await db
      .select({ count: count() })
      .from(ritualCompletions)
      .where(
        sql`${ritualCompletions.completedAt} >= ${startDate} AND ${ritualCompletions.completedAt} IS NOT NULL`
      );

    return {
      dailyActiveUsers: dailyActive[0]?.count || 0,
      weeklyActiveUsers: weeklyActive[0]?.count || 0,
      monthlyActiveUsers: monthlyActive[0]?.count || 0,
      averageSessionDuration: 0, // Would need session tracking
      wallPostsCreated: wallPostsCreated[0]?.count || 0,
      wallReactionsGiven: wallReactionsGiven[0]?.count || 0,
      ritualsCompleted: ritualsCompleted[0]?.count || 0
    };
  }

  private static async getConversionMetrics(startDate: Date, endDate: Date) {
    const totalUsers = await db.select({ count: count() }).from(users);
    const paidUsers = await db
      .select({ count: count() })
      .from(users)
      .where(sql`${users.tier} != 'ghost'`);

    // For now, we'll just count active paid users as subscription metric
    const activeSubscriptions = await db
      .select({ count: count() })
      .from(users)
      .where(sql`${users.tier} != 'ghost'`);

    return {
      signupToSubscription: 0, // Calculate conversion funnel
      freeToPayingConversion: totalUsers[0]?.count ? 
        (paidUsers[0]?.count || 0) / totalUsers[0].count * 100 : 0,
      subscriptionRetention: 0, // Calculate retention rate
      monthlyRecurringRevenue: 0, // Calculate from Stripe data
      averageRevenuePerUser: 0 // Calculate ARPU
    };
  }

  private static async getContentMetrics(startDate: Date, endDate: Date) {
    // Most popular post categories
    const categoryCounts = await db
      .select({
        category: anonymousPosts.glitchCategory,
        count: count()
      })
      .from(anonymousPosts)
      .where(gte(anonymousPosts.createdAt, startDate))
      .groupBy(anonymousPosts.glitchCategory)
      .orderBy(desc(count()));

    // Top performing posts by reactions
    const topPosts = await db
      .select({
        id: anonymousPosts.id,
        content: anonymousPosts.content,
        reactions: sql<number>`COUNT(${wallPostReactions.id})`
      })
      .from(anonymousPosts)
      .leftJoin(wallPostReactions, eq(anonymousPosts.id, wallPostReactions.postId))
      .where(gte(anonymousPosts.createdAt, startDate))
      .groupBy(anonymousPosts.id, anonymousPosts.content)
      .orderBy(desc(sql`COUNT(${wallPostReactions.id})`))
      .limit(5);

    const userContentCreation = await db
      .select({ count: count() })
      .from(anonymousPosts)
      .where(gte(anonymousPosts.createdAt, startDate));

    return {
      mostPopularCategories: categoryCounts.map(row => ({
        category: row.category || 'uncategorized',
        count: row.count
      })),
      topPerformingPosts: topPosts.map(post => ({
        id: post.id,
        reactions: post.reactions || 0,
        content: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : '')
      })),
      userContentCreation: userContentCreation[0]?.count || 0
    };
  }

  // Real-time analytics tracking
  static async trackEvent(event: {
    userId?: string;
    eventType: string;
    properties?: Record<string, any>;
    timestamp?: Date;
  }) {
    try {
      // In a production app, you'd send this to your analytics service
      // For now, we'll just log it and optionally store in database
      console.log('Analytics Event:', {
        ...event,
        timestamp: event.timestamp || new Date()
      });

      // You could store events in a dedicated analytics table
      // or send to services like Mixpanel, Amplitude, etc.
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  }

  // Funnel analysis
  static async getFunnelMetrics(funnelSteps: string[]) {
    try {
      // Calculate conversion rates between funnel steps
      const funnelData = [];
      
      for (let i = 0; i < funnelSteps.length; i++) {
        const step = funnelSteps[i];
        
        // This is a simplified example - you'd need an events table
        // to properly track funnel conversion
        
        funnelData.push({
          step,
          users: 0, // Count of users who completed this step
          conversionRate: 0 // Percentage from previous step
        });
      }
      
      return funnelData;
    } catch (error) {
      console.error('Failed to calculate funnel metrics:', error);
      return [];
    }
  }

  // Cohort analysis
  static async getCohortAnalysis(startDate: Date, endDate: Date) {
    try {
      // Group users by signup week/month
      // Track their activity over subsequent periods
      // Return retention data by cohort
      
      const cohorts = await db
        .select({
          cohortPeriod: sql<string>`DATE_TRUNC('week', ${users.createdAt})`,
          userCount: count()
        })
        .from(users)
        .where(
          sql`${users.createdAt} >= ${startDate} AND ${users.createdAt} <= ${endDate}`
        )
        .groupBy(sql`DATE_TRUNC('week', ${users.createdAt})`)
        .orderBy(asc(sql`DATE_TRUNC('week', ${users.createdAt})`));

      return cohorts;
    } catch (error) {
      console.error('Failed to calculate cohort analysis:', error);
      return [];
    }
  }
}
