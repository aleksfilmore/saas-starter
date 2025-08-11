import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

export const runtime = 'nodejs';

/**
 * GET /api/fix-ritual-function
 * Fix the ritual assignment function to use correct column names
 */
export async function GET() {
  try {
    console.log('🔧 Fixing ritual assignment function...');

    // Create the correct function that matches actual ritual_library columns
    await db.execute(sql`
      CREATE OR REPLACE FUNCTION get_next_ritual_for_user(p_user_id TEXT) 
      RETURNS TABLE(
        ritual_id TEXT,
        title TEXT,
        description TEXT,
        steps JSONB,
        difficulty TEXT,
        xp_reward INTEGER,
        bytes_reward INTEGER,
        duration INTEGER,
        category TEXT,
        emotional_tone TEXT,
        tier TEXT,
        archetype TEXT
      ) AS $$
      DECLARE
        user_tier TEXT;
      BEGIN
        -- Get user tier (default to 'free' if not set)
        SELECT ritual_tier INTO user_tier FROM users WHERE id = p_user_id;
        IF user_tier IS NULL THEN
          user_tier := 'free';
        END IF;
        
        -- Return ritual from ritual_library, excluding already assigned ones
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

    console.log('✅ Fixed ritual assignment function');

    return NextResponse.json({
      success: true,
      message: 'Ritual assignment function fixed to use correct column names',
      fixes: [
        'Updated function to use byte_reward instead of bytes_reward',
        'Added COALESCE for missing xp_reward values',
        'Simplified archetype handling'
      ]
    });

  } catch (error) {
    console.error('❌ Function fix error:', error);
    return NextResponse.json(
      { 
        error: 'Function fix failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
