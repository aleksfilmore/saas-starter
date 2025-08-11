import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Adding missing columns to user_rituals table...');

    // Add missing columns to user_rituals table
    const missingColumns = [
      'delivered_at TIMESTAMP WITH TIME ZONE DEFAULT now()',
      'completed_at TIMESTAMP WITH TIME ZONE',
      'is_current BOOLEAN DEFAULT false',
      'rerolled BOOLEAN DEFAULT false'
    ];

    for (const column of missingColumns) {
      try {
        await db.execute(sql.raw(`ALTER TABLE user_rituals ADD COLUMN IF NOT EXISTS ${column}`));
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
      AND table_name = 'user_rituals'
      ORDER BY ordinal_position
    `);

    console.log('📋 Current user_rituals table schema:');
    schemaInfo.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });

    return NextResponse.json({
      success: true,
      message: 'Missing columns added to user_rituals table',
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
