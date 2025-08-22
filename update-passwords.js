const postgres = require('postgres');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const sql = postgres(process.env.POSTGRES_URL || process.env.DATABASE_URL);

async function updatePasswords() {
  try {
    // Create new password hashes
    const adminPassword = 'password123';
    const firewallPassword = 'testpassword123';

    const adminHash = await bcrypt.hash(adminPassword, 10);
    const firewallHash = await bcrypt.hash(firewallPassword, 10);

    console.log('Updating passwords for existing users...');

    // Update admin user
    await sql`UPDATE users SET password_hash = ${adminHash} WHERE email = 'admin@system.com'`;
    console.log('✅ Updated admin@system.com password');

    // Update firewall user
    await sql`UPDATE users SET password_hash = ${firewallHash} WHERE email = 'firewall@test.com'`;
    console.log('✅ Updated firewall@test.com password');

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

updatePasswords();
