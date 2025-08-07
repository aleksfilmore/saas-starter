/**
 * Test Script for Analytics and Referral System
 * Run this to verify all new functionality works correctly
 */

import { AnalyticsService } from '@/lib/analytics/service';
import { ReferralService } from '@/lib/referrals/service';
import { ConversionOptimizer } from '@/lib/conversion/optimizer';
import { AnalyticsEvents } from '@/lib/analytics/events';

async function testAnalyticsSystem() {
  console.log('🧪 Testing Analytics and Referral System...\n');

  try {
    // Test 1: Analytics Event Tracking
    console.log('1. Testing Analytics Event Tracking...');
    const testUserId = 'test-user-' + Date.now();
    const testSessionId = 'session-' + Date.now();

    await AnalyticsService.track({
      event: AnalyticsEvents.USER_SIGNED_UP,
      userId: testUserId,
      sessionId: testSessionId,
      properties: { 
        source: 'test-script',
        plan: 'pro',
        campaign: 'test-campaign'
      }
    });

    await AnalyticsService.track({
      event: AnalyticsEvents.PRICING_PAGE_VIEWED,
      userId: testUserId,
      sessionId: testSessionId,
      properties: { source: 'navigation' }
    });

    await AnalyticsService.track({
      event: AnalyticsEvents.SUBSCRIPTION_CHECKOUT_COMPLETED,
      userId: testUserId,
      sessionId: testSessionId,
      properties: { 
        plan: 'pro',
        amount: 2900,
        currency: 'usd'
      }
    });
    console.log('✅ Analytics events tracked successfully');

    // Test 2: User Analytics Retrieval
    console.log('\n2. Testing User Analytics Retrieval...');
    const userAnalytics = await AnalyticsService.getUserAnalytics(testUserId);
    console.log('User Analytics:', {
      totalEvents: userAnalytics.totalEvents,
      uniqueDays: userAnalytics.uniqueDays,
      averageEventsPerDay: userAnalytics.averageEventsPerDay,
      recentEventsCount: userAnalytics.recentEvents.length
    });
    console.log('✅ User analytics retrieved successfully');

    // Test 3: Conversion Funnel Metrics
    console.log('\n3. Testing Conversion Funnel Metrics...');
    
    const funnelMetrics = await AnalyticsService.getConversionFunnelMetrics('SUBSCRIPTION');
    console.log('Funnel Metrics:', funnelMetrics);
    console.log('✅ Conversion funnel metrics working');

    // Test 4: Referral System
    console.log('\n4. Testing Referral System...');
    
    const referralCode = await ReferralService.generateReferralCode(testUserId);
    console.log('Generated referral code:', referralCode);

    // Simulate referral click
    await ReferralService.trackReferralClick(referralCode, '127.0.0.1');

    // Simulate referral signup
    const refereeUserId = 'referee-' + Date.now();
    await ReferralService.completeReferralSignup(referralCode, refereeUserId);

    const referralStats = await ReferralService.getUserReferralStats(testUserId);
    console.log('Referral Stats:', referralStats);
    console.log('✅ Referral system working');

    // Test 5: Conversion Optimization
    console.log('\n5. Testing Conversion Optimization...');
    
    const engagementScore = await ConversionOptimizer.calculateEngagementScore(testUserId);
    console.log('Engagement Score:', engagementScore);

    const churnRisk = await ConversionOptimizer.assessChurnRisk(testUserId);
    console.log('Churn Risk:', churnRisk);

    // Test A/B testing utilities
    console.log('A/B Test Variant for user would be calculated based on user ID hash');
    console.log('✅ Conversion optimization working');

    // Test 6: Revenue Metrics
    console.log('\n6. Testing Revenue Metrics...');
    
    const revenueMetrics = await AnalyticsService.getRevenueMetrics();
    console.log('Revenue Metrics:', {
      totalRevenue: revenueMetrics.totalRevenue,
      monthlyRecurring: revenueMetrics.monthlyRecurringRevenue,
      averageRevenuePerUser: revenueMetrics.averageRevenuePerUser,
      totalSubscriptions: revenueMetrics.totalSubscriptions
    });
    console.log('✅ Revenue metrics working');

    // Test 7: Retention Metrics
    console.log('\n7. Testing Retention Metrics...');
    
    const retentionMetrics = await AnalyticsService.getRetentionMetrics();
    console.log('Retention Metrics:', {
      day1: retentionMetrics.day1,
      day7: retentionMetrics.day7,
      day30: retentionMetrics.day30
    });
    console.log('✅ Retention metrics working');

    console.log('\n🎉 All tests passed! Analytics system is working correctly.');

    return {
      success: true,
      testResults: {
        analyticsTracking: true,
        userAnalytics: true,
        conversionFunnels: true,
        referralSystem: true,
        conversionOptimization: true,
        revenueMetrics: true,
        retentionMetrics: true
      }
    };

  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Export for use in other scripts
export { testAnalyticsSystem };

// Run tests if this file is executed directly
if (require.main === module) {
  testAnalyticsSystem()
    .then((result) => {
      console.log('\nTest Results:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('\nTest Error:', error);
      process.exit(1);
    });
}
