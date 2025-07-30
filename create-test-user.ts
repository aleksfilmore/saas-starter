import { db } from './lib/db/drizzle';
import { users } from './lib/db/schema';
import bcrypt from 'bcryptjs';
import { generateId } from 'lucia';

async function createTestUser() {
  try {
    console.log('🔍 Checking for existing users...');
    
    // Check if we can query the basic users table
    const existingUsers = await db.query.users.findMany({
      limit: 5
    });
    
    console.log(`📊 Found ${existingUsers.length} existing users`);
    
    if (existingUsers.length > 0) {
      console.log('👤 Existing users:');
      existingUsers.forEach(user => {
        console.log(`  - ${user.email} (ID: ${user.id})`);
      });
    }
    
    // Create a test user if none exist
    if (existingUsers.length === 0) {
      console.log('➕ Creating test user...');
      
      const hashedPassword = await bcrypt.hash('password123', 12);
      const userId = generateId(15);
      
      await db.insert(users).values({
        id: userId,
        email: 'test@example.com',
        hashedPassword: hashedPassword,
      });
      
      console.log('✅ Test user created: test@example.com / password123');
    } else {
      console.log('ℹ️  You can use any existing email with password "password123" if they were created through signup');
    }
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

createTestUser();
