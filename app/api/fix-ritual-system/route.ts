import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

export const runtime = 'nodejs';

/**
 * GET /api/fix-ritual-system
 * Complete fix for ritual system database schema and functions
 */
export async function GET() {
  try {
    console.log('🔧 Comprehensive ritual system fix...');

    // 1. Fix ritual_library table to match expected schema
    await db.execute(sql`
      ALTER TABLE ritual_library
      ADD COLUMN IF NOT EXISTS xp_reward INTEGER DEFAULT 15
    `);
    
    await db.execute(sql`
      ALTER TABLE ritual_library
      ADD COLUMN IF NOT EXISTS archetype TEXT[] DEFAULT ARRAY['UNIVERSAL']
    `);
    
    await db.execute(sql`
      ALTER TABLE ritual_library
      ADD COLUMN IF NOT EXISTS action_type TEXT DEFAULT 'reflect'
    `);
    
    await db.execute(sql`
      ALTER TABLE ritual_library
      ADD COLUMN IF NOT EXISTS estimated_time TEXT DEFAULT '10 minutes'
    `);
    
    await db.execute(sql`
      ALTER TABLE ritual_library  
      ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[]
    `);
    
    await db.execute(sql`
      ALTER TABLE ritual_library
      ADD COLUMN IF NOT EXISTS media_refs JSONB DEFAULT '{}'
    `);
    
    await db.execute(sql`
      ALTER TABLE ritual_library
      ADD COLUMN IF NOT EXISTS is_milestone BOOLEAN DEFAULT false
    `);
    
    await db.execute(sql`
      ALTER TABLE ritual_library
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now()
    `);

    // 2. Create or replace the ritual assignment function for TEXT IDs
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
          rl.xp_reward,
          rl.bytes_reward,
          rl.duration,
          rl.category,
          rl.emotional_tone,
          rl.tier,
          COALESCE(rl.archetype[1], 'UNIVERSAL')::TEXT
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

    // 3. Add missing columns to users table
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS ritual_tier TEXT DEFAULT 'free',
      ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_bytes INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS last_ritual_completed TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS archetype TEXT,
      ADD COLUMN IF NOT EXISTS ux_stage TEXT DEFAULT 'welcome'
    `);

    // 4. Create ritual completion function
    await db.execute(sql`
      CREATE OR REPLACE FUNCTION complete_ritual(
        p_user_id TEXT, 
        p_ritual_id TEXT
      ) RETURNS JSONB AS $$
      DECLARE
        ritual_xp INTEGER;
        ritual_bytes INTEGER;
        result JSONB;
      BEGIN
        -- Get ritual rewards from ritual_library
        SELECT COALESCE(xp_reward, 15), COALESCE(bytes_reward, 25)
        INTO ritual_xp, ritual_bytes 
        FROM ritual_library 
        WHERE id = p_ritual_id;
        
        -- Mark ritual as completed
        UPDATE user_rituals 
        SET 
          completed_at = now(),
          is_current = false
        WHERE user_id = p_user_id AND ritual_id = p_ritual_id;
        
        -- Update user totals
        UPDATE users 
        SET 
          total_xp = COALESCE(total_xp, 0) + ritual_xp,
          total_bytes = COALESCE(total_bytes, 0) + ritual_bytes,
          last_ritual_completed = now()
        WHERE id = p_user_id;
        
        -- Create result
        result := jsonb_build_object(
          'success', true,
          'xp_earned', ritual_xp,
          'bytes_earned', ritual_bytes,
          'completed_at', now()
        );
        
        RETURN result;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 5. Create indexes for performance (only after columns exist)
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_user_rituals_user_current 
      ON user_rituals(user_id, is_current) WHERE is_current = true
    `);
      
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_user_rituals_completed 
      ON user_rituals(user_id, completed_at) WHERE completed_at IS NOT NULL
    `);
      
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_ritual_library_category 
      ON ritual_library(category)
    `);

    console.log('✅ Ritual system fix completed');

    return NextResponse.json({
      success: true,
      message: 'Ritual system database schema fixed',
      fixes: [
        'Added missing columns to ritual_library (xp_reward, archetype, action_type, etc.)',
        'Created get_next_ritual_for_user function with TEXT IDs',
        'Added missing columns to users table',
        'Created complete_ritual function',
        'Added performance indexes'
      ]
    });

  } catch (error) {
    console.error('❌ Ritual system fix error:', error);
    return NextResponse.json(
      { 
        error: 'Ritual system fix failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
