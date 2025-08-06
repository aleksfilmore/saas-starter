import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';
import bcrypt from 'bcryptjs';
import { users } from '../lib/db/minimal-schema';
import { eq } from 'drizzle-orm';

// Load environment variables
config({ path: '.env.local' });
config({ path: '.env' });

async function testPassword() {
  try {
    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error('POSTGRES_URL environment variable is required');
    }

    const client = postgres(connectionString);
    const db = drizzle(client, { schema: { users } });

    // Get the admin user
    const userResult = await db.select()
      .from(users)
      .where(eq(users.email, 'admin@ctrlaltblock.com'))
      .limit(1);

    const user = userResult[0];
    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('👤 User found:', user.email);
    console.log('🔑 Stored hash:', user.hashedPassword);

    // Test password
    const testPassword = 'admin123';
    const isValid = await bcrypt.compare(testPassword, user.hashedPassword);
    
    console.log('🧪 Testing password:', testPassword);
    console.log('✅ Password valid:', isValid);

    // Also test with wrong password
    const wrongPassword = 'wrongpass';
    const isWrong = await bcrypt.compare(wrongPassword, user.hashedPassword);
    console.log('🧪 Testing wrong password:', wrongPassword);
    console.log('❌ Wrong password (should be false):', isWrong);

    await client.end();
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testPassword();
