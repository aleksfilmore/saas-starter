// Test database connection and username check
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Use the same connection string as the app
    const connectionString = process.env.POSTGRES_URL;
    
    if (!connectionString) {
      console.error('POSTGRES_URL not found in environment');
      return;
    }
    
    console.log('Connecting to database...');
    const client = postgres(connectionString, {
      ssl: 'require',
      max: 1,
      idle_timeout: 20,
      connect_timeout: 15,
      onnotice: () => {},
      debug: false,
      prepare: false,
    });
    
    // Test basic connection
    const result = await client`SELECT 1 as test`;
    console.log('Database connection successful:', result);
    
    // Test users table exists
    const tableCheck = await client`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `;
    console.log('Users table check:', tableCheck);
    
    // Test username column exists
    const columnCheck = await client`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'username'
    `;
    console.log('Username column check:', columnCheck);
    
    // Test simple username query
    const usernameTest = await client`
      SELECT username FROM users WHERE username = 'test_nonexistent_user' LIMIT 1
    `;
    console.log('Username query test (should be empty):', usernameTest);
    
    await client.end();
    console.log('Test completed successfully');
    
  } catch (error) {
    console.error('Database test failed:', error);
  }
}

testDatabase();
