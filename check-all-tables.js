require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const databaseUrl = process.env.POSTGRES_URL;
const sql = neon(databaseUrl);

async function checkAllTables() {
  console.log('🔍 Checking all tables in database...');
  
  try {
    // Get all tables
    const tables = await sql`
      SELECT table_name, table_type
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log('📋 All tables in database:');
    tables.forEach(table => {
      console.log(`  - ${table.table_name} (${table.table_type})`);
    });
    
    // Look for ritual-related tables specifically
    const ritualTables = tables.filter(table => 
      table.table_name.includes('ritual') || 
      table.table_name.includes('completion') ||
      table.table_name.includes('progress')
    );
    
    console.log('\n🎯 Ritual-related tables:');
    ritualTables.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });
    
    // Check each ritual-related table for columns
    for (const table of ritualTables) {
      console.log(`\n📊 Columns in ${table.table_name}:`);
      const columns = await sql`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = ${table.table_name}
        ORDER BY ordinal_position;
      `;
      
      columns.forEach(col => {
        console.log(`    - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking database tables:', error);
  }
}

checkAllTables();
