import { NextRequest, NextResponse } from 'next/server';
import { seedDailyInsights } from '@/lib/db/seed-daily-insights';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const success = await seedDailyInsights();
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Daily insights seeded successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to seed insights'
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Get a daily insight based on current date for consistency
    const { db } = await import('@/lib/db/drizzle');
    const { sql } = await import('drizzle-orm');
    
    // Use current date as seed for consistent daily insight
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    const result = await db.execute(sql`
      SELECT text, category
      FROM daily_insights 
      ORDER BY id
      LIMIT 1 OFFSET ${dayOfYear % 65}
    `);
    
    if (result.length > 0) {
      return NextResponse.json({
        success: true,
        insight: result[0]
      });
    } else {
      return NextResponse.json({
        success: true,
        insight: {
          text: "The fact that you're here shows incredible courage and self-awareness.",
          category: "motivation"
        }
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
