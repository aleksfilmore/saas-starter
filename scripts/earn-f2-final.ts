import { BadgeEvaluator } from '../lib/badges/badge-evaluator.js';
import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';

async function earnF2Final() {
  console.log('🎯 Adding final ritual to earn F2_DF badge...');
  
  const userId = 'GijPWH5DAaIf97aGNZGLF';
  const badgeEvaluator = new BadgeEvaluator();
  
  // Add the 25th qualifying ritual
  console.log('Adding ritual with proper journaling (25th ritual)...');
  const result = await badgeEvaluator.handleEvent(
    userId,
    'ritual_completed',
    {
      ritualId: 'ritual_25_f2_unlock',
      journalWordCount: 100, // Well above minimum of 20
      timeSpent: 900,
      category: 'milestone'
    }
  );
  
  console.log('🎉 BADGE RESULT:', result);
  
  if (result.length > 0) {
    console.log('🚀 NEW BADGE EARNED:', result);
    
    // Get the badge details
    const newBadge = await db.execute(sql`
      SELECT b.name, b.description, b.discount_percent
      FROM badges b
      WHERE b.id = ${result[0]}
    `);
    
    if (newBadge.length > 0) {
      console.log(`Badge: ${newBadge[0].name}`);
      console.log(`Description: ${newBadge[0].description}`);
      console.log(`Discount: ${newBadge[0].discount_percent}%`);
    }
  }
  
  // Final summary
  const allBadges = await db.execute(sql`
    SELECT ub.badge_id, b.name
    FROM user_badges ub
    JOIN badges b ON ub.badge_id = b.id
    WHERE ub.user_id = ${userId}
    ORDER BY ub.earned_at DESC
  `);
  
  console.log(`\n🏆 FINAL BADGE COLLECTION (${allBadges.length}/8 available):`);
  allBadges.forEach(badge => {
    console.log(`  ✅ ${badge.badge_id}: ${badge.name}`);
  });
  
  const progress = Math.round((allBadges.length / 8) * 100);
  console.log(`\n📊 Badge completion: ${progress}%`);
}

earnF2Final().then(() => {
  console.log('\n🎉 F2 final test complete!');
  process.exit(0);
}).catch(console.error);
