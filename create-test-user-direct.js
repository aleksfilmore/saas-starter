// Create a test user directly in the database with existing schema
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
    
    // Create test user with only existing columns
    await sql`
      INSERT INTO users (id, email, password_hash, archetype) 
      VALUES (${userId}, ${email}, ${hashedPassword}, 'secure')
    `;
    
    console.log('✅ Admin test user created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('🆔 User ID:', userId);
    
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
      INSERT INTO users (id, email, password_hash, archetype) 
      VALUES (${regularUserId}, ${regularEmail}, ${regularHashedPassword}, 'anxious')
    `;
    
    console.log('\n✅ Regular test user also created!');
    console.log('📧 Email:', regularEmail);
    console.log('🔑 Password:', regularPassword);
    console.log('🆔 User ID:', regularUserId);
    
    console.log('\n🚀 You can now log in with either set of credentials!');
    console.log('\n📝 Note: The database schema is minimal. You may need to run migrations for full functionality.');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    process.exit();
  }
}

createTestUser();
