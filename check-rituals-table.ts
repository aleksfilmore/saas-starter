import { db } from './lib/db';
import { sql } from 'drizzle-orm';

async function checkTables() {
  try {
    console.log('Checking rituals table structure...');
    
    const result = await db.execute(sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'rituals'
      ORDER BY ordinal_position;
    `);
    
    console.log('Rituals table columns:');
    console.log(result);
    
    console.log('\nChecking if rituals table exists...');
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'rituals'
      );
    `);
    
    console.log('Table exists:', tableExists);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkTables();
