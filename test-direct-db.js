console.log('Testing direct database connection...');

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testDirectDB() {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    console.log('Connected! Checking schema...');
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY column_name;
    `);
    
    console.log('Columns in users table:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type}`);
    });
    
    client.release();
    await pool.end();
    
    console.log('✅ Database test complete');
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });
testDirectDB();
