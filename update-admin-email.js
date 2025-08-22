const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

const sql = postgres(process.env.POSTGRES_URL || process.env.DATABASE_URL);

async function updateUser() {
  try {
    const result = await sql`UPDATE users SET email = ${'admin@system.com'} WHERE email = ${'system_admin'}`;
    console.log('✅ Updated system_admin email to admin@system.com');
    
    // Verify the update
    const user = await sql`SELECT email, is_active FROM users WHERE email = 'admin@system.com'`;
    console.log('Updated user:', user[0]);
    
    await sql.end();
  } catch (error) {
    console.error('Error:', error);
    await sql.end();
  }
}

updateUser();
