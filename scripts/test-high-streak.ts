import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';

async function testHighStreakBadge() {
  console.log('🎯 Testing badge earning with 14+ day streak...');

  try {
    const users = await db.execute(sql`SELECT id FROM users WHERE email = 'premium@test.com'`);
    const userId = users[0].id;

    console.log('Testing 14-day streak (should unlock F1_DF)...');
    
    const response = await fetch('http://localhost:3001/api/badges/check-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        eventType: 'check_in_completed',
        payload: {
          timestamp: new Date().toISOString(),
          streakCount: 14, // Should unlock F1_DF for DF archetype
          shieldUsed: false
        }
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Badge check result:', result);
      
      if (result.badgesAwarded && result.badgesAwarded.length > 0) {
        console.log('🎉 BADGES EARNED:', result.badgesAwarded);
        
        // Check user badges now
        const userBadges = await db.execute(sql`
          SELECT ub.*, b.name as badge_name
          FROM user_badges ub
          JOIN badges b ON ub.badge_id = b.id
          WHERE ub.user_id = ${userId}
        `);
        
        console.log(`User now has ${userBadges.length} badges:`, 
          userBadges.map(b => `${b.badge_id}: ${b.badge_name}`));
        
      } else {
        console.log('📝 No badges earned - checking why...');
        
        // Debug: Check if F1_DF exists
        const f1Badge = await db.execute(sql`SELECT * FROM badges WHERE id = 'F1_DF'`);
        console.log(`F1_DF badge exists: ${f1Badge.length > 0}`);
        
        if (f1Badge.length > 0) {
          console.log(`F1_DF badge details:`, f1Badge[0]);
        }
      }
    } else {
      console.log('❌ Badge check failed:', await response.text());
    }

  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

testHighStreakBadge().then(() => {
  console.log('\n🎉 High streak test complete!');
  process.exit(0);
}).catch(console.error);
