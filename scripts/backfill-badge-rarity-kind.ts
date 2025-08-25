// Backfill script: assign rarity & kind for legacy badges where null or default 'common'
// Strategy: map badge ids (or categories) to rarity/kind. Fallback to 'common'/'progression'.
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

// Define mapping rules (extend as needed)
const rarityById: Record<string,string> = {
  'F_SWAP_1': 'rare',
  'F_SWAP_10': 'legendary'
};

// Example category -> rarity mapping (adjust domain-specific logic)
const rarityByCategory: Record<string,string> = {
  'swap': 'rare',
  'streak': 'rare',
  'milestone': 'epic',
  'founder': 'legendary'
};

const kindById: Record<string,string> = {
  'F_SWAP_1': 'swap',
  'F_SWAP_10': 'swap'
};

const kindByCategory: Record<string,string> = {
  'swap': 'swap',
  'streak': 'progression',
  'milestone': 'progression',
  'founder': 'special'
};

async function ensureColumns() {
  // Safeguard: only proceed if columns exist
  const cols = await db.execute(sql`SELECT column_name FROM information_schema.columns WHERE table_name='badges' AND column_name IN ('rarity','kind')`);
  const have = new Set(cols.map((r:any)=>r.column_name));
  if(!have.has('rarity') || !have.has('kind')){
    console.error('badges.rarity or badges.kind missing — run migration first.');
    process.exit(1);
  }
}

async function backfill() {
  await ensureColumns();
  const rows = await db.execute(sql`SELECT id, category, rarity, kind FROM badges`);
  let updates = 0;
  for (const row of rows as any[]) {
    const currentRarity = row.rarity as string | null;
    const currentKind = row.kind as string | null;
    let desiredRarity = rarityById[row.id] || rarityByCategory[row.category] || 'common';
    let desiredKind = kindById[row.id] || kindByCategory[row.category] || 'progression';

    // If already set and not default placeholder, skip
    if ((currentRarity && currentRarity !== 'common' && currentRarity === desiredRarity) && (currentKind && currentKind === desiredKind)) continue;

    // Only update if changed
    if (currentRarity !== desiredRarity || currentKind !== desiredKind) {
      await db.execute(sql`UPDATE badges SET rarity = ${desiredRarity}, kind = ${desiredKind} WHERE id = ${row.id}`);
      updates++;
      console.log(`Updated ${row.id}: rarity=${desiredRarity} kind=${desiredKind}`);
    }
  }
  console.log(`Backfill complete. ${updates} badge(s) updated.`);
}

backfill().catch(e=>{ console.error('Backfill failed', e); process.exit(1); });
