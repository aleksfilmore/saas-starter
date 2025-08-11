import { db } from './lib/db/index.ts';
import { sql } from 'drizzle-orm';

async function fixDatabase() {
  try {
    console.log('🔧 Fixing database columns...');
    
    // Add missing columns
    await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS archetype_details JSONB`);
    console.log('✅ Added archetype_details column');
    
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
    
    console.log('🎉 Database fixed!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixDatabase().then(() => process.exit(0));
