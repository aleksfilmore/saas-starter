// Check the actual database schema
const { neon } = require('@neondatabase/serverless');

require('dotenv').config({ path: '.env.local' });

async function checkSchema() {
  try {
    const sql = neon(process.env.POSTGRES_URL);
    
    console.log('🔧 Checking users table schema...');
    
    // Get table structure
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `;
    
    console.log('📋 Current users table columns:');
    console.table(columns);
    
    // Check if table exists at all
    const tableExists = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'users';
    `;
    
    console.log('\n🗃️  Users table exists:', tableExists.length > 0);
    
    if (tableExists.length === 0) {
      console.log('❌ Users table does not exist! You need to run migrations first.');
    }
    
  } catch (error) {
    console.error('❌ Error checking schema:', error);
  } finally {
    process.exit();
  }
}

checkSchema();
