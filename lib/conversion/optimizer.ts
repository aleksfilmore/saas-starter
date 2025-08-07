import { AnalyticsService } from '@/lib/analytics/service';
import { AnalyticsEvents } from '@/lib/analytics/events';

/**
 * Conversion Optimization Service
 * Implements A/B testing, funnel optimization, and conversion tracking
 */
export class ConversionOptimizer {
  
  /**
   * Track conversion funnel step
   */
  static async trackFunnelStep(
    userId: string | undefined,
    funnel: string,
    step: string,
    metadata?: Record<string, any>
  ) {
    await AnalyticsService.trackConversion(
      userId || 'anonymous',
      funnel,
      step,
      {
        timestamp: new Date(),
        ...metadata
      }
    );
  }

  /**
   * Track paywall interaction
   */
  static async trackPaywallInteraction(
    userId: string | undefined,
    feature: string,
    action: 'viewed' | 'upgrade_clicked' | 'dismissed',
    context?: Record<string, any>
  ) {
    await AnalyticsService.track({
      userId,
      event: `paywall_${action}`,
      properties: {
        feature,
        action,
        ...context
      }
    });
  }

  /**
   * Track feature discovery
   */
  static async trackFeatureDiscovery(
    userId: string | undefined,
    feature: string,
    source: 'dashboard' | 'navigation' | 'onboarding' | 'referral',
    context?: Record<string, any>
  ) {
    await AnalyticsService.track({
      userId,
      event: 'feature_discovered',
      properties: {
        feature,
        source,
        ...context
      }
    });
  }

  /**
   * Track user journey milestones
   */
  static async trackMilestone(
    userId: string,
    milestone: string,
    daysSinceSignup: number,
    context?: Record<string, any>
  ) {
    await AnalyticsService.track({
      userId,
      event: `milestone_${milestone}`,
      properties: {
        milestone,
        daysSinceSignup,
        ...context
      }
    });
  }

  /**
   * Track subscription conversion events
   */
  static async trackSubscriptionEvent(
    userId: string,
    event: 'plan_viewed' | 'checkout_started' | 'payment_completed' | 'cancelled',
    plan: string,
    amount?: number,
    context?: Record<string, any>
  ) {
    await AnalyticsService.track({
      userId,
      event: `subscription_${event}`,
      properties: {
        plan,
        amount,
        event,
        ...context
      }
    });
  }

  /**
   * Track onboarding progression
   */
  static async trackOnboardingStep(
    userId: string,
    step: number,
    stepName: string,
    completed: boolean,
    timeSpent?: number
  ) {
    await AnalyticsService.track({
      userId,
      event: completed ? 'onboarding_step_completed' : 'onboarding_step_viewed',
      properties: {
        step,
        stepName,
        completed,
        timeSpent
      }
    });
  }

  /**
   * Track feature usage patterns
   */
  static async trackFeatureUsagePattern(
    userId: string,
    features: string[],
    sessionDuration: number,
    context?: Record<string, any>
  ) {
    await AnalyticsService.track({
      userId,
      event: 'feature_usage_pattern',
      properties: {
        features,
        featureCount: features.length,
        sessionDuration,
        ...context
      }
    });
  }

  /**
   * A/B Testing Framework
   */
  static getVariant(userId: string, testName: string): 'A' | 'B' {
    // Simple hash-based A/B testing
    const hash = this.hashString(`${userId}_${testName}`);
    return hash % 2 === 0 ? 'A' : 'B';
  }

  static async trackABTestExposure(
    userId: string,
    testName: string,
    variant: 'A' | 'B',
    context?: Record<string, any>
  ) {
    await AnalyticsService.track({
      userId,
      event: 'ab_test_exposure',
      properties: {
        testName,
        variant,
        ...context
      }
    });
  }

  static async trackABTestConversion(
    userId: string,
    testName: string,
    variant: 'A' | 'B',
    conversionEvent: string,
    context?: Record<string, any>
  ) {
    await AnalyticsService.track({
      userId,
      event: 'ab_test_conversion',
      properties: {
        testName,
        variant,
        conversionEvent,
        ...context
      }
    });
  }

  /**
   * Conversion funnel analysis
   */
  static async analyzeDropoffPoints(funnelName: string, days: number = 30) {
    const metrics = await AnalyticsService.getConversionFunnelMetrics(funnelName, days);
    
    // Find the biggest drop-off points
    const dropoffs = metrics
      .map((metric, index) => ({
        stage: metric.stage,
        dropOffRate: metric.dropOffRate,
        userCount: metric.count,
        index
      }))
      .filter(item => item.dropOffRate > 20) // Only significant drop-offs
      .sort((a, b) => b.dropOffRate - a.dropOffRate);

    return {
      funnelName,
      totalStages: metrics.length,
      overallConversionRate: metrics[metrics.length - 1]?.conversionRate || 0,
      biggestDropoffs: dropoffs.slice(0, 3),
      recommendations: this.generateOptimizationRecommendations(dropoffs)
    };
  }

  /**
   * Generate optimization recommendations
   */
  private static generateOptimizationRecommendations(
    dropoffs: Array<{ stage: string; dropOffRate: number; userCount: number; index: number }>
  ): string[] {
    const recommendations: string[] = [];

    dropoffs.forEach(dropoff => {
      switch (dropoff.stage) {
        case 'pricing_page_viewed':
          if (dropoff.dropOffRate > 50) {
            recommendations.push('Consider simplifying pricing tiers or adding value proposition');
          }
          break;
        case 'checkout_started':
          if (dropoff.dropOffRate > 30) {
            recommendations.push('Optimize checkout flow - reduce form fields or add trust signals');
          }
          break;
        case 'onboarding_started':
          if (dropoff.dropOffRate > 40) {
            recommendations.push('Shorten onboarding flow or add progress indicators');
          }
          break;
        case 'ai_therapy_paywall_viewed':
          if (dropoff.dropOffRate > 60) {
            recommendations.push('Improve AI therapy value proposition or offer trial');
          }
          break;
        default:
          recommendations.push(`High drop-off at ${dropoff.stage} - investigate user experience`);
      }
    });

    return recommendations;
  }

  /**
   * User engagement scoring
   */
  static async calculateEngagementScore(userId: string, days: number = 30): Promise<number> {
    const analytics = await AnalyticsService.getUserAnalytics(userId, days);
    
    let score = 0;
    
    // Daily activity score (max 30 points)
    score += Math.min(analytics.uniqueDays * 2, 30);
    
    // Feature usage diversity (max 25 points)
    const uniqueFeatures = Object.keys(analytics.featureUsage).length;
    score += Math.min(uniqueFeatures * 3, 25);
    
    // Total activity score (max 25 points)
    score += Math.min(analytics.totalEvents / 2, 25);
    
    // Session frequency score (max 20 points)
    const avgEventsPerDay = analytics.averageEventsPerDay;
    score += Math.min(avgEventsPerDay * 2, 20);
    
    return Math.min(Math.round(score), 100);
  }

  /**
   * Churn risk assessment
   */
  static async assessChurnRisk(userId: string): Promise<'low' | 'medium' | 'high'> {
    const engagementScore = await this.calculateEngagementScore(userId, 7);
    const analytics = await AnalyticsService.getUserAnalytics(userId, 7);
    
    // High churn risk indicators
    if (engagementScore < 20 || analytics.uniqueDays < 2) {
      return 'high';
    }
    
    // Medium churn risk indicators
    if (engagementScore < 50 || analytics.uniqueDays < 4) {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Helper functions
   */
  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}

/**
 * Conversion tracking hooks for React components
 */
export const useConversionTracking = () => {
  const trackPageView = (page: string, userId?: string) => {
    ConversionOptimizer.trackFunnelStep(userId, 'general', 'page_viewed', { page });
  };

  const trackButtonClick = (button: string, location: string, userId?: string) => {
    ConversionOptimizer.trackFunnelStep(userId, 'engagement', 'button_clicked', { 
      button, 
      location 
    });
  };

  const trackFeatureInteraction = (feature: string, action: string, userId?: string) => {
    ConversionOptimizer.trackFeatureUsagePattern(
      userId || 'anonymous',
      [feature],
      0,
      { action }
    );
  };

  return {
    trackPageView,
    trackButtonClick,
    trackFeatureInteraction
  };
};
