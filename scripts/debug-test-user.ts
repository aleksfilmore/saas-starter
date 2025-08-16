#!/usr/bin/env tsx

import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';

async function debugTestUser() {
  console.log('🔍 Debugging test user for badge system...');
  
  const testUserId = 'GijPWH5DAaIf97aGNZGLF';
  
  try {
    // Get full user details
    const user = await db.execute(sql`
      SELECT id, email, tier, archetype, profile_badge_id, email_opt_in, timezone
      FROM users 
      WHERE id = ${testUserId}
    `);
    
    console.log('\n👤 Test user details:');
    if (user.length > 0) {
      console.log(JSON.stringify(user[0], null, 2));
    } else {
      console.log('❌ Test user not found');
      return;
    }
    
    // Check available badges for this user's tier/archetype
    const userInfo = user[0];
    console.log(`\n🎯 Checking available badges for tier: ${userInfo.tier}, archetype: ${userInfo.archetype}`);
    
    const availableBadges = await db.execute(sql`
      SELECT id, name, tier_scope, archetype_scope, is_active
      FROM badges 
      WHERE is_active = true
        AND (tier_scope = ${userInfo.tier} OR tier_scope = 'both')
        AND (archetype_scope IS NULL OR archetype_scope = ${userInfo.archetype})
      ORDER BY id
    `);
    
    console.log(`\n📋 Available badges (${availableBadges.length}):`);
    availableBadges.forEach(badge => {
      console.log(`  - ${badge.id}: ${badge.name} (tier: ${badge.tier_scope}, archetype: ${badge.archetype_scope || 'all'})`);
    });
    
    // Check user's current badges
    const userBadges = await db.execute(sql`
      SELECT ub.badge_id, ub.earned_at, ub.source_event, b.name
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = ${testUserId}
      ORDER BY ub.earned_at
    `);
    
    console.log(`\n🏆 Current badges (${userBadges.length}):`);
    if (userBadges.length > 0) {
      userBadges.forEach(badge => {
        console.log(`  - ${badge.badge_id}: ${badge.name} (earned via ${badge.source_event})`);
      });
    } else {
      console.log('  📭 No badges earned yet');
    }
    
    // Test badge evaluation conditions
    console.log('\n🧪 Testing badge unlock conditions...');
    
    // Check badge events for this user
    const badgeEvents = await db.execute(sql`
      SELECT event_type, payload_json, created_at
      FROM badge_events
      WHERE user_id = ${testUserId}
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    console.log(`📊 Recent badge events (${badgeEvents.length}):`);
    badgeEvents.forEach(event => {
      console.log(`  - ${event.event_type} at ${event.created_at}`);
    });
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugTestUser().then(() => process.exit(0));
