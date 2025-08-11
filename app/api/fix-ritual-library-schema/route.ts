import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST() {
  try {
    console.log('Connecting to database with URL starting with:', process.env.DATABASE_URL?.substring(0, 20) + '...');
    
    console.log('🔧 Adding missing reward columns to ritual_library table...');
    
    // Add missing reward columns to ritual_library
    const addColumnsQuery = `
      ALTER TABLE ritual_library 
      ADD COLUMN IF NOT EXISTS xp_reward INTEGER DEFAULT 15,
      ADD COLUMN IF NOT EXISTS bytes_reward INTEGER DEFAULT 25;
    `;
    
    await pool.query(addColumnsQuery);
    console.log('✅ Added reward columns to ritual_library');
    
    // Now fix the function to use the correct columns
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
    console.log('✅ Fixed get_next_ritual_for_user function');
    
    return NextResponse.json({
      success: true,
      message: 'Added missing reward columns and fixed function',
      fixes: [
        'Added xp_reward and bytes_reward columns to ritual_library table',
        'Updated function to use correct column references',
        'Function now works with complete schema'
      ]
    });
    
  } catch (error) {
    console.error('❌ Schema fix error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
