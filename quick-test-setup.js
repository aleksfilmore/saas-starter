/**
 * Quick setup script to create a test user for debugging
 * Run with: node quick-test-setup.js
 */

const bcrypt = require('bcryptjs');
const { drizzle } = require('drizzle-orm/postgres-js');
const { eq } = require('drizzle-orm');
const postgres = require('postgres');

// Schema imports
const { users } = require('./lib/db/schema.ts');

async function createTestUser() {
  console.log('🔧 Setting up test user for debugging...');
  
  // Database connection
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ DATABASE_URL not found in environment');
    process.exit(1);
  }

  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);

  try {
    const testEmail = 'test@ctrlaltblock.com';
    const testPassword = 'password123';

    // Check if test user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, testEmail))
      .limit(1);

    if (existingUser.length > 0) {
      console.log('✅ Test user already exists');
      console.log('📧 Email:', testEmail);
      console.log('🔑 Password:', testPassword);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(testPassword, 12);

    // Create test user
    const userId = `test_${Date.now()}`;
    await db.insert(users).values({
      id: userId,
      email: testEmail,
      hashedPassword,
      username: 'test_user',
      tier: 'free',
      isEmailVerified: true,
      isOnboardingCompleted: true,
      emotionalArchetype: 'Digital Detoxer',
      xp: 150,
      level: 2,
      bytes: 75,
      streak: 5,
      noContactDays: 12,
      createdAt: new Date(),
    });

    console.log('✅ Test user created successfully!');
    console.log('📧 Email:', testEmail);
    console.log('🔑 Password:', testPassword);
    console.log('🆔 User ID:', userId);
    console.log('');
    console.log('🎯 Now you can:');
    console.log('1. Visit http://localhost:3001/sign-in');
    console.log('2. Sign in with the credentials above');
    console.log('3. Test the progress and wall pages');

  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await sql.end();
  }
}

if (require.main === module) {
  createTestUser()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('💥 Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { createTestUser };
