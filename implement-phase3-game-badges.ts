import { db } from './lib/db/index.js';
import { sql } from 'drizzle-orm';

async function implementPhase3GameBadges() {
  console.log('🎮 Phase 3: Implementing Game Badge System (X1-X4)...');

  try {
    console.log('1. Adding X1-X4 Game Badges...');
    
    // X1-X4 are already in database, let's update their unlock logic
    // First, check existing game badges
    const existingGameBadges = await db.execute(sql`
      SELECT id, name, tier_scope, archetype_scope, discount_percent, category
      FROM badges 
      WHERE id ~ '^X[1-4]'
      ORDER BY id
    `);

    console.log('Existing Game Badges:');
    existingGameBadges.forEach(badge => {
      console.log(`${badge.id}: ${badge.name} - ${badge.discount_percent}% discount`);
    });

    // Add any missing game badges
    const gameBadges = [
      {
        id: 'X1_Initiate',
        name: 'Digital Initiate',
        description: 'First steps into the CTRL+ALT+BLOCK universe - welcome to the grid',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=X1&backgroundColor=8b5cf6&scale=80',
        category: 'game',
        xp_reward: 200,
        byte_reward: 50,
        tier_scope: 'firewall',
        archetype_scope: null,
        code: 'X1_DIGITAL_INITIATE',
        discount_percent: 25,
        is_active: true
      },
      {
        id: 'X2_Awakened',
        name: 'System Awakened',
        description: 'You see the patterns now - the code reveals its secrets',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=X2&backgroundColor=ec4899&scale=80',
        category: 'game',
        xp_reward: 500,
        byte_reward: 100,
        tier_scope: 'firewall',
        archetype_scope: null,
        code: 'X2_SYSTEM_AWAKENED',
        discount_percent: 40,
        is_active: true
      },
      {
        id: 'X3_Transcendent',
        name: 'Digital Transcendent',
        description: 'Beyond the firewall lies infinite possibility - you have ascended',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=X3&backgroundColor=f59e0b&scale=80',
        category: 'game',
        xp_reward: 1000,
        byte_reward: 200,
        tier_scope: 'firewall',
        archetype_scope: null,
        code: 'X3_DIGITAL_TRANSCENDENT',
        discount_percent: 60,
        is_active: true
      },
      {
        id: 'X4_Legend',
        name: 'Eternal Legend',
        description: 'Your name echoes through all networks - a living myth in the digital realm',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=X4&backgroundColor=10b981&scale=80',
        category: 'game',
        xp_reward: 2000,
        byte_reward: 500,
        tier_scope: 'firewall',
        archetype_scope: null,
        code: 'X4_ETERNAL_LEGEND',
        discount_percent: 100,
        is_active: true
      }
    ];

    // Update or insert game badges
    for (const badge of gameBadges) {
      await db.execute(sql`
        INSERT INTO badges (id, name, description, icon_url, category, xp_reward, byte_reward, tier_scope, archetype_scope, code, discount_percent, is_active, created_at)
        VALUES (${badge.id}, ${badge.name}, ${badge.description}, ${badge.icon_url}, ${badge.category}, ${badge.xp_reward}, ${badge.byte_reward}, ${badge.tier_scope}, ${badge.archetype_scope}, ${badge.code}, ${badge.discount_percent}, ${badge.is_active}, NOW())
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          icon_url = EXCLUDED.icon_url,
          xp_reward = EXCLUDED.xp_reward,
          byte_reward = EXCLUDED.byte_reward,
          discount_percent = EXCLUDED.discount_percent
      `);
      console.log(`✅ Updated ${badge.id}: ${badge.name}`);
    }

    console.log('\n2. Creating Game Badge Achievement System...');
    
    // Create achievement milestones table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS achievement_milestones (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        milestone_type TEXT NOT NULL,
        milestone_value INTEGER NOT NULL,
        achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, milestone_type, milestone_value)
      )
    `);

    console.log('✅ achievement_milestones table created');

    console.log('\n3. Implementing Game Badge Unlock Logic...');
    
    // Game badge unlock conditions:
    // X1: Complete 3 different ritual categories + 1 week streak
    // X2: Complete 10 rituals + earn 3 firewall badges + 30-day streak  
    // X3: Complete 50 rituals + earn 6 firewall badges + 60-day streak
    // X4: Complete 100 rituals + earn all F1-F4 archetype badges + 90-day streak

    const gameUnlockConditions = {
      'X1_Initiate': {
        ritual_categories: 3,
        min_streak: 7,
        firewall_badges: 0,
        total_rituals: 5
      },
      'X2_Awakened': {
        ritual_categories: 4,
        min_streak: 30,
        firewall_badges: 3,
        total_rituals: 25
      },
      'X3_Transcendent': {
        ritual_categories: 5,
        min_streak: 60,
        firewall_badges: 6,
        total_rituals: 75
      },
      'X4_Legend': {
        ritual_categories: 6,
        min_streak: 90,
        firewall_badges: 8,
        total_rituals: 150
      }
    };

    // Store unlock conditions in database
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS game_badge_conditions (
        badge_id TEXT PRIMARY KEY,
        ritual_categories INTEGER NOT NULL,
        min_streak INTEGER NOT NULL,
        firewall_badges INTEGER NOT NULL,
        total_rituals INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    for (const [badgeId, conditions] of Object.entries(gameUnlockConditions)) {
      await db.execute(sql`
        INSERT INTO game_badge_conditions (badge_id, ritual_categories, min_streak, firewall_badges, total_rituals)
        VALUES (${badgeId}, ${conditions.ritual_categories}, ${conditions.min_streak}, ${conditions.firewall_badges}, ${conditions.total_rituals})
        ON CONFLICT (badge_id) DO UPDATE SET
          ritual_categories = EXCLUDED.ritual_categories,
          min_streak = EXCLUDED.min_streak,
          firewall_badges = EXCLUDED.firewall_badges,
          total_rituals = EXCLUDED.total_rituals
      `);
    }

    console.log('✅ Game badge unlock conditions stored');

    console.log('\n4. Creating Badge Collection System...');
    
    // Badge collections - groups of related badges
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS badge_collections (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        icon_url TEXT NOT NULL,
        required_badges TEXT[] NOT NULL,
        collection_reward_xp INTEGER DEFAULT 0,
        collection_reward_bytes INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    const collections = [
      {
        id: 'ghost_complete',
        name: 'Ghost Mastery',
        description: 'Collect all Ghost tier badges',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=ghost_collection&backgroundColor=1f2937&scale=80',
        required_badges: ['G1', 'G2', 'G3'],
        reward_xp: 500,
        reward_bytes: 100
      },
      {
        id: 'archetype_master',
        name: 'Archetype Master',
        description: 'Earn all F1-F4 badges for your archetype',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=archetype_master&backgroundColor=3730a3&scale=80',
        required_badges: ['F1', 'F2', 'F3', 'F4'], // Will be archetype-specific
        reward_xp: 750,
        reward_bytes: 150
      },
      {
        id: 'consistency_king',
        name: 'Consistency Champion',
        description: 'Master the art of daily practice',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=consistency&backgroundColor=059669&scale=80',
        required_badges: ['G1', 'F1', 'F4', 'F6'],
        reward_xp: 1000,
        reward_bytes: 200
      },
      {
        id: 'game_legend',
        name: 'Digital Legend',
        description: 'Achieve the ultimate game badges',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=legend&backgroundColor=dc2626&scale=80',
        required_badges: ['X1_Initiate', 'X2_Awakened', 'X3_Transcendent', 'X4_Legend'],
        reward_xp: 2000,
        reward_bytes: 500
      }
    ];

    for (const collection of collections) {
      await db.execute(sql`
        INSERT INTO badge_collections (id, name, description, icon_url, required_badges, collection_reward_xp, collection_reward_bytes)
        VALUES (${collection.id}, ${collection.name}, ${collection.description}, ${collection.icon_url}, ${collection.required_badges}, ${collection.reward_xp}, ${collection.reward_bytes})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          required_badges = EXCLUDED.required_badges,
          collection_reward_xp = EXCLUDED.collection_reward_xp,
          collection_reward_bytes = EXCLUDED.collection_reward_bytes
      `);
      console.log(`✅ Created collection: ${collection.name}`);
    }

    console.log('\n🎉 Phase 3 Game Badge System Implementation Complete!');
    
    // Verify implementation
    const totalGameBadges = await db.execute(sql`
      SELECT COUNT(*) as count FROM badges WHERE category = 'game'
    `);
    
    const collections_count = await db.execute(sql`
      SELECT COUNT(*) as count FROM badge_collections
    `);

    console.log('\n📊 Phase 3 Implementation Summary:');
    console.log(`✅ Game badges: ${totalGameBadges[0]?.count || 0}`);
    console.log(`✅ Badge collections: ${collections_count[0]?.count || 0}`);
    console.log('✅ Achievement milestone tracking: Ready');
    console.log('✅ Game badge unlock conditions: Stored');
    
    console.log('\n🎯 Game Badge Unlock Requirements:');
    console.log('X1 (Digital Initiate): 5 rituals + 3 categories + 7-day streak');
    console.log('X2 (System Awakened): 25 rituals + 4 categories + 3 firewall badges + 30-day streak');
    console.log('X3 (Digital Transcendent): 75 rituals + 5 categories + 6 firewall badges + 60-day streak');
    console.log('X4 (Eternal Legend): 150 rituals + 6 categories + 8 firewall badges + 90-day streak');

  } catch (error) {
    console.error('💥 Failed to implement Phase 3 Game Badge System:', error);
  } finally {
    process.exit(0);
  }
}

implementPhase3GameBadges();
