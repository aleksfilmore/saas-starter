// Check actual database schema
require('dotenv').config({ path: '.env.local' });
const postgres = require('postgres');

async function checkSchema() {
  try {
    const connectionString = process.env.POSTGRES_URL;
    const client = postgres(connectionString, {
      ssl: 'require',
      max: 1,
      idle_timeout: 20,
      connect_timeout: 15,
      onnotice: () => {},
      debug: false,
      prepare: false,
    });
    
    console.log('Checking users table schema...');
    
    // Get actual column names
    const columns = await client`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `;
    
    console.log('Actual columns in users table:');
    columns.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    await client.end();
  } catch (error) {
    console.error('Schema check failed:', error);
  }
}

checkSchema();
