import { db } from './lib/db/index.js';
import { sql } from 'drizzle-orm';
import { BadgeEvaluator } from './lib/badges/badge-evaluator.js';

async function testG1BadgeEarning() {
  console.log('🎯 Testing G1 (Streak Spark) badge earning with 7-day streak...');

  try {
    const userId = 'GijPWH5DAaIf97aGNZGLF';
    const badgeEvaluator = new BadgeEvaluator();
    
    // Check current badge status
    console.log('1. Checking current badges...');
    const currentBadges = await db.execute(sql`
      SELECT badge_id, earned_at 
      FROM user_badges 
      WHERE user_id = ${userId}
      ORDER BY earned_at
    `);
    
    console.log('Current badges:', currentBadges.map(b => b.badge_id));
    
    // Check if G1 already earned
    const hasG1 = currentBadges.some(b => b.badge_id === 'G1');
    console.log('Has G1 badge:', hasG1);
    
    if (!hasG1) {
      // Simulate a 7-day streak check-in
      console.log('2. Simulating 7-day streak check-in...');
      
      const result = await badgeEvaluator.handleEvent(
        userId,
        'check_in_completed',
        {
          timestamp: new Date().toISOString(),
          streakCount: 7,
          shieldUsed: false
        }
      );
      
      console.log('Badge evaluation result:', result);
      
      // Check if G1 was earned
      const updatedBadges = await db.execute(sql`
        SELECT badge_id, earned_at 
        FROM user_badges 
        WHERE user_id = ${userId} AND badge_id = 'G1'
      `);
      
      if (updatedBadges.length > 0) {
        console.log('🎉 G1 badge successfully earned!');
        console.log('Earned at:', updatedBadges[0].earned_at);
      } else {
        console.log('❌ G1 badge not earned');
      }
    } else {
      console.log('✅ G1 badge already earned');
    }

    // Check all Ghost badges earned by user
    console.log('\n3. All Ghost badges earned by user:');
    const ghostBadges = await db.execute(sql`
      SELECT ub.badge_id, b.name, ub.earned_at
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = ${userId} AND b.tier_scope = 'ghost'
      ORDER BY ub.earned_at
    `);
    
    ghostBadges.forEach(badge => {
      console.log(`${badge.badge_id}: ${badge.name} (earned ${badge.earned_at})`);
    });

  } catch (error) {
    console.error('💥 Error testing G1 badge:', error);
  } finally {
    process.exit(0);
  }
}

testG1BadgeEarning();
