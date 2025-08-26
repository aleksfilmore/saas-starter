import { db } from '@/lib/db';
import { analyticsEvents, userSessions, conversionFunnels } from '@/lib/db/unified-schema';
import { AnalyticsEvent, AnalyticsEvents, ConversionFunnels } from './events';
import { eq, and, gte, lte, desc, count, inArray } from 'drizzle-orm';
// NOTE: Bytes economy aggregation relies on client events containing a numeric 'delta' property.
// We aggregate by known event names (BYTES_EARNED_*) for admin reporting.

/**
 * Analytics Service
 * Handles event tracking, metrics calculation, and reporting
 */
export class AnalyticsService {
  // Cache detection of legacy schema (no source/jsonb) to avoid repeated failing inserts
  private static legacyNoSourceColumn: boolean | null = null;
  
  /**
   * Track an analytics event
   */
  static async track(event: AnalyticsEvent) {
    try {
      // Get session ID from headers or generate one
      const sessionId = event.sessionId || this.generateSessionId();
      
      // Derive normalized source (optional) if provided in properties for direct column write
      const sourceRaw = (event.properties as any)?.source || (event.properties as any)?.mode || (event.properties as any)?.context;
      const baseValues: any = {
        id: crypto.randomUUID(),
        userId: event.userId,
        sessionId,
        event: event.event,
        properties: (event.properties || {}) as any,
        timestamp: event.timestamp || new Date(),
        userAgent: event.userAgent,
        ip: event.ip,
        referer: event.referer
      };
      if (!AnalyticsService.legacyNoSourceColumn && sourceRaw) {
        baseValues.source = String(sourceRaw).toLowerCase();
      }
      try {
        await db.insert(analyticsEvents).values(baseValues);
      } catch (err:any) {
        const msg = String(err?.message||'');
        if (AnalyticsService.legacyNoSourceColumn === null && /column .*source/i.test(msg)) {
          // Mark legacy mode and retry without source
            AnalyticsService.legacyNoSourceColumn = true;
            delete baseValues.source;
            try { await db.insert(analyticsEvents).values(baseValues); } catch(innerErr){ console.error('Analytics tracking fallback failed:', innerErr); }
        } else {
          throw err; // propagate to outer catch
        }
      }

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
    
    const featureUsage = events.reduce((acc, event: any) => {
      const props = (event as any).properties || {};
      const feature = props.feature || 'unknown';
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
    const totalRevenue = subscriptionEvents.reduce((sum, event: any) => {
      const props = (event as any).properties || {};
      return sum + (props.amount || 0);
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
      .select({ properties: analyticsEvents.properties, count: count() })
      .from(analyticsEvents)
      .where(gte(analyticsEvents.timestamp, startDate))
      .groupBy(analyticsEvents.properties)
      .orderBy(desc(count()))
      .limit(limit);

    return featureEvents
      .map(event => ({
        feature: (event as any).properties?.feature || 'unknown',
        count: event.count
      }))
      .filter(item => item.feature !== 'unknown');
  }

  /**
   * Aggregate bytes economy metrics over a time window.
   * Returns total bytes earned, per-event breakdown, and per-source grouping if source present.
   */
  static async getBytesEconomyMetrics(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch all bytes earned events in window
    const byteEventNames = [
      AnalyticsEvents.BYTES_EARNED_CHECKIN,
      AnalyticsEvents.BYTES_EARNED_NO_CONTACT,
      AnalyticsEvents.BYTES_EARNED_RITUAL,
      AnalyticsEvents.BYTES_EARNED_RITUAL_GHOST,
      AnalyticsEvents.BYTES_EARNED_DAILY_ACTION,
      AnalyticsEvents.BYTES_EARNED_AI_CHAT,
      AnalyticsEvents.BYTES_EARNED_WALL_POST,
      AnalyticsEvents.BYTES_EARNED_WALL_INTERACT
    ];

    // Simple select (could be filtered server-side with an IN clause; using multiple awaits if IN not supported in current drizzle setup)
    // Fetch needed rows with event filter; aggregate in memory using jsonb extraction (delta field)
    const rows = await db.select().from(analyticsEvents)
      .where(and(gte(analyticsEvents.timestamp, startDate), inArray(analyticsEvents.event, byteEventNames)));

    const perEvent: Record<string, { count: number; bytes: number }> = {};
    const perSource: Record<string, { count: number; bytes: number }> = {};
    let totalBytes = 0;
    for (const r of rows as any[]) {
      const props = r.properties || {};
      const delta = typeof props.delta === 'number' ? props.delta : 0;
      totalBytes += delta;
      if(!perEvent[r.event]) perEvent[r.event] = { count:0, bytes:0 };
      perEvent[r.event].count++;
      perEvent[r.event].bytes += delta;
      const source = (r.source || props.source || props.mode || props.context || 'unknown').toString();
      if(!perSource[source]) perSource[source] = { count:0, bytes:0 };
      perSource[source].count++;
      perSource[source].bytes += delta;
    }
    return {
      windowDays: days,
      totalBytes,
      events: Object.entries(perEvent).map(([event, v]) => ({ event, ...v })).sort((a,b)=> b.bytes - a.bytes),
      sources: Object.entries(perSource).map(([source, v]) => ({ source, ...v })).sort((a,b)=> b.bytes - a.bytes)
    };
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
