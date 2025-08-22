const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

const sql = postgres(process.env.POSTGRES_URL || process.env.DATABASE_URL);

async function checkUsers() {
  try {
    const users = await sql`SELECT id, email, password_hash, is_active FROM users WHERE email IN ('admin@system.com', 'firewall@test.com')`;
    console.log('Users in database:');
    users.forEach(user => {
      console.log({
        id: user.id,
        email: user.email,
        password_hash: user.password_hash?.substring(0, 20) + '...',
        is_active: user.is_active
      });
    });
    await sql.end();
  } catch (error) {
    console.error('Error:', error);
    await sql.end();
  }
}

checkUsers();
