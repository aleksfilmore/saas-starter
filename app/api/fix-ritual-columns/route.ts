import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Adding missing columns to rituals table...');

    // Add missing columns to rituals table
    const missingColumns = [
      'emotional_tone TEXT',
      'tier TEXT', 
      'steps JSONB',
      'difficulty TEXT',
      'archetype TEXT'
    ];

    for (const column of missingColumns) {
      try {
        await db.execute(sql.raw(`ALTER TABLE rituals ADD COLUMN IF NOT EXISTS ${column}`));
        console.log(`✅ Added column: ${column}`);
      } catch (error) {
        console.log(`⚠️ Column might already exist: ${column}`);
      }
    }

    // Check current schema
    const schemaInfo = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'rituals'
      ORDER BY ordinal_position
    `);

    console.log('📋 Current rituals table schema:');
    schemaInfo.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });

    return NextResponse.json({
      success: true,
      message: 'Missing columns added to rituals table',
      schema: schemaInfo.map(col => ({
        name: col.column_name,
        type: col.data_type
      }))
    });

  } catch (error) {
    console.error('❌ Error adding missing columns:', error);
    return NextResponse.json(
      { error: 'Failed to add columns', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
