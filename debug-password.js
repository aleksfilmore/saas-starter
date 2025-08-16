const bcrypt = require('bcryptjs');
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

const client = postgres(process.env.POSTGRES_URL);
const db = drizzle(client);

async function debugPassword() {
  try {
    // Get current password hash
    const result = await db.execute(`
      SELECT email, password_hash FROM users WHERE email = 'firewall@test.com'
    `);
    
    console.log('Current user data:', result[0]);
    
    const currentHash = result[0]?.password_hash;
    
    // Test various passwords
    const testPasswords = ['firewall123', 'test123', 'password', 'firewall'];
    
    for (const password of testPasswords) {
      const matches = await bcrypt.compare(password, currentHash);
      console.log(`Password "${password}": ${matches ? '✅ MATCH' : '❌ NO MATCH'}`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

debugPassword();
