import { db } from './lib/db/drizzle';
import { users } from './lib/db/schema';

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection and users table...');
    
    // Try to query users table
    const userCount = await db.$count(users);
    console.log(`📊 Found ${userCount} users in database`);
    
    // Try to query a user to see current schema
    const firstUser = await db.query.users.findFirst();
    if (firstUser) {
      console.log('👤 Sample user structure:', Object.keys(firstUser));
    } else {
      console.log('👤 No users found in database');
    }
    
  } catch (error: any) {
    console.error('❌ Database error:', error.message);
    
    if (error.message.includes('username')) {
      console.log('🔧 Username column missing - migration needed');
    }
  }
}

checkDatabase();
