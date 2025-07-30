// Quick test to check database connection and signin API
import { db } from './lib/db/drizzle';
import { users } from './lib/db/schema';

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const result = await db.select().from(users).limit(1);
    console.log('Database connection successful!');
    console.log('Users in database:', result.length);
    
    if (result.length > 0) {
      console.log('Sample user:', {
        id: result[0].id,
        email: result[0].email,
        hasPassword: !!result[0].hashedPassword
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

testDatabase();
