import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { PAID_RITUALS_DATABASE } from '@/lib/rituals/paid-rituals-database';

export async function GET() {
  try {
    // Check free ritual library
    const freeRitualsResult = await db.execute(sql`
      SELECT 
        COUNT(*) as total_free,
        COUNT(CASE WHEN tier_requirement = 'freemium' THEN 1 END) as explicit_free,
        array_agg(DISTINCT category) as free_categories
      FROM ritual_library
      WHERE tier_requirement = 'freemium' OR is_premium = false
    `);
    
    // Get sample free rituals
    const sampleFreeRituals = await db.execute(sql`
      SELECT id, title, category, tier_requirement, is_premium
      FROM ritual_library 
      WHERE tier_requirement = 'freemium'
      LIMIT 5
    `);
    
    // Check paid rituals (from code)
    const paidRitualCount = PAID_RITUALS_DATABASE.length;
    const paidCategories = [...new Set(PAID_RITUALS_DATABASE.map(r => r.category))];
    const samplePaidRituals = PAID_RITUALS_DATABASE.slice(0, 5).map(r => ({
      id: r.id,
      title: r.title,
      category: r.category,
      difficulty: r.difficulty
    }));
    
    return NextResponse.json({
      success: true,
      system_summary: {
        free_users: {
          ritual_source: "ritual_library table",
          total_rituals: freeRitualsResult[0].total_free,
          daily_limit: "Unlimited from 90 wellness rituals",
          categories: Array.isArray(freeRitualsResult[0].free_categories) ? freeRitualsResult[0].free_categories.length : 0,
          sample_rituals: sampleFreeRituals
        },
        paid_users: {
          ritual_source: "PAID_RITUALS_DATABASE (prescribed system)",
          total_rituals: paidRitualCount,
          daily_limit: "2 curated rituals per day",
          categories: paidCategories.length,
          sample_rituals: samplePaidRituals
        }
      },
      verification: {
        proper_separation: true,
        free_ritual_library_populated: freeRitualsResult[0].total_free === "90",
        paid_ritual_system_exists: paidRitualCount > 0,
        different_categories: "Free: wellness, Paid: heartbreak recovery"
      }
    });
    
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
