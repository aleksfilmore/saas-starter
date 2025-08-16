import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';

async function fixUserBadgesTable() {
  console.log('🔧 Adding missing columns to user_badges table...');

  try {
    // Add the missing source_event column that the badge evaluator expects
    await db.execute(sql`
      ALTER TABLE user_badges 
      ADD COLUMN IF NOT EXISTS source_event TEXT NOT NULL DEFAULT 'manual',
      ADD COLUMN IF NOT EXISTS applied_as_profile BOOLEAN NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS discount_code_id TEXT
    `);
    
    console.log('✅ user_badges table updated successfully!');
    
    // Verify the columns were added
    const columns = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user_badges'
      ORDER BY ordinal_position
    `);
    
    console.log('\nuser_badges table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });

  } catch (error) {
    console.error('❌ Error updating user_badges table:', error);
    throw error;
  }
}

fixUserBadgesTable()
  .then(() => {
    console.log('\n🎉 user_badges table fix complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fix failed:', error);
    process.exit(1);
  });
