// Utility: print badges table columns so we can verify rarity/kind
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

(async ()=>{
  try {
    const cols = await db.execute(sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name='badges' ORDER BY ordinal_position`);
    console.log('Badges columns:');
    cols.forEach((c:any)=> console.log('-', c.column_name, c.data_type));
  } catch (e) {
    console.error('Failed to inspect badges table', e);
  }
})();
