// Direct database and auth test
import { db } from './lib/db/drizzle.js';
import { users } from './lib/db/schema.js';
import { eq } from 'drizzle-orm';

async function testDirectAuth() {
  try {
    console.log('🧪 Testing Direct Authentication System...\n');
    
    // Test 1: Database Connection
    console.log('1️⃣ Testing Database Connection...');
    const userCount = await db.select().from(users).limit(1);
    console.log('✅ Database: CONNECTED\n');
    
    // Test 2: User Creation (simulate API logic)
    console.log('2️⃣ Testing User Creation Logic...');
    const bcrypt = await import('bcryptjs');
    const { generateId } = await import('lucia');
    
    const testEmail = `direct-test-${Date.now()}@example.com`;
    const hashedPassword = await bcrypt.hash('Test123456', 12);
    const userId = generateId(15);
    
    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, testEmail),
    });
    
    if (!existingUser) {
      // Create user
      const [newUser] = await db.insert(users).values({
        id: userId,
        email: testEmail,
        hashedPassword: hashedPassword,
      }).returning({ id: users.id, email: users.email });
      
      console.log('✅ User Creation:', newUser);
    }
    
    // Test 3: User Authentication (simulate login API logic)
    console.log('3️⃣ Testing Authentication Logic...');
    const user = await db.query.users.findFirst({
      where: eq(users.email, testEmail),
    });
    
    if (user && user.hashedPassword) {
      const validPassword = await bcrypt.compare('Test123456', user.hashedPassword);
      if (validPassword) {
        console.log('✅ Password Verification: SUCCESS');
        
        // Test 4: Session Creation
        console.log('4️⃣ Testing Session Creation...');
        const { lucia } = await import('./lib/auth/index.js');
        const session = await lucia.createSession(user.id, {});
        console.log('✅ Session Creation: SUCCESS');
        console.log('Session ID:', session.id);
        
        // Cleanup
        await lucia.invalidateSession(session.id);
        await db.delete(users).where(eq(users.id, user.id));
        console.log('✅ Cleanup: COMPLETE\n');
        
        console.log('🎉 AUTHENTICATION SYSTEM: FULLY FUNCTIONAL!');
        console.log('📊 All core components working:');
        console.log('   ✅ Database connection');
        console.log('   ✅ User creation with bcrypt');
        console.log('   ✅ Password verification');
        console.log('   ✅ Lucia session management');
        
      } else {
        console.log('❌ Password Verification: FAILED');
      }
    } else {
      console.log('❌ User Lookup: FAILED');
    }
    
  } catch (error) {
    console.error('🚨 Test Error:', error);
  }
}

testDirectAuth();
