import { BadgeEvaluator } from '../lib/badges/badge-evaluator.js';

async function testNextBadge() {
  console.log('🎯 Testing next badge earning (F4_DF - 30 day streak)...');

  try {
    const badgeEvaluator = new BadgeEvaluator();
    const userId = 'GijPWH5DAaIf97aGNZGLF'; // premium@test.com user ID
    
    console.log('Testing 30-day streak (should unlock F4_DF)...');
    const result = await badgeEvaluator.handleEvent(
      userId,
      'check_in_completed',
      {
        timestamp: new Date().toISOString(),
        streakCount: 30, // Should unlock F4_DF for DF archetype
        shieldUsed: false
      }
    );
    
    console.log('Badge evaluator result:', result);
    
    if (result && result.length > 0) {
      console.log('🎉 Success! New badges awarded:', result);
    } else {
      console.log('📝 No new badges awarded');
    }
    
  } catch (error: any) {
    console.error('💥 Test failed:', error.message);
  }
}

testNextBadge().then(() => {
  console.log('\n🎉 Next badge test complete!');
  process.exit(0);
}).catch(console.error);
