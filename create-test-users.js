const postgres = require('postgres');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const sql = postgres(process.env.POSTGRES_URL || process.env.DATABASE_URL);

async function createTestUsers() {
  try {
    console.log('🔧 Creating test users...');
    
    // Hash passwords
    const systemAdminPassword = await bcrypt.hash('system_admin', 10);
    const firewallPassword = await bcrypt.hash('firewall123', 10);
    
    // Check if users already exist
    const existingUsers = await sql`
      SELECT email FROM users WHERE email IN ('system_admin', 'firewall@test.com')
    `;
    
    const existingEmails = existingUsers.map(user => user.email);
    
    // Create system_admin user if not exists
    if (!existingEmails.includes('system_admin')) {
      await sql`
        INSERT INTO users (
          email, password_hash, username, is_admin, is_active, email_verified,
          created_at, updated_at, subscription_tier, xp, level, streak, bytes
        ) VALUES (
          'system_admin', ${systemAdminPassword}, 'SystemAdmin', true, true, true,
          NOW(), NOW(), 'premium', 1000, 5, 10, 5000
        )
      `;
      console.log('✅ Created system_admin user');
    } else {
      console.log('✅ system_admin user already exists');
    }
    
    // Create firewall@test.com user if not exists
    if (!existingEmails.includes('firewall@test.com')) {
      await sql`
        INSERT INTO users (
          email, password_hash, username, is_admin, is_active, email_verified,
          created_at, updated_at, subscription_tier, xp, level, streak, bytes
        ) VALUES (
          'firewall@test.com', ${firewallPassword}, 'FirewallUser', false, true, true,
          NOW(), NOW(), 'free', 100, 1, 0, 100
        )
      `;
      console.log('✅ Created firewall@test.com user');
    } else {
      console.log('✅ firewall@test.com user already exists');
    }
    
    console.log('\n🎉 Test users setup completed!');
    console.log('📧 Login credentials:');
    console.log('  - Email: system_admin | Password: system_admin');
    console.log('  - Email: firewall@test.com | Password: firewall123');
    
  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await sql.end();
  }
}

createTestUsers();
