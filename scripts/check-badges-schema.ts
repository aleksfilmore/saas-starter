// Check actual database schema for badges table
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

async function checkBadgesSchema() {
  console.log('🔍 Checking badges table schema...');
  
  try {
    // Get table information
    const result = await db.execute(sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'badges' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Badges table columns:');
    result.forEach((row: any) => {
      console.log(`  ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
  } catch (error) {
    console.error('❌ Failed to check schema:', error);
  }
}

checkBadgesSchema();
