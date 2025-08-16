import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';

async function setupUserForBadges() {
  console.log('🔧 Setting up user to earn badges...');

  try {
    // 1. Update test user to have an archetype
    console.log('1. Giving test user an archetype...');
    await db.execute(sql`
      UPDATE users 
      SET archetype = 'DF', tier = 'firewall' 
      WHERE email = 'premium@test.com'
    `);
    console.log('✅ User updated to: tier=firewall, archetype=DF');

    // 2. Test badge check-in with archetype user
    console.log('\n2. Testing badge earning with archetype...');
    
    const users = await db.execute(sql`SELECT id FROM users WHERE email = 'premium@test.com'`);
    const userId = users[0].id;

    const response = await fetch('http://localhost:3001/api/badges/check-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        eventType: 'ritual_completed',
        payload: {
          ritualType: 'daily_reflection',
          completedAt: new Date().toISOString(),
          streakCount: 10 // Higher streak to trigger badges
        }
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Badge check result:', result);
      
      if (result.badgesAwarded && result.badgesAwarded.length > 0) {
        console.log('🎉 BADGES EARNED:', result.badgesAwarded);
      } else {
        console.log('📝 No badges earned this time (expected for ritual completions)');
      }
    } else {
      console.log('❌ Badge check failed:', await response.text());
    }

    // 3. Test with a check-in event (more likely to trigger streak badges)
    console.log('\n3. Testing with check-in event...');
    
    const checkinResponse = await fetch('http://localhost:3001/api/badges/check-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        eventType: 'check_in_completed',
        payload: {
          timestamp: new Date().toISOString(),
          streakCount: 7, // 7 days should unlock G1 badge
          shieldUsed: false
        }
      })
    });

    if (checkinResponse.ok) {
      const checkinResult = await checkinResponse.json();
      console.log('✅ Check-in badge result:', checkinResult);
      
      if (checkinResult.badgesAwarded && checkinResult.badgesAwarded.length > 0) {
        console.log('🎉 BADGES EARNED FROM CHECK-IN:', checkinResult.badgesAwarded);
      } else {
        console.log('📝 No badges earned from check-in');
      }
    } else {
      console.log('❌ Check-in badge check failed:', await checkinResponse.text());
    }

    // 4. Check what badges user has now
    console.log('\n4. Checking user badges...');
    const userBadges = await db.execute(sql`
      SELECT ub.*, b.name as badge_name
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = ${userId}
    `);
    
    console.log(`User now has ${userBadges.length} badges:`, userBadges.map(b => b.badge_name));

  } catch (error) {
    console.error('💥 Setup failed:', error);
  }
}

setupUserForBadges().then(() => {
  console.log('\n🎉 Badge setup test complete!');
  process.exit(0);
}).catch(console.error);
