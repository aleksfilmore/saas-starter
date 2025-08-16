import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';

// Simple badge system that works with existing database
class SimpleBadgeEvaluator {
  async awardBadgeForStreak(userId: string, streakCount: number) {
    console.log(`🎯 Checking badges for user ${userId} with ${streakCount} day streak...`);
    
    try {
      // Get user details
      const users = await db.execute(sql`
        SELECT id, email, tier, archetype 
        FROM users 
        WHERE id = ${userId}
      `);
      
      if (users.length === 0) {
        console.log('❌ User not found');
        return [];
      }
      
      const user = users[0];
      console.log(`User: ${user.email}, tier: ${user.tier}, archetype: ${user.archetype}`);
      
      // Check what badges they should get
      let badgeToAward = null;
      
      if (user.tier === 'firewall' && user.archetype === 'DF' && streakCount >= 14) {
        badgeToAward = 'F1_DF';
        console.log('✅ User qualifies for F1_DF badge (14+ day streak)');
      } else if (streakCount >= 7) {
        // Check if there's a general 7-day streak badge
        const g1Badge = await db.execute(sql`SELECT id FROM badges WHERE id = 'G1'`);
        if (g1Badge.length > 0) {
          badgeToAward = 'G1';
          console.log('✅ User qualifies for G1 badge (7+ day streak)');
        }
      }
      
      if (!badgeToAward) {
        console.log('📝 No badges qualify for current streak');
        return [];
      }
      
      // Check if user already has this badge
      const existingBadge = await db.execute(sql`
        SELECT id FROM user_badges 
        WHERE user_id = ${userId} AND badge_id = ${badgeToAward}
      `);
      
      if (existingBadge.length > 0) {
        console.log(`📝 User already has ${badgeToAward} badge`);
        return [];
      }
      
      // Award the badge
      console.log(`🎉 Awarding ${badgeToAward} badge to user...`);
      
      const badgeId = 'ub_' + Math.random().toString(36).substr(2, 9);
      
      await db.execute(sql`
        INSERT INTO user_badges (id, user_id, badge_id, earned_at)
        VALUES (${badgeId}, ${userId}, ${badgeToAward}, ${new Date().toISOString()})
      `);
      
      console.log(`✅ Successfully awarded ${badgeToAward} badge!`);
      
      return [badgeToAward];
      
    } catch (error) {
      console.error('💥 Error awarding badge:', error);
      return [];
    }
  }
}

async function testSimpleBadgeSystem() {
  console.log('🚀 Testing simple badge system...');
  
  const evaluator = new SimpleBadgeEvaluator();
  
  // Test with our user
  const userId = 'GijPWH5DAaIf97aGNZGLF'; // premium@test.com
  
  // Test 14-day streak (should get F1_DF)
  const badgesAwarded = await evaluator.awardBadgeForStreak(userId, 14);
  
  if (badgesAwarded.length > 0) {
    console.log('🎉 SUCCESS! Badges awarded:', badgesAwarded);
    
    // Verify badge was saved
    const userBadges = await db.execute(sql`
      SELECT ub.*, b.name as badge_name
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = ${userId}
      ORDER BY ub.earned_at DESC
    `);
    
    console.log(`User now has ${userBadges.length} badges:`, 
      userBadges.map(b => `${b.badge_id}: ${b.badge_name}`));
      
  } else {
    console.log('📝 No badges were awarded');
  }
}

testSimpleBadgeSystem().then(() => {
  console.log('\n🎉 Simple badge test complete!');
  process.exit(0);
}).catch(console.error);
