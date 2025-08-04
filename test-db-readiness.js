// Test database connection and auth readiness
import { db } from './lib/db/drizzle.js';
import { users } from './lib/db/minimal-schema.js';

async function testDbConnection() {
  try {
    console.log('🔧 Testing database connection...');
    
    // Test basic query
    const result = await db.select().from(users).limit(1);
    console.log('✅ Database connection successful!');
    console.log('📊 Users table accessible');
    console.log('👥 Current user count:', result.length);
    
    // Test environment variables
    console.log('\n🔐 Environment Check:');
    console.log('✅ POSTGRES_URL:', process.env.POSTGRES_URL ? 'Set' : '❌ Missing');
    console.log('✅ AUTH_SECRET:', process.env.AUTH_SECRET ? 'Set' : '❌ Missing');
    console.log('✅ NODE_ENV:', process.env.NODE_ENV);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testDbConnection();
