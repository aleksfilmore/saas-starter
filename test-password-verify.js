const postgres = require('postgres');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const sql = postgres(process.env.POSTGRES_URL || process.env.DATABASE_URL);

async function updateUsers() {
  try {
    // Check current password_hash values
    const currentUsers = await sql`SELECT id, email, password_hash FROM users WHERE email IN ('admin@system.com', 'firewall@test.com')`;
    console.log('Current users before update:');
    currentUsers.forEach(user => {
      console.log({
        id: user.id,
        email: user.email,
        has_password_hash: !!user.password_hash
      });
    });

    // The database column is actually 'password_hash' (not 'hashedPassword')
    // So the data should already be there, let's verify it works
    console.log('\nTesting direct password verification...');
    
    for (const user of currentUsers) {
      const testPassword = user.email === 'admin@system.com' ? 'password123' : 'testpassword123';
      const isValid = await bcrypt.compare(testPassword, user.password_hash);
      console.log(`User ${user.email}: password valid = ${isValid}`);
    }

    await sql.end();
  } catch (error) {
    console.error('Error:', error);
    await sql.end();
  }
}

updateUsers();
