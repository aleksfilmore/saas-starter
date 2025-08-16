import { db } from './lib/db/index.js';
import { sql } from 'drizzle-orm';

async function checkSchema() {
  try {
    console.log('Checking badge table schema...');
    
    const schema = await db.execute(sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'badges' 
      ORDER BY ordinal_position
    `);
    
    console.log('Badge table columns:');
    schema.forEach(col => {
      console.log(`${col.column_name}: ${col.data_type} (${col.is_nullable === 'NO' ? 'NOT NULL' : 'nullable'})`);
    });
    
    // Check a few existing badges
    console.log('\nExisting badges:');
    const badges = await db.execute(sql`
      SELECT id, name, icon_url, tier_scope, archetype_scope 
      FROM badges 
      LIMIT 5
    `);
    
    badges.forEach(badge => {
      console.log(`${badge.id}: ${badge.name} (tier: ${badge.tier_scope}, archetype: ${badge.archetype_scope})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkSchema();
