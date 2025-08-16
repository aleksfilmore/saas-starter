const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

const client = postgres(process.env.POSTGRES_URL);
const db = drizzle(client);

async function checkBadge() {
  const result = await db.execute("SELECT id, name, icon_url, art_url FROM badges WHERE id = 'F1_DF'");
  console.log('F1_DF badge:', result[0]);
  await client.end();
}

checkBadge();
