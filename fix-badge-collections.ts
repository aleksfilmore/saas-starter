import { db } from './lib/db/index.js';
import { sql } from 'drizzle-orm';

async function fixBadgeCollections() {
  console.log('🔧 Fixing Badge Collections Implementation...');

  try {
    console.log('1. Creating Badge Collection System with proper array syntax...');
    
    const collections = [
      {
        id: 'ghost_complete',
        name: 'Ghost Mastery',
        description: 'Collect all Ghost tier badges',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=ghost_collection&backgroundColor=1f2937&scale=80',
        required_badges: '{G1,G2,G3}',
        reward_xp: 500,
        reward_bytes: 100
      },
      {
        id: 'archetype_master',
        name: 'Archetype Master',
        description: 'Earn all F1-F4 badges for your archetype',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=archetype_master&backgroundColor=3730a3&scale=80',
        required_badges: '{F1,F2,F3,F4}',
        reward_xp: 750,
        reward_bytes: 150
      },
      {
        id: 'consistency_king',
        name: 'Consistency Champion',
        description: 'Master the art of daily practice',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=consistency&backgroundColor=059669&scale=80',
        required_badges: '{G1,F1,F4,F6}',
        reward_xp: 1000,
        reward_bytes: 200
      },
      {
        id: 'game_legend',
        name: 'Digital Legend',
        description: 'Achieve the ultimate game badges',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=legend&backgroundColor=dc2626&scale=80',
        required_badges: '{X1_Initiate,X2_Awakened,X3_Transcendent,X4_Legend}',
        reward_xp: 2000,
        reward_bytes: 500
      }
    ];

    for (const collection of collections) {
      await db.execute(sql`
        INSERT INTO badge_collections (id, name, description, icon_url, required_badges, collection_reward_xp, collection_reward_bytes)
        VALUES (${collection.id}, ${collection.name}, ${collection.description}, ${collection.icon_url}, ${collection.required_badges}::text[], ${collection.reward_xp}, ${collection.reward_bytes})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          required_badges = EXCLUDED.required_badges,
          collection_reward_xp = EXCLUDED.collection_reward_xp,
          collection_reward_bytes = EXCLUDED.collection_reward_bytes
      `);
      console.log(`✅ Created collection: ${collection.name}`);
    }

    console.log('\n2. Creating User Badge Collections Progress Table...');
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_badge_collections (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        collection_id TEXT NOT NULL REFERENCES badge_collections(id) ON DELETE CASCADE,
        completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        xp_awarded INTEGER DEFAULT 0,
        bytes_awarded INTEGER DEFAULT 0,
        UNIQUE(user_id, collection_id)
      )
    `);

    console.log('✅ user_badge_collections table created');

    console.log('\n3. Adding Game Badge Evaluation Logic...');
    
    // Now let's update the badge evaluator to include game badge logic
    const gameBadgeEvaluationFunction = `
-- Function to evaluate game badge eligibility
CREATE OR REPLACE FUNCTION evaluate_game_badge_eligibility(p_user_id TEXT)
RETURNS TABLE(eligible_badge_id TEXT, requirements_met BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  WITH user_stats AS (
    SELECT 
      COUNT(DISTINCT CASE WHEN be.event_type = 'ritual_completed' THEN be.id END) as total_rituals,
      COUNT(DISTINCT CASE WHEN be.event_type = 'ritual_completed' THEN (be.payload->>'category')::text END) as ritual_categories,
      COALESCE(MAX((be.payload->>'streakCount')::integer), 0) as max_streak,
      COUNT(DISTINCT CASE WHEN b.tier_scope = 'firewall' THEN ub.badge_id END) as firewall_badges_earned
    FROM users u
    LEFT JOIN badge_events be ON u.id = be.user_id
    LEFT JOIN user_badges ub ON u.id = ub.user_id
    LEFT JOIN badges b ON ub.badge_id = b.id
    WHERE u.id = p_user_id
  ),
  game_requirements AS (
    SELECT 
      gbc.badge_id,
      gbc.ritual_categories as req_categories,
      gbc.min_streak as req_streak,
      gbc.firewall_badges as req_firewall_badges,
      gbc.total_rituals as req_total_rituals
    FROM game_badge_conditions gbc
  )
  SELECT 
    gr.badge_id,
    (us.total_rituals >= gr.req_total_rituals AND 
     us.ritual_categories >= gr.req_categories AND 
     us.max_streak >= gr.req_streak AND 
     us.firewall_badges_earned >= gr.req_firewall_badges) as requirements_met
  FROM user_stats us
  CROSS JOIN game_requirements gr
  WHERE NOT EXISTS (
    SELECT 1 FROM user_badges ub2 
    WHERE ub2.user_id = p_user_id AND ub2.badge_id = gr.badge_id
  );
END;
$$ LANGUAGE plpgsql;
`;

    await db.execute(sql`${gameBadgeEvaluationFunction}`);
    console.log('✅ Game badge evaluation function created');

    console.log('\n4. Testing Game Badge System...');
    
    // Test the game badge evaluation for our test user
    const testUserId = 'GijPWH5DAaIf97aGNZGLF';
    const gameEligibility = await db.execute(sql`
      SELECT * FROM evaluate_game_badge_eligibility(${testUserId})
    `);

    console.log('Game badge eligibility for test user:');
    gameEligibility.forEach(result => {
      console.log(`${result.eligible_badge_id}: ${result.requirements_met ? '✅ ELIGIBLE' : '❌ Not ready'}`);
    });

    // Check current user stats
    const userStats = await db.execute(sql`
      SELECT 
        COUNT(DISTINCT CASE WHEN be.event_type = 'ritual_completed' THEN be.id END) as total_rituals,
        COUNT(DISTINCT CASE WHEN be.event_type = 'ritual_completed' THEN (be.payload->>'category')::text END) as ritual_categories,
        COALESCE(MAX((be.payload->>'streakCount')::integer), 0) as max_streak,
        COUNT(DISTINCT CASE WHEN b.tier_scope = 'firewall' THEN ub.badge_id END) as firewall_badges_earned
      FROM users u
      LEFT JOIN badge_events be ON u.id = be.user_id
      LEFT JOIN user_badges ub ON u.id = ub.user_id
      LEFT JOIN badges b ON ub.badge_id = b.id
      WHERE u.id = ${testUserId}
    `);

    const stats = userStats[0];
    console.log('\nUser Statistics:');
    console.log(`• Total rituals: ${stats?.total_rituals || 0}`);
    console.log(`• Ritual categories: ${stats?.ritual_categories || 0}`);
    console.log(`• Max streak: ${stats?.max_streak || 0}`);
    console.log(`• Firewall badges: ${stats?.firewall_badges_earned || 0}`);

    console.log('\n🎉 Badge Collections and Game Badge System Complete!');
    
    // Verify collections
    const collectionsCount = await db.execute(sql`
      SELECT COUNT(*) as count FROM badge_collections
    `);
    
    console.log(`✅ Badge collections created: ${collectionsCount[0]?.count || 0}`);
    console.log('✅ Game badge evaluation logic: Ready');
    console.log('✅ Collection progress tracking: Ready');

  } catch (error) {
    console.error('💥 Failed to fix badge collections:', error);
  } finally {
    process.exit(0);
  }
}

fixBadgeCollections();
