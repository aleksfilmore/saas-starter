// Quick database test script
import { db } from './lib/db/drizzle.js';
import { users } from './lib/db/schema.js';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const result = await db.select().from(users).limit(1);
    console.log('✅ Database connection successful');
    console.log('Users table sample:', result.length, 'records found');
    
    // Test user creation (dry run)
    console.log('✅ Schema import successful');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

testConnection();
