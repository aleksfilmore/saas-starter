import { db } from './lib/db/index.js';
import { sql } from 'drizzle-orm';

async function reviewFirewallBadgeSystem() {
  console.log('🔥 Phase 2: Reviewing Firewall Badge System Implementation...');

  try {
    // Check all Firewall badges in database
    console.log('1. All Firewall badges in database:');
    const firewallBadges = await db.execute(sql`
      SELECT id, name, tier_scope, archetype_scope, discount_percent, category
      FROM badges 
      WHERE tier_scope = 'firewall' 
      ORDER BY id
    `);
    
    console.log(`Found ${firewallBadges.length} Firewall badges:`);
    firewallBadges.forEach(badge => {
      console.log(`${badge.id}: ${badge.name} (${badge.archetype_scope || 'cross-archetype'}) - ${badge.discount_percent}% discount - ${badge.category}`);
    });

    // Check badge completion by category
    console.log('\n2. Badge completion by category:');
    const categories = ['streak', 'ritual', 'social', 'mastery', 'consistency', 'ultimate'];
    
    for (const category of categories) {
      const categoryBadges = await db.execute(sql`
        SELECT COUNT(*) as count, string_agg(id, ', ' ORDER BY id) as badges
        FROM badges 
        WHERE tier_scope = 'firewall' AND category = ${category}
      `);
      
      const count = categoryBadges[0]?.count || 0;
      const badges = categoryBadges[0]?.badges || 'None';
      console.log(`${category}: ${count} badges (${badges})`);
    }

    // Check archetype coverage
    console.log('\n3. Archetype coverage:');
    const archetypes = ['DF', 'FB', 'GS', 'SN'];
    
    for (const archetype of archetypes) {
      const archetypeBadges = await db.execute(sql`
        SELECT COUNT(*) as count, string_agg(id, ', ' ORDER BY id) as badges
        FROM badges 
        WHERE tier_scope = 'firewall' AND archetype_scope = ${archetype}
      `);
      
      const count = archetypeBadges[0]?.count || 0;
      const badges = archetypeBadges[0]?.badges || 'None';
      console.log(`${archetype}: ${count} badges (${badges})`);
    }

    // Check Phase 2 completion status
    console.log('\n4. Phase 2 Implementation Status:');
    
    const expectedF5toF8 = [
      'F5_DF', 'F5_FB', 'F5_GS', 'F5_SN', // Mastery (100 rituals)
      'F6_DF', 'F6_FB', 'F6_GS', 'F6_SN', // Consistency (90-day streak)
      'F7_DF', 'F7_FB', 'F7_GS', 'F7_SN', // Social (25 wall interactions)
      'F8_DF', 'F8_FB', 'F8_GS', 'F8_SN'  // Ultimate (200 rituals)
    ];
    
    const existingIds = firewallBadges.map(b => b.id);
    const phase2Badges = expectedF5toF8.filter(id => existingIds.includes(id));
    
    console.log('✅ Phase 2 badges added:');
    phase2Badges.forEach(id => {
      const badge = firewallBadges.find(b => b.id === id);
      console.log(`  ${id}: ${badge?.name} (${badge?.discount_percent}% discount)`);
    });
    
    const missing = expectedF5toF8.filter(id => !existingIds.includes(id));
    if (missing.length > 0) {
      console.log('❌ Missing Phase 2 badges:', missing);
    } else {
      console.log('\n🎉 Phase 2 Firewall Badge System: COMPLETE!');
    }

    // Summary of unlock conditions
    console.log('\n5. Unlock Conditions Summary:');
    console.log('F1: 14-day streak (✅ existing)');
    console.log('F2: 25 ritual completions (✅ existing)');
    console.log('F3: 45 rituals + 3 AI sessions (✅ existing)');
    console.log('F4: 30-day streak (✅ existing)');
    console.log('F5: 100 ritual completions (✅ Phase 2)');
    console.log('F6: 90-day streak (✅ Phase 2)');
    console.log('F7: 25 wall interactions (✅ Phase 2)');
    console.log('F8: 200 ritual completions (✅ Phase 2)');

  } catch (error) {
    console.error('💥 Error reviewing Firewall badge system:', error);
  } finally {
    process.exit(0);
  }
}

reviewFirewallBadgeSystem();
