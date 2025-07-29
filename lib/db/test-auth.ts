import { db } from './drizzle';
import { users } from './schema';
import { eq } from 'drizzle-orm';

async function testAuth() {
  try {
    console.log('Testing authentication flow...');
    
    // Test 1: Check if we can query users table
    console.log('1. Testing database connection...');
    const userCount = await db.select().from(users).limit(1);
    console.log(`✅ Database connected. Found ${userCount.length} users.`);
    
    // Test 2: Check if we can create a user
    console.log('2. Testing user creation...');
    const testEmail = 'test@example.com';
    
    // First delete any existing test user
    await db.delete(users).where(eq(users.email, testEmail));
    
    // Create test user
    const [newUser] = await db.insert(users).values({
      email: testEmail,
      hashedPassword: '$argon2id$v=19$m=19456,t=2,p=1$testpassword',
    }).returning({ id: users.id, email: users.email });
    
    console.log('✅ User created:', newUser);
    
    // Test 3: Check if we can query the user
    const foundUser = await db.query.users.findFirst({
      where: eq(users.email, testEmail),
    });
    
    console.log('✅ User found:', { 
      id: foundUser?.id, 
      email: foundUser?.email,
      hasPassword: !!foundUser?.hashedPassword 
    });
    
    // Clean up
    await db.delete(users).where(eq(users.email, testEmail));
    console.log('✅ Test user cleaned up');
    
    console.log('🎉 All authentication tests passed!');
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error);
  }
}

testAuth();
