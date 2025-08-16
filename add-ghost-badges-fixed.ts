import { db } from './lib/db/index.js';
import { sql } from 'drizzle-orm';

async function addGhostBadges() {
  console.log('🎯 Adding missing Ghost badges to database...');

  try {
    // First check current schema
    console.log('1. Checking current badge table structure...');
    const existingBadges = await db.execute(sql`
      SELECT id, name, icon_url FROM badges WHERE tier = 'ghost' LIMIT 3
    `);
    
    console.log('Existing ghost badges:', existingBadges);
    
    // Add Ghost tier badges (G0, G1, G2, G3) with proper icon URLs
    console.log('2. Adding G0 starter emblems for each archetype...');
    
    const g0Badges = [
      {
        id: 'G0_DF',
        name: 'Data Stream Embryo',
        description: 'Your journey begins - the first flicker of signal in the void',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=G0_DF&backgroundColor=0f172a&scale=80',
        tier: 'ghost',
        archetype: 'DF',
        unlock_criteria: 'Auto-awarded on registration for Data Flooder archetype',
        points_required: 0,
        discount_percentage: 0,
        is_active: true
      },
      {
        id: 'G0_FB',
        name: 'Cipher Seed',
        description: 'The first wall built - a foundation in the digital realm',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=G0_FB&backgroundColor=dc2626&scale=80',
        tier: 'ghost',
        archetype: 'FB',
        unlock_criteria: 'Auto-awarded on registration for Firewall Builder archetype',
        points_required: 0,
        discount_percentage: 0,
        is_active: true
      },
      {
        id: 'G0_GS',
        name: 'Shadow Spawn',
        description: 'Born in darkness - the ghost awakens in the shell',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=G0_GS&backgroundColor=1f2937&scale=80',
        tier: 'ghost',
        archetype: 'GS',
        unlock_criteria: 'Auto-awarded on registration for Ghost in Shell archetype',
        points_required: 0,
        discount_percentage: 0,
        is_active: true
      },
      {
        id: 'G0_SN',
        name: 'Network Neuron',
        description: 'The first secure connection - a node in the vast network',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=G0_SN&backgroundColor=059669&scale=80',
        tier: 'ghost',
        archetype: 'SN',
        unlock_criteria: 'Auto-awarded on registration for Secure Node archetype',
        points_required: 0,
        discount_percentage: 0,
        is_active: true
      }
    ];

    // Insert G0 badges
    for (const badge of g0Badges) {
      await db.execute(sql`
        INSERT INTO badges (id, name, description, tier, archetype, icon_url, unlock_criteria, points_required, discount_percentage, is_active, created_at)
        VALUES (${badge.id}, ${badge.name}, ${badge.description}, ${badge.tier}, ${badge.archetype}, ${badge.icon_url}, ${badge.unlock_criteria}, ${badge.points_required}, ${badge.discount_percentage}, ${badge.is_active}, NOW())
        ON CONFLICT (id) DO NOTHING
      `);
      console.log(`✅ Added ${badge.id}: ${badge.name}`);
    }

    console.log('3. Adding G1-G3 progression badges...');
    
    const progressionBadges = [
      {
        id: 'G1',
        name: 'Streak Spark',
        description: 'Seven days of consistency - the habit forms in digital shadows',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=G1&backgroundColor=4f46e5&scale=80',
        tier: 'ghost',
        archetype: null, // Cross-archetype
        unlock_criteria: 'Complete a 7-day streak',
        points_required: 0,
        discount_percentage: 5,
        is_active: true
      },
      {
        id: 'G2',
        name: 'Ritual Rookie',
        description: 'Ten rituals completed - the foundation strengthens',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=G2&backgroundColor=7c3aed&scale=80',
        tier: 'ghost',
        archetype: null, // Cross-archetype
        unlock_criteria: 'Complete 10 rituals',
        points_required: 0,
        discount_percentage: 10,
        is_active: true
      },
      {
        id: 'G3',
        name: 'Quiet Momentum',
        description: 'The wall begins to resonate - others take notice',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=G3&backgroundColor=be185d&scale=80',
        tier: 'ghost',
        archetype: null, // Cross-archetype
        unlock_criteria: 'Receive 5 wall reactions',
        points_required: 0,
        discount_percentage: 15,
        is_active: true
      }
    ];

    // Insert progression badges
    for (const badge of progressionBadges) {
      await db.execute(sql`
        INSERT INTO badges (id, name, description, tier, archetype, icon_url, unlock_criteria, points_required, discount_percentage, is_active, created_at)
        VALUES (${badge.id}, ${badge.name}, ${badge.description}, ${badge.tier}, ${badge.archetype}, ${badge.icon_url}, ${badge.unlock_criteria}, ${badge.points_required}, ${badge.discount_percentage}, ${badge.is_active}, NOW())
        ON CONFLICT (id) DO NOTHING
      `);
      console.log(`✅ Added ${badge.id}: ${badge.name}`);
    }

    console.log('\n🎉 Successfully added all Ghost badges!');
    console.log('Ghost badges added:');
    console.log('- G0_DF, G0_FB, G0_GS, G0_SN (starter emblems)');
    console.log('- G1 (7-day streak, 5% discount)');
    console.log('- G2 (10 rituals, 10% discount)');
    console.log('- G3 (5 wall reactions, 15% discount)');

    // Verify the badges were added
    const ghostBadges = await db.execute(sql`
      SELECT id, name, tier, archetype, discount_percentage
      FROM badges 
      WHERE tier = 'ghost' 
      ORDER BY id
    `);
    
    console.log('\n📋 All Ghost badges in database:');
    ghostBadges.forEach(badge => {
      console.log(`${badge.id}: ${badge.name} (${badge.archetype || 'cross-archetype'}) - ${badge.discount_percentage}% discount`);
    });

  } catch (error) {
    console.error('💥 Failed to add Ghost badges:', error);
  } finally {
    process.exit(0);
  }
}

addGhostBadges();
