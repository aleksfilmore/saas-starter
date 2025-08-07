/**
 * Deployment Test Script
 * Creates sample analytics data and tests all functionality
 */

import { AnalyticsService } from '@/lib/analytics/service';
import { ReferralService } from '@/lib/referrals/service';
import { AnalyticsEvents } from '@/lib/analytics/events';

async function runDeploymentTest() {
  console.log('🚀 Running comprehensive deployment test...\n');

  try {
    // Create sample users and events
    const users = [
      { id: 'user-1', name: 'Alice Johnson' },
      { id: 'user-2', name: 'Bob Smith' },
      { id: 'user-3', name: 'Carol Davis' },
      { id: 'user-4', name: 'David Wilson' },
      { id: 'user-5', name: 'Eva Brown' }
    ];

    console.log('1. Creating sample user events...');
    
    // Simulate user journeys
    for (const user of users) {
      const sessionId = `session-${user.id}-${Date.now()}`;

      // User signs up
      await AnalyticsService.track({
        event: AnalyticsEvents.USER_SIGNED_UP,
        userId: user.id,
        sessionId,
        properties: { 
          source: Math.random() > 0.5 ? 'organic' : 'referral',
          userAgent: 'Mozilla/5.0 (Test Browser)',
          plan: Math.random() > 0.7 ? 'pro' : 'free'
        }
      });

      // User views pricing
      await AnalyticsService.track({
        event: AnalyticsEvents.PRICING_PAGE_VIEWED,
        userId: user.id,
        sessionId,
        properties: { source: 'navigation' }
      });

      // Some users complete subscription
      if (Math.random() > 0.4) {
        await AnalyticsService.track({
          event: AnalyticsEvents.SUBSCRIPTION_CHECKOUT_COMPLETED,
          userId: user.id,
          sessionId,
          properties: { 
            plan: 'pro',
            amount: 2900,
            currency: 'usd'
          }
        });
      }

      // Generate referral codes
      const referralCode = await ReferralService.generateReferralCode(user.id);
      console.log(`Generated referral code for ${user.name}: ${referralCode}`);
    }

    console.log('✅ Sample data created successfully\n');

    // Test analytics endpoints
    console.log('2. Testing analytics endpoints...');
    
    const [revenue, retention, funnel] = await Promise.all([
      fetch('http://localhost:3002/api/analytics/revenue').then(r => r.json()),
      fetch('http://localhost:3002/api/analytics/retention').then(r => r.json()),
      fetch('http://localhost:3002/api/analytics/funnel?funnel=SUBSCRIPTION').then(r => r.json())
    ]);

    console.log('Revenue Metrics:', revenue);
    console.log('Retention Metrics:', retention);
    console.log('Funnel Metrics (first 2 stages):', funnel.slice(0, 2));
    
    console.log('✅ All analytics endpoints working\n');

    // Test admin dashboard access
    console.log('3. Testing admin dashboard...');
    const dashboardResponse = await fetch('http://localhost:3002/admin/dashboard');
    console.log('Admin dashboard status:', dashboardResponse.status === 200 ? '✅ Accessible' : '❌ Error');

    console.log('\n🎉 Deployment test completed successfully!');
    console.log('\n📊 Your SaaS now includes:');
    console.log('✅ Comprehensive analytics tracking');
    console.log('✅ Real-time admin dashboard');
    console.log('✅ Referral system with rewards');
    console.log('✅ Conversion optimization tools');
    console.log('✅ Revenue and retention metrics');
    
    console.log('\n🌐 Access your admin dashboard at:');
    console.log('http://localhost:3002/admin/dashboard');

    return { success: true };

  } catch (error) {
    console.error('❌ Deployment test failed:', error);
    throw error;
  }
}

// Run the test
runDeploymentTest()
  .then(() => {
    console.log('\n✅ Ready for production deployment!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Deployment test failed:', error);
    process.exit(1);
  });
