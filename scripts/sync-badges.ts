// Sync badges from badges.json to DB (upsert). Avoid emojis; uses internal icon keywords.
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

interface CatalogBadge {
  id: string; name: string; description: string; icon: string; rarity: string; kind: string;
  tierScope: string; archetypeScope: string | null; unlock?: string;
}

const file = path.join(process.cwd(), 'badges.json');
if(!fs.existsSync(file)) { console.error('badges.json missing'); process.exit(1); }
const catalog: CatalogBadge[] = JSON.parse(fs.readFileSync(file,'utf-8'));

async function ensureColumns(){
  const cols = await db.execute(sql`SELECT column_name FROM information_schema.columns WHERE table_name='badges'`);
  const have = new Set(cols.map((r:any)=>r.column_name));
  const needed = ['rarity','kind'];
  for(const col of needed){ if(!have.has(col)){ console.error(`Missing badges.${col}. Run migration.`); process.exit(1);} }
}

async function upsert(b: CatalogBadge){
  await db.execute(sql`INSERT INTO badges (id, code, name, description, icon_url, category, rarity, kind, tier_scope, archetype_scope, art_url, is_active)
    VALUES (${b.id}, ${b.id}, ${b.name}, ${b.description}, ${b.icon}, 'catalog', ${b.rarity}, ${b.kind}, ${b.tierScope}, ${b.archetypeScope}, ${b.icon}, true)
    ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, description=EXCLUDED.description, icon_url=EXCLUDED.icon_url,
      rarity=EXCLUDED.rarity, kind=EXCLUDED.kind, tier_scope=EXCLUDED.tier_scope, archetype_scope=EXCLUDED.archetype_scope, is_active=EXCLUDED.is_active`);
}

(async ()=>{
  await ensureColumns();
  let inserted=0, updated=0;
  for(const b of catalog){
    const existing = await db.execute(sql`SELECT name, rarity, kind, icon_url FROM badges WHERE id=${b.id}`);
    if(existing.length){ updated++; } else { inserted++; }
    await upsert(b);
    console.log(`${existing.length? 'Updated':'Inserted'} badge ${b.id}`);
  }
  console.log(`Sync complete. Inserted ${inserted}, Updated ${updated}.`);
})();
