import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function testAuth() {
  try {
    console.log('Testing auth system...');
    
    // Test database connection
    const testUsers = await db.select().from(users).limit(1);
    console.log('✅ Database connection works');
    
    // Test finding a user
    const testEmail = 'test@example.com';
    const user = await db.query.users.findFirst({
      where: eq(users.email, testEmail),
    });
    
    console.log('User query result:', user ? 'User found' : 'No user found');
    
  } catch (error) {
    console.error('❌ Auth test failed:', error);
  }
}

testAuth().then(() => {
  console.log('Test completed');
  process.exit(0);
}).catch(console.error);
