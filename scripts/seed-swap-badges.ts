// Seed script: ensure ritual swap badges exist
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

// Actual badges columns (sample): id, name, description, icon_url, category, byte_reward, is_active, created_at,
// tier_scope, archetype_scope, art_url, discount_percent, discount_cap, code, share_template_id

async function ensureBadge(id: string, name: string, description: string, icon: string, discountPercent: number | null) {
  const existing = await db.execute(sql`SELECT id FROM badges WHERE id = ${id} LIMIT 1`);
  if (existing.length) {
    console.log(`Badge ${id} exists`);
    return;
  }
  await db.execute(sql`INSERT INTO badges (id, code, name, description, icon_url, category, byte_reward, is_active, created_at, tier_scope, archetype_scope, art_url, discount_percent, discount_cap)
    VALUES (${id}, ${id}, ${name}, ${description}, ${icon}, 'swap', 0, true, NOW(), 'firewall', NULL, ${icon}, ${discountPercent}, ${discountPercent ? 2000 : null})`);
  console.log(`Inserted badge ${id}`);
}

(async ()=>{
  try {
  await ensureBadge('F_SWAP_1','Adaptive Shift','Performed first ritual swap to optimize healing flow','🔁', null);
  await ensureBadge('F_SWAP_10','Strategic Reconstructor','Completed 10 ritual swaps demonstrating adaptive strategy','🧬', 15);
    console.log('Swap badges seeding complete');
  } catch (e) {
    console.error('Seed error', e);
  }
})();
