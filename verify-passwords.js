const postgres = require('postgres');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const sql = postgres(process.env.POSTGRES_URL || process.env.DATABASE_URL);

async function verifyPasswordHashes() {
  try {
    const users = await sql`SELECT id, email, password_hash FROM users WHERE email IN ('admin@system.com', 'firewall@test.com')`;
    
    console.log('=== PASSWORD HASH VERIFICATION ===');
    for (const user of users) {
      const testPassword = user.email === 'admin@system.com' ? 'password123' : 'testpassword123';
      const isValid = await bcrypt.compare(testPassword, user.password_hash);
      console.log(`✅ User ${user.email} (ID: ${user.id}): password hash valid = ${isValid}`);
      console.log(`   Expected password: ${testPassword}`);
      console.log(`   Hash: ${user.password_hash.substring(0, 30)}...`);
      console.log('');
    }
    
    await sql.end();
  } catch (error) {
    console.error('Error:', error.message);
    await sql.end();
  }
}

verifyPasswordHashes();
