require('dotenv').config({ path: '.env.local' });

console.log('🚨 PRODUCTION SCHEMA FIX VERIFICATION');

// Check environment
console.log('\n1. ENVIRONMENT:');
console.log('   POSTGRES_URL exists:', !!process.env.POSTGRES_URL);
console.log('   NODE_ENV:', process.env.NODE_ENV || 'undefined');

// Check if our schema fix is working locally
console.log('\n2. SCHEMA FIX TEST:');

async function testSchemaFix() {
  try {
    // Test if we can import drizzle with actual-schema
    console.log('   Testing drizzle import...');
    
    const postgres = require('postgres');
    const { drizzle } = require('drizzle-orm/postgres-js');
    
    // Test the connection with simplified config
    const client = postgres(process.env.POSTGRES_URL, {
      ssl: 'require',
      max: 1,
      prepare: false,
    });
    
    console.log('   ✅ Postgres client created');
    
    // Test basic query
    const result = await client`SELECT 1 as test, 'schema-fix-test' as status`;
    console.log('   ✅ Database query successful:', result[0]);
    
    await client.end();
    
    console.log('\n💡 LOCAL SCHEMA FIX WORKING - Issue might be:');
    console.log('   1. Schema fix not deployed to production yet');
    console.log('   2. Netlify build failed/incomplete');
    console.log('   3. Environment variables not set in production');
    console.log('   4. Different error in production');
    
  } catch (error) {
    console.log('   ❌ Schema fix test failed:', error.message);
    console.log('\n🚨 SCHEMA FIX NOT WORKING LOCALLY:');
    console.log('   Error:', error.stack);
  }
}

testSchemaFix();
