import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('🔍 Checking ritual_library table schema...');
    
    // Get table schema
    const schemaResult = await db.execute(sql`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'ritual_library'
      ORDER BY ordinal_position
    `);

    // Get sample data to see what's actually there
    const sampleResult = await db.execute(sql`
      SELECT * FROM ritual_library LIMIT 3
    `);

    return NextResponse.json({
      success: true,
      schema: schemaResult,
      sample_data: sampleResult
    });

  } catch (error) {
    console.error('❌ Schema inspection error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to inspect schema', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
