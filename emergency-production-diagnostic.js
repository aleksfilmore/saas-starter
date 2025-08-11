// Emergency production diagnostic - check if schema fix is deployed
console.log('🚨 PRODUCTION DIAGNOSTIC - Schema Fix Deployment Check');

// Test 1: Environment variables
console.log('\n1. ENVIRONMENT CHECK:');
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   POSTGRES_URL exists:', !!process.env.POSTGRES_URL);
console.log('   AUTH_SECRET exists:', !!process.env.AUTH_SECRET);

// Test 2: Schema import check
console.log('\n2. SCHEMA IMPORT CHECK:');
try {
  const { db } = require('./lib/db/drizzle');
  console.log('   ✅ Drizzle import successful');
  
  // Check which schema is being used
  const schemaCheck = require('./lib/db/actual-schema');
  console.log('   ✅ actual-schema import successful');
  console.log('   Schema users table exists:', !!schemaCheck.users);
  console.log('   Schema sessions table exists:', !!schemaCheck.sessions);
  
} catch (error) {
  console.log('   ❌ Schema import failed:', error.message);
}

// Test 3: Database connection test
console.log('\n3. DATABASE CONNECTION TEST:');
async function testConnection() {
  try {
    const postgres = require('postgres');
    const client = postgres(process.env.POSTGRES_URL, {
      ssl: 'require',
      max: 1,
      prepare: false,
    });
    
    const result = await client`SELECT 1 as test`;
    console.log('   ✅ Direct postgres connection successful');
    await client.end();
  } catch (error) {
    console.log('   ❌ Direct postgres connection failed:', error.message);
  }
}

testConnection().then(() => {
  console.log('\n🔍 DIAGNOSTIC COMPLETE - Check if schema fix is deployed to production');
  console.log('💡 If schema import fails, the schema mismatch fix needs to be deployed');
  process.exit(0);
});
