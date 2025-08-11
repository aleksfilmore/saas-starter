import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST() {
  try {
    console.log('Connecting to database with URL starting with:', process.env.DATABASE_URL?.substring(0, 20) + '...');
    
    // Final fix: Update function to use bytes_reward (with s) instead of byte_reward
    const functionQuery = `
      CREATE OR REPLACE FUNCTION get_next_ritual_for_user(p_user_id TEXT)
      RETURNS TABLE (
        id TEXT,
        title TEXT,
        description TEXT,
        steps JSONB,
        difficulty TEXT,
        xp_reward INT,
        bytes_reward INT,
        duration INT,
        category TEXT,
        emotional_tone TEXT,
        tier TEXT,
        archetype TEXT
      ) AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          rl.id::TEXT,
          rl.title,
          rl.description,
          rl.steps,
          rl.difficulty,
          COALESCE(rl.xp_reward, 15),
          COALESCE(rl.bytes_reward, 25),
          rl.duration,
          rl.category,
          rl.emotional_tone,
          rl.tier,
          'UNIVERSAL'::TEXT
        FROM ritual_library rl
        WHERE 
          -- Only include free tier rituals for now
          (rl.tier = 'free' OR rl.tier IS NULL OR rl.tier = '')
          -- Exclude already assigned rituals
          AND rl.id NOT IN (
            SELECT ritual_id FROM user_rituals WHERE user_id = p_user_id
          )
        ORDER BY RANDOM()
        LIMIT 1;
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    await pool.query(functionQuery);
    
    return NextResponse.json({
      success: true,
      message: 'Ritual assignment function fixed to use bytes_reward (with s)',
      fixes: [
        'Updated function to use rl.bytes_reward instead of rl.byte_reward',
        'Function now matches actual ritual_library schema'
      ]
    });
    
  } catch (error) {
    console.error('❌ Function fix error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
