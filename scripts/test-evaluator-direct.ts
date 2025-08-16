import { BadgeEvaluator } from '../lib/badges/badge-evaluator.js';

async function testBadgeEvaluatorDirectly() {
  console.log('🔍 Testing badge evaluator directly...');

  try {
    const badgeEvaluator = new BadgeEvaluator();
    
    // Test with our user directly
    const userId = 'GijPWH5DAaIf97aGNZGLF'; // premium@test.com user ID
    
    console.log('1. Testing badge evaluation directly...');
    const result = await badgeEvaluator.handleEvent(
      userId,
      'check_in_completed',
      {
        timestamp: new Date().toISOString(),
        streakCount: 14,
        shieldUsed: false
      }
    );
    
    console.log('Direct badge evaluator result:', result);
    
    if (result && result.length > 0) {
      console.log('🎉 Success! Badges awarded:', result);
    } else {
      console.log('📝 No badges awarded by evaluator');
    }
    
  } catch (error: any) {
    console.error('💥 Direct test failed:', error);
    console.error('Error details:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

testBadgeEvaluatorDirectly().then(() => {
  console.log('\n🎉 Direct test complete!');
  process.exit(0);
}).catch(console.error);
