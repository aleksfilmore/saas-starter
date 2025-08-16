import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';

async function addAllMissingBadgeColumns() {
  console.log('🔧 Adding all missing columns to badges table...');

  try {
    // Add all columns that the badge evaluator schema expects
    await db.execute(sql`
      ALTER TABLE badges 
      ADD COLUMN IF NOT EXISTS share_template_id TEXT,
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true
    `);
    
    console.log('✅ All missing columns added to badges table!');
    
    // Verify the final structure
    const columns = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'badges'
      ORDER BY ordinal_position
    `);
    
    console.log('\nFinal badges table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });

  } catch (error) {
    console.error('❌ Error adding columns:', error);
    throw error;
  }
}

addAllMissingBadgeColumns()
  .then(() => {
    console.log('\n🎉 All badge columns added!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Failed:', error);
    process.exit(1);
  });
