const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

const client = postgres(process.env.POSTGRES_URL);
const db = drizzle(client);

async function getUser() {
  try {
    const result = await db.execute('SELECT id, email FROM users LIMIT 1');
    console.log('Test user:', result[0]);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

getUser();
