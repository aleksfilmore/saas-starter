const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

const client = postgres(process.env.POSTGRES_URL);
const db = drizzle(client);

async function checkUser() {
  const result = await db.execute('SELECT id, email, tier FROM users WHERE email = \'firewall@test.com\'');
  console.log('Firewall user:', result[0]);
  
  // Also update the tier if needed
  if (result[0] && result[0].tier !== 'firewall') {
    await db.execute('UPDATE users SET tier = \'firewall\' WHERE email = \'firewall@test.com\'');
    console.log('✅ Updated tier to firewall');
  }
  
  await client.end();
}

checkUser();
