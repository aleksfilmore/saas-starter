const postgres = require('postgres');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const sql = postgres(process.env.POSTGRES_URL || process.env.DATABASE_URL);

async function recreateTestUsers() {
  try {
    // Delete existing test users
    await sql`DELETE FROM users WHERE email IN ('admin@system.com', 'firewall@test.com')`;
    console.log('✅ Deleted existing test users');

    // Create new users with proper passwords
    const adminPassword = 'password123';
    const firewallPassword = 'testpassword123';

    const adminHash = await bcrypt.hash(adminPassword, 10);
    const firewallHash = await bcrypt.hash(firewallPassword, 10);

    console.log('Creating new users with fresh password hashes...');

    // Insert new users
    await sql`
      INSERT INTO users (id, email, password_hash, is_active, created_at, updated_at)
      VALUES 
        ('admin-1', 'admin@system.com', ${adminHash}, true, NOW(), NOW()),
        ('firewall-1', 'firewall@test.com', ${firewallHash}, true, NOW(), NOW())
    `;

    console.log('✅ Created fresh test users');

    // Verify the passwords work
    const users = await sql`SELECT id, email, password_hash FROM users WHERE email IN ('admin@system.com', 'firewall@test.com')`;
    
    for (const user of users) {
      const testPassword = user.email === 'admin@system.com' ? adminPassword : firewallPassword;
      const isValid = await bcrypt.compare(testPassword, user.password_hash);
      console.log(`✅ User ${user.email}: password verification = ${isValid}`);
    }

    await sql.end();
  } catch (error) {
    console.error('Error:', error);
    await sql.end();
  }
}

recreateTestUsers();
