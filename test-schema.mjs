import { db } from './lib/db/drizzle.js';

console.log('🔍 Testing schema import...');

try {
  console.log('✅ Schema import successful');
  console.log('Available tables in query:', Object.keys(db.query));
  
  // Test a simple query
  const testResult = await db.query.users.findFirst();
  console.log('✅ Database query test successful');
  
} catch (error) {
  console.log('❌ Schema test failed:', error.message);
  process.exit(1);
}
