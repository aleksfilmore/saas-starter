import { db } from '@/lib/db';
import { analyticsEvents, userSessions, conversionFunnels } from '@/lib/db/unified-schema';
import { AnalyticsEvent, AnalyticsEvents, ConversionFunnels } from './events';
import { eq, and, gte, lte, desc, count, avg, sum } from 'drizzle-orm';

/**
 * Analytics Service
 * Handles event tracking, metrics calculation, and reporting
 */
export class AnalyticsService {
  
  /**
   * Track an analytics event
   */
  static async track(event: AnalyticsEvent) {
    try {
      // Get session ID from headers or generate one
      const sessionId = event.sessionId || this.generateSessionId();
      
      await db.insert(analyticsEvents).values({
        id: crypto.randomUUID(),
        userId: event.userId,
        sessionId,
        event: event.event,
        properties: JSON.stringify(event.properties || {}),
        timestamp: event.timestamp || new Date(),
        userAgent: event.userAgent,
        ip: event.ip,
        referer: event.referer
      });

      // Update conversion funnels
      if (event.userId) {
        await this.updateConversionFunnels(event.userId, event.event);
      }

      // Update user session
      if (event.userId && sessionId) {
        await this.updateUserSession(event.userId, sessionId);
      }

    } catch (error) {
      console.error('Analytics tracking error:', error);
      // Don't throw - analytics should never break the main flow
    }
  }

  /**
   * Track feature usage
   */
  static async trackFeatureUsage(
    userId: string,
    feature: string,
    category: string,
    properties?: Record<string, any>
  ) {
    await this.track({
      userId,
      event: `${category}_${feature}_used`,
      properties: {
        feature,
        category,
        ...properties
      }
    });
  }

  /**
   * Track conversion event
   */
  static async trackConversion(
    userId: string,
    funnel: string,
    stage: string,
    properties?: Record<string, any>
  ) {
    await this.track({
      userId,
      event: `conversion_${funnel}_${stage}`,
      properties: {
        funnel,
        stage,
        ...properties
      }
    });
  }

  /**
   * Get user analytics summary
   */
  static async getUserAnalytics(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const events = await db
      .select()
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.userId, userId),
          gte(analyticsEvents.timestamp, startDate)
        )
      )
      .orderBy(desc(analyticsEvents.timestamp));

    // Calculate metrics
    const totalEvents = events.length;
    const uniqueDays = new Set(
      events.map(e => e.timestamp.toDateString())
    ).size;
    
    const featureUsage = events.reduce((acc, event) => {
      let properties: any = {};
      try {
        properties = JSON.parse(event.properties || '{}');
      } catch {
        properties = {};
      }
      const feature = properties.feature || 'unknown';
      acc[feature] = (acc[feature] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEvents,
      uniqueDays,
      averageEventsPerDay: totalEvents / uniqueDays || 0,
      featureUsage,
      recentEvents: events.slice(0, 10)
    };
  }

  /**
   * Get conversion funnel metrics
   */
  static async getConversionFunnelMetrics(
    funnelName: string,
    days: number = 30
  ) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const funnelStages = ConversionFunnels[funnelName as keyof typeof ConversionFunnels];
    if (!funnelStages) {
      throw new Error(`Unknown funnel: ${funnelName}`);
    }

    const metrics: Array<{ stage: string; count: number }> = [];
    for (const stage of funnelStages) {
      const stageCount = await db
        .select({ count: count() })
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.event, stage),
            gte(analyticsEvents.timestamp, startDate)
          )
        );

      metrics.push({
        stage,
        count: stageCount[0]?.count || 0
      });
    }

    // Calculate conversion rates
    const funnelMetrics = metrics.map((metric, index) => {
      const previousCount = index > 0 ? metrics[index - 1].count : metric.count;
      const conversionRate = previousCount > 0 ? (metric.count / previousCount) * 100 : 0;
      
      return {
        ...metric,
        conversionRate: Math.round(conversionRate * 100) / 100,
        dropOffRate: Math.round((100 - conversionRate) * 100) / 100
      };
    });

    return funnelMetrics;
  }

  /**
   * Get revenue metrics
   */
  static async getRevenueMetrics(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get subscription events
    let subscriptionEvents = await db
      .select()
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.event, AnalyticsEvents.SUBSCRIPTION_CHECKOUT_COMPLETED),
          gte(analyticsEvents.timestamp, startDate)
        )
      );

    if (!Array.isArray(subscriptionEvents)) {
      subscriptionEvents = [];
    }

    // Calculate basic revenue metrics
    const totalRevenue = subscriptionEvents.reduce((sum, event) => {
      let properties: any = {};
      try {
        properties = JSON.parse(event.properties || '{}');
      } catch {
        properties = {};
      }
      return sum + (properties.amount || 0);
    }, 0);

    const averageRevenuePerUser = subscriptionEvents.length > 0 
      ? totalRevenue / subscriptionEvents.length 
      : 0;

    // Monthly recurring revenue (simplified)
    const monthlyRevenue = totalRevenue * (30 / days);

    return {
      totalRevenue,
      averageRevenuePerUser,
      monthlyRecurringRevenue: monthlyRevenue,
      annualRecurringRevenue: monthlyRevenue * 12,
      totalSubscriptions: subscriptionEvents.length
    };
  }

  /**
   * Get user retention metrics
   */
  static async getRetentionMetrics() {
    const now = new Date();
    
    // Calculate retention for different time periods
    const retentionPeriods = [1, 7, 30, 90];
    const retention: Record<string, number> = {};

    for (const days of retentionPeriods) {
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - days);

      const cohortDate = new Date(now);
      cohortDate.setDate(cohortDate.getDate() - days - 1);

      // Users who signed up on the cohort date
  let cohortUsers = await db
        .select({ userId: analyticsEvents.userId })
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.event, AnalyticsEvents.USER_SIGNED_UP),
            gte(analyticsEvents.timestamp, cohortDate),
            lte(analyticsEvents.timestamp, startDate)
          )
        );
  if (!Array.isArray(cohortUsers)) cohortUsers = [];

  // Users from cohort who were active after the retention period
  let activeUsers = await db
        .select({ userId: analyticsEvents.userId })
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.event, AnalyticsEvents.DAILY_LOGIN),
            gte(analyticsEvents.timestamp, startDate)
          )
        );
  if (!Array.isArray(activeUsers)) activeUsers = [];

      const cohortSize = cohortUsers.length;
      const retainedUsers = activeUsers.filter(user => 
        cohortUsers.some(cohortUser => cohortUser.userId === user.userId)
      ).length;

      retention[`day${days}`] = cohortSize > 0 
        ? Math.round((retainedUsers / cohortSize) * 10000) / 100
        : 0;
    }

    return retention;
  }

  /**
   * Get top features by usage
   */
  static async getTopFeatures(days: number = 30, limit: number = 10) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const featureEvents = await db
      .select({
        properties: analyticsEvents.properties,
        count: count()
      })
      .from(analyticsEvents)
      .where(
        and(
          gte(analyticsEvents.timestamp, startDate)
        )
      )
      .groupBy(analyticsEvents.properties)
      .orderBy(desc(count()))
      .limit(limit);

    return featureEvents
      .map(event => {
        let properties: any = {};
        try {
          properties = JSON.parse(event.properties || '{}');
        } catch {
          properties = {};
        }
        return {
          feature: properties.feature || 'unknown',
          count: event.count
        };
      })
      .filter(item => item.feature !== 'unknown');
  }

  /**
   * Private helper methods
   */
  private static generateSessionId(): string {
    return crypto.randomUUID();
  }

  private static async updateConversionFunnels(userId: string, event: string) {
    // Implementation for funnel tracking
    try {
      await db.insert(conversionFunnels).values({
        id: crypto.randomUUID(),
        userId,
        funnelName: 'main',
        stage: event,
        timestamp: new Date(),
        properties: '{}'
      });
    } catch (error) {
      console.error('Conversion funnel update error:', error);
    }
  }

  private static async updateUserSession(userId: string, sessionId: string) {
    // Update or create user session
    try {
      const existing = await db
        .select()
        .from(userSessions)
        .where(eq(userSessions.sessionId, sessionId))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(userSessions).values({
          id: crypto.randomUUID(),
          userId,
          sessionId,
          startTime: new Date(),
          lastActivity: new Date()
        });
      } else {
        await db
          .update(userSessions)
          .set({ lastActivity: new Date() })
          .where(eq(userSessions.sessionId, sessionId));
      }
    } catch (error) {
      console.error('User session update error:', error);
    }
  }
}
