// Test database schema to see what columns exist
import { db } from './lib/db/drizzle';

async function checkSchema() {
  try {
    console.log('Checking database schema...');
    
    // Check if we can query with the new columns
    const result = await db.execute(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY column_name;
    `);
    
    console.log('Columns in users table:');
    result.forEach((row: any) => {
      console.log(`- ${row.column_name}: ${row.data_type}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Schema check failed:', error);
    process.exit(1);
  }
}

checkSchema();
