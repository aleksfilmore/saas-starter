import { db } from './lib/db/index.js';
import { sql } from 'drizzle-orm';

async function checkGhostBadges() {
  try {
    console.log('Checking existing Ghost badges...');
    
    const ghostBadges = await db.execute(sql`
      SELECT id, name, tier_scope, archetype_scope, discount_percent
      FROM badges 
      WHERE tier_scope = 'ghost' 
      ORDER BY id
    `);
    
    console.log('\nExisting Ghost badges:');
    ghostBadges.forEach(badge => {
      console.log(`${badge.id}: ${badge.name} (${badge.archetype_scope || 'cross-archetype'}) - ${badge.discount_percent || 0}% discount`);
    });
    
    // Check what's missing according to the spec
    const expectedGhostBadges = ['G0_DF', 'G0_FB', 'G0_GS', 'G0_SN', 'G1', 'G2', 'G3'];
    const existingIds = ghostBadges.map(b => b.id);
    const missing = expectedGhostBadges.filter(id => !existingIds.includes(id));
    
    console.log('\nMissing Ghost badges:', missing.length > 0 ? missing : 'None');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkGhostBadges();
