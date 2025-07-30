// Direct user creation test
import { db } from './lib/db/drizzle.js';
import { users } from './lib/db/schema.js';
import bcrypt from 'bcryptjs';
import { generateId } from 'lucia';

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('Password123', 12);
    const userId = generateId(15);
    
    const [newUser] = await db.insert(users).values({
      id: userId,
      email: 'test@debug.com',
      hashedPassword: hashedPassword,
    }).returning({ id: users.id, email: users.email });
    
    console.log('✅ Test user created:', newUser);
    process.exit(0);
  } catch (error) {
    console.error('❌ User creation failed:', error);
    process.exit(1);
  }
}

createTestUser();
