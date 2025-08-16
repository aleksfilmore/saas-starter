import { BadgeEvaluator } from '../lib/badges/badge-evaluator.js';
import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';

async function earnF2Badge() {
  console.log('🎯 Earning F2_DF badge (need 25 rituals)...');
  
  const userId = 'GijPWH5DAaIf97aGNZGLF';
  const badgeEvaluator = new BadgeEvaluator();
  
  // Add 2 more rituals to reach 25
  for (let i = 0; i < 2; i++) {
    console.log(`Adding ritual ${i + 1}/2...`);
    const result = await badgeEvaluator.handleEvent(
      userId,
      'ritual_completed',
      {
        ritualId: `final_ritual_${i}`,
        journalWordCount: 300,
        timeSpent: 600,
        category: 'breakthrough'
      }
    );
    
    if (result.length > 0) {
      console.log(`🎉 Badge earned: ${result}`);
    }
  }
  
  // Check final count and badges
  const ritualCount = await db.execute(sql`
    SELECT COUNT(*) as count 
    FROM badge_events 
    WHERE user_id = ${userId} AND event_type = 'ritual_completed'
  `);
  
  const allBadges = await db.execute(sql`
    SELECT ub.badge_id, b.name
    FROM user_badges ub
    JOIN badges b ON ub.badge_id = b.id
    WHERE ub.user_id = ${userId}
    ORDER BY ub.earned_at DESC
  `);
  
  console.log(`\nFinal stats:`);
  console.log(`- Total rituals: ${ritualCount[0].count}`);
  console.log(`- Total badges: ${allBadges.length}`);
  console.log(`Badges earned:`);
  allBadges.forEach(badge => {
    console.log(`  ✅ ${badge.badge_id}: ${badge.name}`);
  });
}

earnF2Badge().then(() => {
  console.log('\n🎉 F2 badge test complete!');
  process.exit(0);
}).catch(console.error);
