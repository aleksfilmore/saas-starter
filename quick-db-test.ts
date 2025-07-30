// Quick test to see actual database connection and column status
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Try to query the users table to see current structure
    const result = await db.select().from(users).limit(1);
    console.log('Database connection successful!');
    console.log('Users table structure test passed');
    console.log('Sample result:', result);
    
  } catch (error) {
    console.error('Database error:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  }
}

testConnection();
