import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

(async ()=>{
  try {
    const rows = await db.execute(sql`SELECT * FROM badges LIMIT 1`);
    console.log('Sample row:', rows[0]);
  } catch(e){
    console.error(e);
  }
})();
