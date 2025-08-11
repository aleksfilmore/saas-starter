import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.execute(sql`
      SELECT COUNT(*) as total_count, 
             COUNT(CASE WHEN tier_requirement = 'freemium' THEN 1 END) as free_count,
             array_agg(DISTINCT category) as categories
      FROM ritual_library
    `);
    
    const rituals = await db.execute(sql`
      SELECT id, title, category, difficulty, duration 
      FROM ritual_library 
      WHERE tier_requirement = 'freemium' 
      LIMIT 10
    `);
    
    return NextResponse.json({
      success: true,
      stats: result[0],
      sample_rituals: rituals
    });
    
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
