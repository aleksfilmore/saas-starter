const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

const client = postgres(process.env.POSTGRES_URL);
const db = drizzle(client);

async function checkColumns() {
  try {
    const result = await db.execute(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name LIKE '%password%'
    `);
    
    console.log('Password columns:', result);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkColumns();
