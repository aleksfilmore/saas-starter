import { db } from './lib/db/drizzle';
import { users } from './lib/db/schema';
import bcrypt from 'bcryptjs';

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Create user
    const userId = crypto.randomUUID();
    await db.insert(users).values({
      id: userId,
      email: 'test@example.com',
      hashedPassword,
      username: 'test_user_123',
    });

    console.log('Test user created successfully:', userId);
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

createTestUser();
