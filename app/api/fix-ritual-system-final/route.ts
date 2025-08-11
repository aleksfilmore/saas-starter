import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST() {
  try {
    console.log('🔧 Comprehensive ritual system fix...');
    
    // Step 1: Add missing reward columns to ritual_library
    console.log('📝 Adding reward columns to ritual_library...');
    await pool.query(`
      ALTER TABLE ritual_library 
      ADD COLUMN IF NOT EXISTS xp_reward INTEGER DEFAULT 15,
      ADD COLUMN IF NOT EXISTS byte_reward INTEGER DEFAULT 25;
    `);
    console.log('✅ Added reward columns to ritual_library');
    
    // Step 2: Create/update the ritual assignment function to use correct column names
    console.log('📝 Creating ritual assignment function...');
    await pool.query(`
      CREATE OR REPLACE FUNCTION get_next_ritual_for_user(p_user_id TEXT)
      RETURNS TABLE (
        id TEXT,
        title TEXT,
        description TEXT,
        steps JSONB,
        difficulty TEXT,
        xp_reward INT,
        byte_reward INT,
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
          COALESCE(rl.byte_reward, 25),
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
    `);
    console.log('✅ Created ritual assignment function');
    
    // Step 3: Test the function
    console.log('📝 Testing ritual assignment function...');
    const testResult = await pool.query(`
      SELECT * FROM get_next_ritual_for_user('test-user-id') LIMIT 1;
    `);
    console.log('✅ Function test successful, returned:', testResult.rows.length, 'ritual(s)');
    
    return NextResponse.json({
      success: true,
      message: 'Ritual system comprehensively fixed',
      details: {
        added_columns: ['xp_reward', 'byte_reward'],
        function_created: true,
        test_result: testResult.rows.length > 0 ? 'PASS' : 'NO_RITUALS_AVAILABLE'
      }
    });
    
  } catch (error) {
    console.error('❌ Comprehensive fix error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Failed during comprehensive ritual system fix'
      },
      { status: 500 }
    );
  }
}
