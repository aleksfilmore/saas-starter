import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';

async function debugBadgeSystem() {
  console.log('🔍 Debugging badge system...');

  try {
    // 1. Check what badges exist
    console.log('1. Checking available badges...');
    const allBadges = await db.execute(sql`
      SELECT id, name, tier_scope, archetype_scope 
      FROM badges 
      ORDER BY id
    `);
    console.log(`Found ${allBadges.length} badges in database:`);
    allBadges.forEach(badge => {
      console.log(`  - ${badge.id}: ${badge.name} (${badge.tier_scope}/${badge.archetype_scope || 'any'})`);
    });

    // 2. Check user details
    console.log('\n2. User details...');
    const users = await db.execute(sql`
      SELECT id, email, tier, archetype 
      FROM users 
      WHERE email = 'premium@test.com'
    `);
    const user = users[0];
    console.log(`User: ${user.email}, tier: ${user.tier}, archetype: ${user.archetype}`);

    // 3. Check what badges this user should be eligible for
    console.log('\n3. Badges eligible for this user...');
    const eligibleBadges = await db.execute(sql`
      SELECT id, name, tier_scope, archetype_scope
      FROM badges 
      WHERE (tier_scope = 'both' OR tier_scope = ${user.tier})
      AND (archetype_scope IS NULL OR archetype_scope = ${user.archetype})
    `);
    console.log(`User is eligible for ${eligibleBadges.length} badges:`);
    eligibleBadges.forEach(badge => {
      console.log(`  - ${badge.id}: ${badge.name}`);
    });

    // 4. Check user's event history
    console.log('\n4. User event history...');
    const recentEvents = await db.execute(sql`
      SELECT event_type, payload_json, created_at
      FROM badge_events 
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
      LIMIT 5
    `);
    console.log(`User has ${recentEvents.length} recent events:`);
    recentEvents.forEach(event => {
      console.log(`  - ${event.event_type} at ${event.created_at}`);
      console.log(`    Payload:`, event.payload_json);
    });

    // 5. Manually test one badge condition
    console.log('\n5. Testing G1 badge condition (7 day streak)...');
    
    // Look for a streak badge (G1) - should unlock at 7 consecutive check-ins
    const g1Badge = await db.execute(sql`
      SELECT * FROM badges WHERE id = 'G1'
    `);
    
    if (g1Badge.length > 0) {
      console.log(`G1 badge exists: ${g1Badge[0].name}`);
      
      // Check if user has enough consecutive check-ins
      const checkInCount = await db.execute(sql`
        SELECT COUNT(*) as count 
        FROM badge_events 
        WHERE user_id = ${user.id} 
        AND event_type = 'check_in_completed'
      `);
      
      console.log(`User has ${checkInCount[0].count} total check-ins`);
      
      // Check if user already has this badge
      const hasG1 = await db.execute(sql`
        SELECT * FROM user_badges 
        WHERE user_id = ${user.id} AND badge_id = 'G1'
      `);
      
      console.log(`User already has G1 badge: ${hasG1.length > 0}`);
      
    } else {
      console.log('❌ G1 badge not found in database');
    }

  } catch (error) {
    console.error('💥 Debug failed:', error);
  }
}

debugBadgeSystem().then(() => {
  console.log('\n🎉 Debug complete!');
  process.exit(0);
}).catch(console.error);
