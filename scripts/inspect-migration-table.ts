import 'dotenv/config';
import postgres from 'postgres';

(async () => {
  const url = process.env.POSTGRES_URL;
  if(!url){
    console.error('POSTGRES_URL not set');
    process.exit(1);
  }
  const sql = postgres(url, { ssl: { rejectUnauthorized: false }, max:1 });
  try {
    const cols = await sql`select column_name, data_type from information_schema.columns where table_schema='drizzle' and table_name='__drizzle_migrations' order by ordinal_position`;
    console.log('Migration table columns:', cols);
    const rows = await sql`select * from drizzle.__drizzle_migrations order by 1`;
    console.log('First rows:', rows);
  } catch (e) {
    console.error('Error querying migration table', e);
  } finally {
    await sql.end();
  }
})();
