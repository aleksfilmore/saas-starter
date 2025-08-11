// Simple Node.js test with direct PostgreSQL
require('dotenv').config({ path: '.env.local' });
const postgres = require('postgres');

async function testDrizzleInit() {
  console.log('🧪 Testing if Drizzle schema mismatch is resolved...');
  
  const connectionString = process.env.POSTGRES_URL;
  const client = postgres(connectionString, {
    ssl: 'require',
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    onnotice: () => {},
    debug: false,
    prepare: false,
  });
  
  try {
    // Test basic connection first
    await client`SELECT 1`;
    console.log('✅ Basic connection working');
    
    // Test users table query (this is what Drizzle would do)
    const users = await client`SELECT id, email, tier FROM users LIMIT 1`;
    console.log('✅ Users table query working');
    
    // Test sessions table query
    const sessions = await client`SELECT id, user_id FROM sessions LIMIT 1`;
    console.log('✅ Sessions table query working');
    
    console.log('🎉 All core schema queries working!');
    console.log('💡 The schema fix should resolve the Internal Server Error');
    
    await client.end();
    
  } catch (error) {
    console.error('❌ Schema test failed:', error.message);
  }
}

testDrizzleInit().then(() => process.exit(0)).catch(err => {
  console.error('💥 Test failed:', err);
  process.exit(1);
});
