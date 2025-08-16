import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';

async function testFullBadgeFlow() {
  console.log('🎯 Testing full badge flow through API...');

  try {
    // 1. Get current badge count
    const userId = 'GijPWH5DAaIf97aGNZGLF';
    
    const beforeBadges = await db.execute(sql`
      SELECT COUNT(*) as count FROM user_badges WHERE user_id = ${userId}
    `);
    console.log(`User currently has ${beforeBadges[0].count} badges`);

    // 2. Test completing a ritual (should trigger badge check)
    console.log('2. Testing ritual completion API...');
    
    const ritualResponse = await fetch('http://localhost:3001/api/badges/check-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        eventType: 'ritual_completed',
        payload: {
          ritualId: 'morning_meditation',
          journalWordCount: 200,
          timeSpent: 600,
          category: 'mindfulness'
        }
      })
    });

    if (ritualResponse.ok) {
      const result = await ritualResponse.json();
      console.log('✅ Ritual badge check result:', result);
    } else {
      console.log('❌ Ritual badge check failed:', await ritualResponse.text());
    }

    // 3. Check if badge count increased
    const afterBadges = await db.execute(sql`
      SELECT COUNT(*) as count FROM user_badges WHERE user_id = ${userId}
    `);
    console.log(`User now has ${afterBadges[0].count} badges`);

    if (afterBadges[0].count > beforeBadges[0].count) {
      console.log('🎉 NEW BADGE EARNED through API!');
      
      // Show all user badges
      const allBadges = await db.execute(sql`
        SELECT ub.badge_id, b.name, ub.earned_at
        FROM user_badges ub
        JOIN badges b ON ub.badge_id = b.id
        WHERE ub.user_id = ${userId}
        ORDER BY ub.earned_at DESC
      `);
      
      console.log('User badges:');
      allBadges.forEach(badge => {
        console.log(`  - ${badge.badge_id}: ${badge.name} (earned: ${badge.earned_at})`);
      });
    }

    // 4. Test badge collection API
    console.log('\n4. Testing badge collection API...');
    
    const collectionResponse = await fetch('http://localhost:3001/api/badges/locker', {
      method: 'GET',
      headers: {
        'x-user-id': userId
      }
    });

    if (collectionResponse.ok) {
      const collection = await collectionResponse.json();
      console.log('✅ Badge collection API result:', JSON.stringify(collection, null, 2));
    } else {
      console.log('❌ Badge collection API failed:', await collectionResponse.text());
    }

  } catch (error) {
    console.error('💥 Full flow test failed:', error);
  }
}

testFullBadgeFlow().then(() => {
  console.log('\n🎉 Full badge flow test complete!');
  process.exit(0);
}).catch(console.error);
