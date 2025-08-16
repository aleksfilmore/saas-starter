import { BadgeEvaluator } from '../lib/badges/badge-evaluator.js';
import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';

async function testF2BadgeFixed() {
  console.log('🎯 Testing F2_DF badge with fixed ritual counting...');
  
  const userId = 'GijPWH5DAaIf97aGNZGLF';
  const badgeEvaluator = new BadgeEvaluator();
  
  // Test ritual completion to trigger badge evaluation
  console.log('1. Testing ritual completion...');
  const result = await badgeEvaluator.handleEvent(
    userId,
    'ritual_completed',
    {
      ritualId: 'test_f2_trigger',
      journalWordCount: 50, // Above minimum of 20
      timeSpent: 600,
      category: 'test'
    }
  );
  
  console.log('Badge evaluation result:', result);
  
  if (result.length > 0) {
    console.log('🎉 NEW BADGE EARNED:', result);
  }
  
  // Check final badge collection
  const allBadges = await db.execute(sql`
    SELECT ub.badge_id, b.name, ub.earned_at
    FROM user_badges ub
    JOIN badges b ON ub.badge_id = b.id
    WHERE ub.user_id = ${userId}
    ORDER BY ub.earned_at DESC
  `);
  
  console.log(`\nFinal badge collection (${allBadges.length} badges):`);
  allBadges.forEach(badge => {
    console.log(`  ✅ ${badge.badge_id}: ${badge.name}`);
  });
  
  // Check ritual count
  const ritualCount = await db.execute(sql`
    SELECT COUNT(*) as count 
    FROM badge_events 
    WHERE user_id = ${userId} 
    AND event_type = 'ritual_completed'
    AND (payload_json->>'journalWordCount')::int >= 20
  `);
  
  console.log(`\nQualifying rituals: ${ritualCount[0].count} (need 25 for F2_DF)`);
}

testF2BadgeFixed().then(() => {
  console.log('\n🎉 F2 badge test complete!');
  process.exit(0);
}).catch(console.error);
