import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function POST() {
  try {
    console.log('🔧 Fixing database columns...');
    
    // Add missing columns to users table
    const userColumns = [
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS archetype_details JSONB',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS ritual_streak INTEGER DEFAULT 0',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS no_contact_streak INTEGER DEFAULT 0',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS last_checkin TIMESTAMP WITH TIME ZONE',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS last_ritual TIMESTAMP WITH TIME ZONE',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT \'free\'',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_expires TIMESTAMP WITH TIME ZONE',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS tier VARCHAR(50) DEFAULT \'freemium\'',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS archetype VARCHAR(100)',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS bytes INTEGER DEFAULT 100',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1'
    ];
    
    for (const column of userColumns) {
      try {
        await db.execute(sql.raw(column));
        console.log('✅ Added column:', column.split('ADD COLUMN IF NOT EXISTS ')[1]);
      } catch (e) {
        console.log('Column exists or error:', String(e));
      }
    }
    
    // Add missing columns to rituals table
    const ritualColumns = [
      'ALTER TABLE rituals ADD COLUMN IF NOT EXISTS archetype VARCHAR(100)',
      'ALTER TABLE rituals ADD COLUMN IF NOT EXISTS difficulty VARCHAR(50)',
      'ALTER TABLE rituals ADD COLUMN IF NOT EXISTS steps JSONB'
    ];
    
    for (const column of ritualColumns) {
      try {
        await db.execute(sql.raw(column));
        console.log('✅ Added ritual column:', column.split('ADD COLUMN IF NOT EXISTS ')[1]);
      } catch (e) {
        console.log('Ritual column exists or error:', String(e));
      }
    }
    
    // Verify user_rituals table exists
    try {
      await db.execute(sql`SELECT 1 FROM user_rituals LIMIT 1`);
      console.log('✅ user_rituals table exists');
    } catch (e) {
      console.log('❌ user_rituals table missing, creating...');
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS user_rituals (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(id),
          ritual_id TEXT NOT NULL,
          assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
          completed_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
      console.log('✅ user_rituals table created');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database fixed comprehensively!'
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { error: 'Failed to fix database' },
      { status: 500 }
    );
  }
}
