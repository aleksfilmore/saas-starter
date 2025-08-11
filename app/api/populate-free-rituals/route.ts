import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { freeRitualBank } from '@/lib/data/free-ritual-bank';

export async function POST() {
  try {
    console.log('🔄 Creating ritual library and populating...');
    
    // Create ritual_library table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS ritual_library (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        duration TEXT,
        difficulty TEXT,
        journal_prompt TEXT,
        lesson TEXT,
        steps TEXT,
        archetype TEXT,
        tier_requirement TEXT,
        is_premium BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    console.log('✅ Ritual library table ready');
    
    // Alter steps column to TEXT if needed
    try {
      await db.execute(sql`ALTER TABLE ritual_library ALTER COLUMN steps TYPE TEXT`);
    } catch (error) {
      console.log('Steps column already TEXT or table structure correct');
    }
    
    // Clear existing free rituals
    await db.execute(sql`DELETE FROM ritual_library WHERE tier_requirement = 'freemium'`);
    
    // Insert all 90 free rituals
    let insertedCount = 0;
    for (const ritual of freeRitualBank) {
      try {
        await db.execute(sql`
          INSERT INTO ritual_library (
            id, title, category, description, duration, difficulty,
            journal_prompt, lesson, steps, archetype, tier_requirement,
            is_premium, is_active, created_at
          ) VALUES (
            ${ritual.id},
            ${ritual.title},
            ${ritual.category},
            ${ritual.description},
            ${ritual.duration},
            ${ritual.difficulty},
            ${ritual.journal_prompt},
            ${ritual.lesson},
            ${JSON.stringify(ritual.steps)},
            ${ritual.archetype},
            ${ritual.tier_requirement},
            FALSE,
            TRUE,
            NOW()
          )
        `);
        insertedCount++;
        console.log(`✓ Inserted: ${ritual.title}`);
      } catch (error) {
        console.log(`- Error inserting ${ritual.title}:`, error instanceof Error ? error.message : error);
      }
    }
    
    console.log(`✅ Inserted ${insertedCount}/${freeRitualBank.length} free rituals`);
    
    return NextResponse.json({
      success: true,
      message: `Free ritual library populated!`,
      total: freeRitualBank.length,
      inserted: insertedCount,
      categories: [...new Set(freeRitualBank.map(r => r.category))],
      sampleRituals: freeRitualBank.slice(0, 5).map(r => ({ 
        id: r.id, 
        title: r.title, 
        category: r.category 
      }))
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { error: `Failed to populate ritual library: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
