const bcrypt = require('bcryptjs');
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

const client = postgres(process.env.POSTGRES_URL);
const db = drizzle(client);

async function setPassword() {
  try {
    const password = 'test123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.execute(`
      UPDATE users 
      SET password_hash = '${hashedPassword}'
      WHERE email = 'alex1@alex.com'
    `);
    
    console.log('✅ Password set to: test123');
    console.log('✅ Email: alex1@alex.com');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

setPassword();
