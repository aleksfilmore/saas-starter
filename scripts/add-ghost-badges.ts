import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';

async function addGhostBadges() {
  console.log('🎯 Adding missing Ghost badges to database...');

  try {
    // Add Ghost tier badges (G0, G1, G2, G3)
    console.log('1. Adding G0 starter emblems for each archetype...');
    
    const g0Badges = [
      {
        id: 'G0_DF',
        name: 'Data Stream Embryo',
        description: 'Your journey begins - the first flicker of signal in the void',
        tier_scope: 'ghost',
        archetype_scope: 'DF',
        art_url: '/badges/G0_DF.svg',
        discount_percent: null,
        discount_cap: null
      },
      {
        id: 'G0_FB',
        name: 'Protocol Genesis',
        description: 'First firewall protocols initializing - protection begins here',
        tier_scope: 'ghost',
        archetype_scope: 'FB',
        art_url: '/badges/G0_FB.svg',
        discount_percent: null,
        discount_cap: null
      },
      {
        id: 'G0_GS',
        name: 'Shell Fragment',
        description: 'First echo in the digital void - identity forming in shadows',
        tier_scope: 'ghost',
        archetype_scope: 'GS',
        art_url: '/badges/G0_GS.svg',
        discount_percent: null,
        discount_cap: null
      },
      {
        id: 'G0_SN',
        name: 'Foundation Node',
        description: 'Stable anchor point established - your secure base in the network',
        tier_scope: 'ghost',
        archetype_scope: 'SN',
        art_url: '/badges/G0_SN.svg',
        discount_percent: null,
        discount_cap: null
      }
    ];

    for (const badge of g0Badges) {
      await db.execute(sql`
        INSERT INTO badges (id, name, description, tier_scope, archetype_scope, art_url, discount_percent, discount_cap, is_active, created_at)
        VALUES (
          ${badge.id}, 
          ${badge.name}, 
          ${badge.description}, 
          ${badge.tier_scope}, 
          ${badge.archetype_scope}, 
          ${badge.art_url}, 
          ${badge.discount_percent}, 
          ${badge.discount_cap}, 
          true, 
          ${new Date().toISOString()}
        )
        ON CONFLICT (id) DO NOTHING
      `);
      console.log(`  ✅ Added ${badge.id}: ${badge.name}`);
    }

    console.log('\n2. Adding G1, G2, G3 global Ghost badges...');
    
    const globalGhostBadges = [
      {
        id: 'G1',
        name: 'Streak Spark',
        description: 'Seven days of no-contact discipline - the first spark of control',
        tier_scope: 'ghost',
        archetype_scope: null,
        art_url: '/badges/G1.svg',
        discount_percent: null,
        discount_cap: null
      },
      {
        id: 'G2',
        name: 'Ritual Rookie',
        description: 'Ten rituals completed with authentic journaling - discipline taking root',
        tier_scope: 'ghost',
        archetype_scope: null,
        art_url: '/badges/G2.svg',
        discount_percent: null,
        discount_cap: null
      },
      {
        id: 'G3',
        name: 'Quiet Momentum',
        description: 'Five days of mindful wall engagement - learning through observation',
        tier_scope: 'ghost',
        archetype_scope: null,
        art_url: '/badges/G3.svg',
        discount_percent: 10,
        discount_cap: 1000
      }
    ];

    for (const badge of globalGhostBadges) {
      await db.execute(sql`
        INSERT INTO badges (id, name, description, tier_scope, archetype_scope, art_url, discount_percent, discount_cap, is_active, created_at)
        VALUES (
          ${badge.id}, 
          ${badge.name}, 
          ${badge.description}, 
          ${badge.tier_scope}, 
          ${badge.archetype_scope}, 
          ${badge.art_url}, 
          ${badge.discount_percent}, 
          ${badge.discount_cap}, 
          true, 
          ${new Date().toISOString()}
        )
        ON CONFLICT (id) DO NOTHING
      `);
      console.log(`  ✅ Added ${badge.id}: ${badge.name}`);
    }

    console.log('\n3. Verifying all badges...');
    const allBadges = await db.execute(sql`
      SELECT id, name, tier_scope, archetype_scope, discount_percent
      FROM badges 
      ORDER BY 
        CASE tier_scope 
          WHEN 'ghost' THEN 1 
          WHEN 'firewall' THEN 2 
          ELSE 3 
        END,
        id
    `);

    console.log(`\nTotal badges in database: ${allBadges.length}`);
    
    const ghostBadges = allBadges.filter(b => b.tier_scope === 'ghost');
    const firewallBadges = allBadges.filter(b => b.tier_scope === 'firewall');
    
    console.log(`\nGhost badges (${ghostBadges.length}):`);
    ghostBadges.forEach(badge => {
      const discount = badge.discount_percent ? ` (${badge.discount_percent}% discount)` : '';
      console.log(`  - ${badge.id}: ${badge.name}${discount}`);
    });
    
    console.log(`\nFirewall badges (${firewallBadges.length}):`);
    firewallBadges.forEach(badge => {
      const discount = badge.discount_percent ? ` (${badge.discount_percent}% discount)` : '';
      console.log(`  - ${badge.id}: ${badge.name}${discount}`);
    });

  } catch (error) {
    console.error('❌ Error adding Ghost badges:', error);
    throw error;
  }
}

addGhostBadges()
  .then(() => {
    console.log('\n🎉 Ghost badges successfully added to database!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Failed to add Ghost badges:', error);
    process.exit(1);
  });
