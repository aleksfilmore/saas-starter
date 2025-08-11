import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

export const runtime = 'nodejs';

/**
 * GET /api/test-ritual-schema
 * Test that all column references work correctly
 */
export async function GET() {
  try {
    console.log('🧪 Testing ritual schema columns...');

    // Test ritual_library columns
    const ritualLibraryTest = await db.execute(sql`
      SELECT 
        id,
        title,
        description,
        steps,
        difficulty,
        xp_reward,
        bytes_reward,
        duration,
        category,
        emotional_tone,
        tier,
        archetype
      FROM ritual_library 
      LIMIT 1
    `);

    console.log('✅ ritual_library columns work');

    // Test rituals table columns
    const ritualsTest = await db.execute(sql`
      SELECT 
        id,
        title,
        description,
        steps,
        difficulty,
        xp_reward,
        bytes_reward,
        duration,
        category,
        emotional_tone,
        tier,
        archetype
      FROM rituals 
      LIMIT 1
    `);

    console.log('✅ rituals table columns work');

    // Test user_rituals columns
    const userRitualsTest = await db.execute(sql`
      SELECT 
        id,
        user_id,
        ritual_id,
        assigned_date,
        delivered_at,
        completed_at,
        is_current,
        rerolled,
        created_at
      FROM user_rituals 
      LIMIT 1
    `);

    console.log('✅ user_rituals table columns work');

    // Test daily_ritual_completions table
    const dailyCompletionsTest = await db.execute(sql`
      SELECT 
        id,
        user_id,
        ritual_id,
        completed_at,
        xp_earned,
        bytes_earned,
        streak_day,
        created_at
      FROM daily_ritual_completions 
      LIMIT 1
    `);

    console.log('✅ daily_ritual_completions table works');

    return NextResponse.json({
      success: true,
      message: 'All schema tests passed',
      tests: {
        ritual_library: ritualLibraryTest.length > 0 ? 'has_data' : 'empty',
        rituals: ritualsTest.length > 0 ? 'has_data' : 'empty', 
        user_rituals: userRitualsTest.length > 0 ? 'has_data' : 'empty',
        daily_ritual_completions: dailyCompletionsTest.length > 0 ? 'has_data' : 'empty'
      }
    });

  } catch (error) {
    console.error('❌ Schema test error:', error);
    return NextResponse.json(
      { 
        error: 'Schema test failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
