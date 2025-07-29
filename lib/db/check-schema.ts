import { db } from './drizzle';
import { sql } from 'drizzle-orm';

async function checkSchema() {
  try {
    console.log('Checking database schema...');
    
    // Check if users table exists and its structure
    const result = await db.execute(sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);
    
    console.log('Users table structure:');
    console.table(result);
    
    // Try to create a test user
    console.log('\nTesting user creation...');
    const testUser = {
      email: 'test@example.com',
      hashedPassword: '$argon2id$v=19$m=19456,t=2,p=1$test',
    };
    
    // Check if user already exists
    const existingUser = await db.execute(sql`SELECT id, email FROM users WHERE email = ${testUser.email}`);
    
    if (existingUser.length > 0) {
      console.log('Test user already exists:', existingUser[0]);
    } else {
      console.log('Creating test user...');
      const newUser = await db.execute(sql`
        INSERT INTO users (email, password_hash) 
        VALUES (${testUser.email}, ${testUser.hashedPassword}) 
        RETURNING id, email
      `);
      console.log('Test user created:', newUser[0]);
    }
    
  } catch (error) {
    console.error('Schema check failed:', error);
  }
}

checkSchema();
