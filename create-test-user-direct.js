// Create a test user directly in the database
const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config({ path: '.env.local' });

async function createTestUser() {
  try {
    console.log('🔧 Creating test user in database...');
    
    const sql = neon(process.env.POSTGRES_URL);
    
    const userId = uuidv4();
    const email = 'admin@ctrlaltblock.com';
    const password = 'TestPassword123!';
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email} LIMIT 1
    `;
    
    if (existingUser.length > 0) {
      console.log('ℹ️  User already exists, deleting and recreating...');
      await sql`DELETE FROM users WHERE email = ${email}`;
    }
    
    // Create test user with direct SQL
    await sql`
      INSERT INTO users (
        id, email, password_hash, username, is_admin, onboarding_completed,
        xp_points, byte_balance, glow_up_level, xp, level, bytes, 
        streak, longest_streak, no_contact_days, ux_stage,
        created_at, updated_at
      ) VALUES (
        ${userId}, ${email}, ${hashedPassword}, 'admin_user', true, true,
        1000, 500, 5, 1000, 5, 500,
        10, 10, 30, 'system_admin',
        NOW(), NOW()
      )
    `;
    
    console.log('✅ Test user created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('🆔 User ID:', userId);
    console.log('\n🚀 You can now log in with these credentials!');
    
    // Also create a regular test user
    const regularUserId = uuidv4();
    const regularEmail = 'test@ctrlaltblock.com';
    const regularPassword = 'Test123!';
    const regularHashedPassword = await bcrypt.hash(regularPassword, saltRounds);
    
    const existingRegularUser = await sql`
      SELECT id FROM users WHERE email = ${regularEmail} LIMIT 1
    `;
    
    if (existingRegularUser.length > 0) {
      await sql`DELETE FROM users WHERE email = ${regularEmail}`;
    }
    
    await sql`
      INSERT INTO users (
        id, email, password_hash, username, is_admin, onboarding_completed,
        xp_points, byte_balance, glow_up_level, xp, level, bytes, 
        streak, longest_streak, no_contact_days, ux_stage,
        created_at, updated_at
      ) VALUES (
        ${regularUserId}, ${regularEmail}, ${regularHashedPassword}, 'test_user', false, false,
        100, 50, 1, 100, 1, 50,
        1, 1, 3, 'newcomer',
        NOW(), NOW()
      )
    `;
    
    console.log('\n✅ Regular test user also created!');
    console.log('📧 Email:', regularEmail);
    console.log('🔑 Password:', regularPassword);
    console.log('🆔 User ID:', regularUserId);
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    process.exit();
  }
}

createTestUser();
