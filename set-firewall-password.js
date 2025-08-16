const bcrypt = require('bcryptjs');
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

const client = postgres(process.env.POSTGRES_URL);
const db = drizzle(client);

async function setFirewallPassword() {
  try {
    const password = 'firewall123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.execute(`
      UPDATE users 
      SET password_hash = '${hashedPassword}'
      WHERE email = 'firewall@test.com'
    `);
    
    console.log('✅ Password set for firewall@test.com');
    console.log('📧 Email: firewall@test.com');
    console.log('🔑 Password: firewall123');
    
    // Also check current user data
    const result = await db.execute(`
      SELECT id, email, tier, ritual_streak, no_contact_streak, xp, level
      FROM users WHERE email = 'firewall@test.com'
    `);
    
    console.log('Current user data:', result[0]);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

setFirewallPassword();
