import { db } from './lib/db/index.js';
import { sql } from 'drizzle-orm';

async function addSpecCompliantGhostBadges() {
  console.log('🎯 Adding spec-compliant Ghost badges to database...');

  try {
    // Add G0 archetype-specific starter emblems
    console.log('1. Adding G0 starter emblems for each archetype...');
    
    const g0Badges = [
      {
        id: 'G0_DF',
        name: 'Data Stream Embryo',
        description: 'Your journey begins - the first flicker of signal in the void',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=G0_DF&backgroundColor=0f172a&scale=80',
        category: 'achievement',
        xp_reward: 50,
        byte_reward: 10,
        tier_scope: 'ghost',
        archetype_scope: 'DF',
        code: 'G0_DF_STARTER',
        discount_percent: 0,
        is_active: true
      },
      {
        id: 'G0_FB',
        name: 'Cipher Seed',
        description: 'The first wall built - a foundation in the digital realm',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=G0_FB&backgroundColor=dc2626&scale=80',
        category: 'achievement',
        xp_reward: 50,
        byte_reward: 10,
        tier_scope: 'ghost',
        archetype_scope: 'FB',
        code: 'G0_FB_STARTER',
        discount_percent: 0,
        is_active: true
      },
      {
        id: 'G0_GS',
        name: 'Shadow Spawn',
        description: 'Born in darkness - the ghost awakens in the shell',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=G0_GS&backgroundColor=1f2937&scale=80',
        category: 'achievement',
        xp_reward: 50,
        byte_reward: 10,
        tier_scope: 'ghost',
        archetype_scope: 'GS',
        code: 'G0_GS_STARTER',
        discount_percent: 0,
        is_active: true
      },
      {
        id: 'G0_SN',
        name: 'Network Neuron',
        description: 'The first secure connection - a node in the vast network',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=G0_SN&backgroundColor=059669&scale=80',
        category: 'achievement',
        xp_reward: 50,
        byte_reward: 10,
        tier_scope: 'ghost',
        archetype_scope: 'SN',
        code: 'G0_SN_STARTER',
        discount_percent: 0,
        is_active: true
      }
    ];

    // Insert G0 badges
    for (const badge of g0Badges) {
      await db.execute(sql`
        INSERT INTO badges (id, name, description, icon_url, category, xp_reward, byte_reward, tier_scope, archetype_scope, code, discount_percent, is_active, created_at)
        VALUES (${badge.id}, ${badge.name}, ${badge.description}, ${badge.icon_url}, ${badge.category}, ${badge.xp_reward}, ${badge.byte_reward}, ${badge.tier_scope}, ${badge.archetype_scope}, ${badge.code}, ${badge.discount_percent}, ${badge.is_active}, NOW())
        ON CONFLICT (id) DO NOTHING
      `);
      console.log(`✅ Added ${badge.id}: ${badge.name}`);
    }

    console.log('2. Adding G1-G3 progression badges...');
    
    const progressionBadges = [
      {
        id: 'G1',
        name: 'Streak Spark',
        description: 'Seven days of consistency - the habit forms in digital shadows',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=G1&backgroundColor=4f46e5&scale=80',
        category: 'streak',
        xp_reward: 100,
        byte_reward: 25,
        tier_scope: 'ghost',
        archetype_scope: null, // Cross-archetype
        code: 'G1_STREAK_SPARK',
        discount_percent: 5,
        is_active: true
      },
      {
        id: 'G2',
        name: 'Ritual Rookie',
        description: 'Ten rituals completed - the foundation strengthens',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=G2&backgroundColor=7c3aed&scale=80',
        category: 'ritual',
        xp_reward: 150,
        byte_reward: 30,
        tier_scope: 'ghost',
        archetype_scope: null, // Cross-archetype
        code: 'G2_RITUAL_ROOKIE',
        discount_percent: 10,
        is_active: true
      },
      {
        id: 'G3',
        name: 'Quiet Momentum',
        description: 'The wall begins to resonate - others take notice',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=G3&backgroundColor=be185d&scale=80',
        category: 'social',
        xp_reward: 200,
        byte_reward: 40,
        tier_scope: 'ghost',
        archetype_scope: null, // Cross-archetype
        code: 'G3_QUIET_MOMENTUM',
        discount_percent: 15,
        is_active: true
      }
    ];

    // Insert progression badges
    for (const badge of progressionBadges) {
      await db.execute(sql`
        INSERT INTO badges (id, name, description, icon_url, category, xp_reward, byte_reward, tier_scope, archetype_scope, code, discount_percent, is_active, created_at)
        VALUES (${badge.id}, ${badge.name}, ${badge.description}, ${badge.icon_url}, ${badge.category}, ${badge.xp_reward}, ${badge.byte_reward}, ${badge.tier_scope}, ${badge.archetype_scope}, ${badge.code}, ${badge.discount_percent}, ${badge.is_active}, NOW())
        ON CONFLICT (id) DO NOTHING
      `);
      console.log(`✅ Added ${badge.id}: ${badge.name}`);
    }

    console.log('\n🎉 Successfully added all spec-compliant Ghost badges!');
    console.log('Ghost badges added:');
    console.log('- G0_DF, G0_FB, G0_GS, G0_SN (archetype starter emblems)');
    console.log('- G1 (7-day streak, 5% discount)');
    console.log('- G2 (10 rituals, 10% discount)');
    console.log('- G3 (5 wall reactions, 15% discount)');

    // Verify the badges were added
    const allGhostBadges = await db.execute(sql`
      SELECT id, name, tier_scope, archetype_scope, discount_percent
      FROM badges 
      WHERE tier_scope = 'ghost' 
      ORDER BY id
    `);
    
    console.log('\n📋 All Ghost badges in database:');
    allGhostBadges.forEach(badge => {
      console.log(`${badge.id}: ${badge.name} (${badge.archetype_scope || 'cross-archetype'}) - ${badge.discount_percent || 0}% discount`);
    });

  } catch (error) {
    console.error('💥 Failed to add Ghost badges:', error);
  } finally {
    process.exit(0);
  }
}

addSpecCompliantGhostBadges();
