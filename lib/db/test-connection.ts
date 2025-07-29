import { db } from './drizzle';
import { users } from './schema';

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    
    // Try to query the users table
    const userCount = await db.select().from(users).limit(1);
    console.log('✅ Database connection successful');
    console.log(`Found ${userCount.length} user(s) in the database`);
    
    // Check if the users table has the correct structure
    const firstUser = userCount[0];
    if (firstUser) {
      console.log('User structure:', {
        id: firstUser.id,
        email: firstUser.email,
        hasPasswordField: 'hashedPassword' in firstUser,
        createdAt: firstUser.createdAt
      });
    } else {
      console.log('No users found in database');
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testDatabaseConnection();
