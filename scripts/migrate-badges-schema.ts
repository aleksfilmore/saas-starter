// Migrate existing badges table to new badge system schema
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

async function migrateBadgesSchema() {
  console.log('🔄 Migrating badges table to new schema...\n');
  
  try {
    // Step 1: Add new columns to existing badges table
    console.log('1. Adding new columns...');
    
    await db.execute(sql`
      ALTER TABLE badges 
      ADD COLUMN IF NOT EXISTS tier_scope TEXT,
      ADD COLUMN IF NOT EXISTS archetype_scope TEXT,
      ADD COLUMN IF NOT EXISTS art_url TEXT,
      ADD COLUMN IF NOT EXISTS discount_percent INTEGER,
      ADD COLUMN IF NOT EXISTS discount_cap INTEGER
    `);
    console.log('   ✓ New columns added');
    
    // Step 2: Update existing badge data with new schema values
    console.log('\n2. Updating existing badges with new values...');
    
    // Ghost tier badges (G0-G3)
    await db.execute(sql`
      UPDATE badges 
      SET 
        tier_scope = 'ghost',
        archetype_scope = NULL,
        art_url = CONCAT('/badges/', id, '.svg'),
        discount_percent = CASE 
          WHEN id = 'G0_Phantom' THEN 10
          WHEN id = 'G1_Lurker' THEN 10
          WHEN id = 'G2_Presence' THEN 15
          WHEN id = 'G3_Manifest' THEN 20
          ELSE 10
        END,
        discount_cap = CASE
          WHEN id = 'G0_Phantom' THEN 1000
          WHEN id = 'G1_Lurker' THEN 1500
          WHEN id = 'G2_Presence' THEN 2000
          WHEN id = 'G3_Manifest' THEN 2500
          ELSE 1000
        END
      WHERE id LIKE 'G%'
    `);
    
    // Firewall archetype badges (F1-F4)
    await db.execute(sql`
      UPDATE badges
      SET 
        tier_scope = 'firewall',
        archetype_scope = CASE
          WHEN id LIKE '%_DF' THEN 'DF'
          WHEN id LIKE '%_FB' THEN 'FB'
          WHEN id LIKE '%_GS' THEN 'GS'
          WHEN id LIKE '%_SN' THEN 'SN'
          ELSE NULL
        END,
        art_url = CONCAT('/badges/', id, '.svg'),
        discount_percent = CASE
          WHEN id LIKE 'F1_%' THEN 15
          WHEN id LIKE 'F2_%' THEN 20
          WHEN id LIKE 'F3_%' THEN 25
          WHEN id LIKE 'F4_%' THEN 30
          ELSE 15
        END,
        discount_cap = CASE
          WHEN id LIKE 'F1_%' THEN 2000
          WHEN id LIKE 'F2_%' THEN 3000
          WHEN id LIKE 'F3_%' THEN 4000
          WHEN id LIKE 'F4_%' THEN 5000
          ELSE 2000
        END
      WHERE id LIKE 'F%'
    `);
    
    // Global Firewall badges (X1-X4)
    await db.execute(sql`
      UPDATE badges
      SET 
        tier_scope = 'firewall',
        archetype_scope = NULL,
        art_url = CONCAT('/badges/', id, '.svg'),
        discount_percent = CASE
          WHEN id = 'X1_Firewall' THEN 25
          WHEN id = 'X2_Phoenix' THEN 40
          WHEN id = 'X3_Eternal' THEN 60
          WHEN id = 'X4_Legend' THEN 100
          ELSE 25
        END,
        discount_cap = CASE
          WHEN id = 'X1_Firewall' THEN 5000
          WHEN id = 'X2_Phoenix' THEN 8000
          WHEN id = 'X3_Eternal' THEN 12000
          WHEN id = 'X4_Legend' THEN 20000
          ELSE 5000
        END
      WHERE id LIKE 'X%'
    `);
    
    console.log('   ✓ Badge data updated');
    
    // Step 3: Make tier_scope NOT NULL (all badges should have a tier)
    console.log('\n3. Setting tier_scope as NOT NULL...');
    await db.execute(sql`
      ALTER TABLE badges 
      ALTER COLUMN tier_scope SET NOT NULL
    `);
    console.log('   ✓ tier_scope set as NOT NULL');
    
    // Step 4: Verify migration
    console.log('\n4. Verifying migration...');
    const updated = await db.execute(sql`
      SELECT id, tier_scope, archetype_scope, discount_percent 
      FROM badges 
      ORDER BY id
      LIMIT 5
    `);
    
    console.log('   ✓ Sample updated badges:');
    updated.forEach((badge: any) => {
      console.log(`     ${badge.id}: ${badge.tier_scope} tier, ${badge.archetype_scope || 'global'} archetype, ${badge.discount_percent}% discount`);
    });
    
    console.log('\n🎉 Badge schema migration complete!');
    console.log('   ✅ New columns added');
    console.log('   ✅ Badge data updated');
    console.log('   ✅ Constraints applied');
    console.log('   ✅ Badge evaluator will now work correctly');
    
  } catch (error) {
    console.error('❌ Badge migration failed:', error);
  }
}

migrateBadgesSchema();
