import { config } from 'dotenv';
import { db } from './lib/db/drizzle';
import { sql } from 'drizzle-orm';

config({ path: '.env.local' });

async function checkSchema() {
  try {
    // Get all tables
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📊 Existing tables:');
    for (const table of tables) {
      console.log(`  • ${table.table_name}`);
    }
    
    // Check users table structure
    if (tables.some(t => t.table_name === 'users')) {
      const userColumns = await db.execute(sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND table_schema = 'public'
      `);
      
      console.log('\n👤 Users table structure:');
      for (const col of userColumns) {
        console.log(`  • ${col.column_name}: ${col.data_type}`);
      }
    } else {
      console.log('\n❌ No users table found!');
    }
    
  } catch (error) {
    console.error('Error checking schema:', error);
  }
}

checkSchema().then(() => process.exit(0)).catch(() => process.exit(1));
