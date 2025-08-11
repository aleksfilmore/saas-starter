import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Creating missing database tables...');

    // Create daily_ritual_completions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS daily_ritual_completions (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        assignment_id INTEGER,
        ritual_id VARCHAR(100) NOT NULL,
        journal_text TEXT NOT NULL,
        mood_rating INTEGER,
        dwell_time_seconds INTEGER NOT NULL DEFAULT 0,
        word_count INTEGER NOT NULL DEFAULT 0,
        xp_earned INTEGER NOT NULL DEFAULT 0,
        bytes_earned INTEGER NOT NULL DEFAULT 0,
        completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      )
    `);

    console.log('✅ Created daily_ritual_completions table');

    // Create daily_ritual_assignments table if needed
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS daily_ritual_assignments (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        ritual_id VARCHAR(100) NOT NULL,
        assignment_date DATE NOT NULL DEFAULT CURRENT_DATE,
        is_completed BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      )
    `);

    console.log('✅ Created daily_ritual_assignments table');

    // Create indexes for performance
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_daily_ritual_completions_user_date 
      ON daily_ritual_completions(user_id, completed_at)
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_daily_ritual_assignments_user_date 
      ON daily_ritual_assignments(user_id, assignment_date)
    `);

    console.log('✅ Created indexes');

    return NextResponse.json({
      success: true,
      message: 'Missing tables created successfully',
      tables: [
        'daily_ritual_completions',
        'daily_ritual_assignments'
      ]
    });

  } catch (error) {
    console.error('❌ Error creating missing tables:', error);
    return NextResponse.json(
      { error: 'Failed to create tables', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
