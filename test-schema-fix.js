// Test the schema fix
require('dotenv').config({ path: '.env.local' });

async function testSchemaFix() {
  console.log('🧪 Testing schema fix...');
  
  try {
    // Import the fixed drizzle configuration
    const { db } = require('./lib/db/drizzle');
    const { users } = require('./lib/db/actual-schema');
    
    console.log('✅ Drizzle import successful');
    
    // Test a simple query
    console.log('⏳ Testing simple query...');
    const result = await db.select().from(users).limit(1);
    console.log('✅ Query successful');
    console.log(`📊 Found ${result.length} user(s)`);
    
    if (result.length > 0) {
      console.log('👤 First user:', {
        id: result[0].id,
        email: result[0].email,
        tier: result[0].tier
      });
    }
    
    console.log('🎉 Schema fix working!');
    
  } catch (error) {
    console.error('❌ Schema fix failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testSchemaFix().then(() => process.exit(0)).catch(err => {
  console.error('💥 Test failed:', err);
  process.exit(1);
});
