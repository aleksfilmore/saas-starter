import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';
import { BadgeEvaluator } from '../lib/badges/badge-evaluator.js';

async function testRitualBadges() {
  console.log('🎯 Testing ritual-based badge earning...');

  try {
    const userId = 'GijPWH5DAaIf97aGNZGLF';
    
    // Check current badges
    console.log('1. Current badges:');
    const userBadges = await db.execute(sql`
      SELECT ub.badge_id, b.name 
      FROM user_badges ub 
      JOIN badges b ON ub.badge_id = b.id 
      WHERE ub.user_id = ${userId}
    `);
    userBadges.forEach(badge => {
      console.log(`  - ${badge.badge_id}: ${badge.name}`);
    });

    // Check ritual completion count
    console.log('\n2. Ritual completion count:');
    const ritualCount = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM badge_events 
      WHERE user_id = ${userId} AND event_type = 'ritual_completed'
    `);
    console.log(`User has completed ${ritualCount[0].count} rituals`);

    // Test ritual completion badge (F2 requires 20 rituals)
    console.log('\n3. Testing ritual badge earning...');
    const badgeEvaluator = new BadgeEvaluator();
    
    const result = await badgeEvaluator.handleEvent(
      userId,
      'ritual_completed',
      {
        ritualId: 'morning_meditation',
        journalWordCount: 250,
        timeSpent: 900,
        category: 'mindfulness'
      }
    );
    
    console.log('Ritual badge result:', result);
    
    if (result && result.length > 0) {
      console.log('🎉 New badges from ritual:', result);
    } else {
      console.log('📝 No badges from ritual completion');
    }

    // Show what badges are available for this user
    console.log('\n4. Available badges for this user:');
    const availableBadges = await db.execute(sql`
      SELECT id, name, tier_scope, archetype_scope
      FROM badges 
      WHERE (tier_scope = 'both' OR tier_scope = 'firewall')
      AND (archetype_scope IS NULL OR archetype_scope = 'DF')
    `);
    availableBadges.forEach(badge => {
      const hasIt = userBadges.some(ub => ub.badge_id === badge.id);
      console.log(`  ${hasIt ? '✅' : '⭕'} ${badge.id}: ${badge.name}`);
    });

  } catch (error: any) {
    console.error('💥 Test failed:', error.message);
  }
}

testRitualBadges().then(() => {
  console.log('\n🎉 Ritual badge test complete!');
  process.exit(0);
}).catch(console.error);
