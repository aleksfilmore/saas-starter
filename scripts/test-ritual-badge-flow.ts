import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';

async function testRitualBadgeFlow() {
  console.log('🎯 Testing ritual completion → badge earning flow...');

  try {
    // 1. Find a test user
    console.log('1. Finding test user...');
    const users = await db.execute(sql`SELECT id, email, tier, archetype FROM users LIMIT 1`);
    if (users.length === 0) {
      console.log('❌ No users found');
      return;
    }
    
    const user = users[0];
    console.log(`✅ Found user: ${user.email} (tier: ${user.tier || 'none'}, archetype: ${user.archetype || 'none'})`);

    // 2. Complete a ritual through the actual API
    console.log('\n2. Completing a ritual...');
    
    const ritualResponse = await fetch('http://localhost:3001/api/rituals/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        ritualType: 'daily_reflection',
        responses: {
          'mood': 'good',
          'reflection': 'I feel stronger today and more in control of my emotions.'
        }
      })
    });

    console.log(`Ritual API Response: ${ritualResponse.status} ${ritualResponse.statusText}`);
    
    if (ritualResponse.ok) {
      const result = await ritualResponse.json();
      console.log('✅ Ritual completion successful:', result);
    } else {
      const error = await ritualResponse.text();
      console.log('❌ Ritual completion failed:', error);
    }

    // 3. Check if any badge events were created
    console.log('\n3. Checking badge events...');
    
    const events = await db.execute(sql`
      SELECT * FROM badge_events 
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    console.log(`Found ${events.length} badge events:`, events);

    // 4. Check user's badges
    console.log('\n4. Checking user badges...');
    
    const userBadges = await db.execute(sql`
      SELECT ub.*, b.name as badge_name, b.description 
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = ${user.id}
      ORDER BY ub.earned_at DESC
    `);
    
    console.log(`User has ${userBadges.length} badges:`, userBadges);

    // 5. Check total ritual completions for this user
    console.log('\n5. Checking ritual history...');
    
    const ritualCount = await db.execute(sql`
      SELECT COUNT(*) as count FROM badge_events 
      WHERE user_id = ${user.id} AND event_type = 'ritual_completed'
    `);
    
    console.log(`Total rituals completed: ${ritualCount[0]?.count || 0}`);

  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

testRitualBadgeFlow().then(() => {
  console.log('\n🎉 Test complete!');
  process.exit(0);
}).catch(console.error);
