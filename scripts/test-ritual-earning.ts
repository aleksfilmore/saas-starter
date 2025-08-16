import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';
import { BadgeEvaluator } from '../lib/badges/badge-evaluator.js';

async function testRitualBadgeEarning() {
  console.log('🎯 Testing F2_DF badge earning with more rituals...');

  try {
    const userId = 'GijPWH5DAaIf97aGNZGLF';
    const badgeEvaluator = new BadgeEvaluator();
    
    // Add more ritual completion events to trigger F2 badge (need 20+ rituals)
    console.log('1. Adding more ritual completions...');
    
    for (let i = 0; i < 15; i++) {
      await badgeEvaluator.handleEvent(
        userId,
        'ritual_completed',
        {
          ritualId: `test_ritual_${i}`,
          journalWordCount: 200 + (i * 10),
          timeSpent: 300 + (i * 60),
          category: 'mindfulness'
        }
      );
    }
    
    // Check ritual count now
    const ritualCount = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM badge_events 
      WHERE user_id = ${userId} AND event_type = 'ritual_completed'
    `);
    console.log(`User now has ${ritualCount[0].count} total ritual completions`);
    
    // Check if F2_DF was earned
    const f2Badge = await db.execute(sql`
      SELECT * FROM user_badges 
      WHERE user_id = ${userId} AND badge_id = 'F2_DF'
    `);
    
    if (f2Badge.length > 0) {
      console.log('🎉 F2_DF badge earned!');
    } else {
      console.log('📝 F2_DF not earned yet');
    }
    
    // Check all current badges
    console.log('\n2. Current badge collection:');
    const allBadges = await db.execute(sql`
      SELECT ub.badge_id, b.name, ub.earned_at
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = ${userId}
      ORDER BY ub.earned_at DESC
    `);
    
    allBadges.forEach(badge => {
      console.log(`  ✅ ${badge.badge_id}: ${badge.name}`);
    });
    
    console.log(`\nTotal badges: ${allBadges.length}/8 available`);

  } catch (error: any) {
    console.error('💥 Test failed:', error.message);
  }
}

testRitualBadgeEarning().then(() => {
  console.log('\n🎉 Ritual badge earning test complete!');
  process.exit(0);
}).catch(console.error);
