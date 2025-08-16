import { db } from './lib/db/index.js';
import { sql } from 'drizzle-orm';

async function reviewGhostBadgeProgress() {
  console.log('🎯 Reviewing Ghost Badge System Progress...');

  try {
    const userId = 'GijPWH5DAaIf97aGNZGLF';
    
    // Check all available Ghost badges
    console.log('1. All available Ghost badges in database:');
    const allGhostBadges = await db.execute(sql`
      SELECT id, name, tier_scope, archetype_scope, discount_percent
      FROM badges 
      WHERE tier_scope = 'ghost' 
      ORDER BY id
    `);
    
    allGhostBadges.forEach(badge => {
      console.log(`${badge.id}: ${badge.name} (${badge.archetype_scope || 'cross-archetype'}) - ${badge.discount_percent || 0}% discount`);
    });
    
    // Check user's earned Ghost badges
    console.log('\n2. Ghost badges earned by test user:');
    const earnedBadges = await db.execute(sql`
      SELECT ub.badge_id, b.name, ub.earned_at, b.discount_percent
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = ${userId} AND b.tier_scope = 'ghost'
      ORDER BY ub.earned_at
    `);
    
    if (earnedBadges.length > 0) {
      earnedBadges.forEach(badge => {
        console.log(`✅ ${badge.badge_id}: ${badge.name} (${badge.discount_percent}% discount) - earned ${badge.earned_at}`);
      });
    } else {
      console.log('No Ghost badges earned yet');
    }
    
    // Check progress against spec requirements
    console.log('\n3. Ghost Badge System Completion Status:');
    
    const specBadges = {
      'G0_DF': 'Data Flooder starter emblem',
      'G0_FB': 'Firewall Builder starter emblem', 
      'G0_GS': 'Ghost in Shell starter emblem',
      'G0_SN': 'Secure Node starter emblem',
      'G1': 'Streak Spark (7-day streak)',
      'G2': 'Ritual Rookie (10 rituals)',
      'G3': 'Quiet Momentum (5 wall reactions)'
    };
    
    const earnedIds = earnedBadges.map(b => b.badge_id);
    const allSpecIds = Object.keys(specBadges);
    
    console.log('📋 Per specification requirements:');
    allSpecIds.forEach(badgeId => {
      const status = earnedIds.includes(badgeId) ? '✅ EARNED' : '🔄 Available';
      console.log(`${badgeId}: ${specBadges[badgeId]} - ${status}`);
    });
    
    const completionRate = (earnedIds.filter(id => allSpecIds.includes(id)).length / allSpecIds.length) * 100;
    console.log(`\n🎯 Ghost Badge System Completion: ${completionRate.toFixed(1)}%`);
    
    // Check total discount codes earned
    console.log('\n4. Discount codes earned from Ghost badges:');
    const discountCodes = await db.execute(sql`
      SELECT dc.code, dc.percent, b.name as badge_name, dc.created_at
      FROM discount_codes dc
      JOIN badges b ON dc.badge_id = b.id
      WHERE dc.user_id = ${userId} AND b.tier_scope = 'ghost'
      ORDER BY dc.created_at
    `);
    
    if (discountCodes.length > 0) {
      discountCodes.forEach(code => {
        console.log(`💰 ${code.code}: ${code.percent}% off (from ${code.badge_name})`);
      });
    } else {
      console.log('No discount codes from Ghost badges yet');
    }
    
    console.log('\n📈 Next steps to complete Ghost badge system:');
    console.log('- G0 badges: Auto-awarded on registration based on archetype selection');
    console.log('- G3 badge: Implement wall reaction tracking and test with 5 reactions');
    console.log('- Badge selection system: Allow Ghost users to auto-apply, Firewall users to choose');
    
  } catch (error) {
    console.error('💥 Error reviewing Ghost badge progress:', error);
  } finally {
    process.exit(0);
  }
}

reviewGhostBadgeProgress();
