import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';

async function checkBadgesTable() {
  console.log('🔍 Checking badges table structure...');

  try {
    const columns = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'badges'
      ORDER BY ordinal_position
    `);

    console.log('badges table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });

    console.log('\nChecking if code column exists...');
    const codeColumn = columns.find(col => col.column_name === 'code');
    console.log('Code column exists:', !!codeColumn);

    if (!codeColumn) {
      console.log('\n🔧 Adding missing code column to badges table...');
      await db.execute(sql`
        ALTER TABLE badges 
        ADD COLUMN IF NOT EXISTS code TEXT NOT NULL DEFAULT ''
      `);
      
      // Update existing badges to have their ID as their code
      await db.execute(sql`
        UPDATE badges SET code = id WHERE code = '' OR code IS NULL
      `);
      
      console.log('✅ Code column added and populated!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkBadgesTable().then(() => {
  console.log('\n🎉 Badge table check complete!');
  process.exit(0);
}).catch(console.error);
