// CTRL+ALT+BLOCK™ Badge Definitions Seeder
// Populates the badges table with all badge definitions

import { db } from '@/lib/db/drizzle';
import { badges } from '@/lib/db/badges-schema';
import { sql } from 'drizzle-orm';

const BADGE_DEFINITIONS = [
  // Ghost Tier Badges (Available to all users)
  {
    id: 'G0_Phantom',
    code: 'G0_Phantom',
    name: 'Phantom Protocol',
    description: 'First steps into the system - welcome to CTRL+ALT+BLOCK™',
    tierScope: 'ghost',
    archetypeScope: null,
    artUrl: '/badges/g0-phantom.svg',
    discountPercent: 10,
    discountCap: 1000
  },
  {
    id: 'G1_Lurker',
    code: 'G1_Lurker', 
    name: 'Digital Lurker',
    description: 'Consistent daily presence - the system notices you',
    tierScope: 'ghost',
    archetypeScope: null,
    artUrl: '/badges/g1-lurker.svg',
    discountPercent: 10,
    discountCap: 1500
  },
  {
    id: 'G2_Presence',
    code: 'G2_Presence',
    name: 'Manifest Presence', 
    description: 'Regular ritual completion - your influence grows',
    tierScope: 'ghost',
    archetypeScope: null,
    artUrl: '/badges/g2-presence.svg',
    discountPercent: 15,
    discountCap: 2000
  },
  {
    id: 'G3_Manifest',
    code: 'G3_Manifest',
    name: 'Full Manifestation',
    description: 'Deep system integration - maximum Ghost tier achievement',
    tierScope: 'ghost',
    archetypeScope: null,
    artUrl: '/badges/g3-manifest.svg',
    discountPercent: 20,
    discountCap: 2500
  },

  // Data Flooder (DF) Archetype Badges
  {
    id: 'F1_DF',
    code: 'F1_DF',
    name: 'Stream Stabilized',
    description: 'Data flow patterns established - your overflow is controlled',
    tierScope: 'firewall',
    archetypeScope: 'DF',
    artUrl: '/badges/f1-df.svg',
    discountPercent: 15,
    discountCap: 2000
  },
  {
    id: 'F2_DF',
    code: 'F2_DF',
    name: 'Signal Tuner',
    description: 'Ritual mastery achieved - fine-tuning the data streams',
    tierScope: 'firewall',
    archetypeScope: 'DF',
    artUrl: '/badges/f2-df.svg',
    discountPercent: 20,
    discountCap: 3000
  },
  {
    id: 'F3_DF',
    code: 'F3_DF',
    name: 'Stream Navigator',
    description: 'Wall engagement master - guiding others through the flow',
    tierScope: 'firewall',
    archetypeScope: 'DF',
    artUrl: '/badges/f3-df.svg',
    discountPercent: 25,
    discountCap: 4000
  },
  {
    id: 'F4_DF',
    code: 'F4_DF',
    name: 'Data Sage',
    description: 'AI therapy integration - wisdom flows through digital streams',
    tierScope: 'firewall',
    archetypeScope: 'DF',
    artUrl: '/badges/f4-df.svg',
    discountPercent: 30,
    discountCap: 5000
  },

  // Firewall Builder (FB) Archetype Badges
  {
    id: 'F1_FB',
    code: 'F1_FB',
    name: 'Barrier Synchronized',
    description: 'Defensive patterns active - your firewall is online',
    tierScope: 'firewall',
    archetypeScope: 'FB',
    artUrl: '/badges/f1-fb.svg',
    discountPercent: 15,
    discountCap: 2000
  },
  {
    id: 'F2_FB',
    code: 'F2_FB',
    name: 'Protocol Tuner',
    description: 'Security mastery achieved - fine-tuning protective barriers',
    tierScope: 'firewall',
    archetypeScope: 'FB',
    artUrl: '/badges/f2-fb.svg',
    discountPercent: 20,
    discountCap: 3000
  },
  {
    id: 'F3_FB',
    code: 'F3_FB',
    name: 'Barrier Navigator',
    description: 'Wall engagement expert - helping others build defenses',
    tierScope: 'firewall',
    archetypeScope: 'FB',
    artUrl: '/badges/f3-fb.svg',
    discountPercent: 25,
    discountCap: 4000
  },
  {
    id: 'F4_FB',
    code: 'F4_FB',
    name: 'Firewall Sage',
    description: 'AI therapy breakthrough - barriers protect while healing flows',
    tierScope: 'firewall',
    archetypeScope: 'FB',
    artUrl: '/badges/f4-fb.svg',
    discountPercent: 30,
    discountCap: 5000
  },

  // Ghost in the Shell (GS) Archetype Badges
  {
    id: 'F1_GS',
    code: 'F1_GS',
    name: 'Echo Stabilized',
    description: 'Phantom presence confirmed - you exist between the lines',
    tierScope: 'firewall',
    archetypeScope: 'GS',
    artUrl: '/badges/f1-gs.svg',
    discountPercent: 15,
    discountCap: 2000
  },
  {
    id: 'F2_GS',
    code: 'F2_GS',
    name: 'Echo Tuner',
    description: 'Invisibility mastery - fine-tuning your spectral influence',
    tierScope: 'firewall',
    archetypeScope: 'GS',
    artUrl: '/badges/f2-gs.svg',
    discountPercent: 20,
    discountCap: 3000
  },
  {
    id: 'F3_GS',
    code: 'F3_GS',
    name: 'Echo Navigator',
    description: 'Wall phase-walking - guiding others through digital shadows',
    tierScope: 'firewall',
    archetypeScope: 'GS',
    artUrl: '/badges/f3-gs.svg',
    discountPercent: 25,
    discountCap: 4000
  },
  {
    id: 'F4_GS',
    code: 'F4_GS',
    name: 'Ghost Sage',
    description: 'AI therapy transcendence - healing through ethereal connection',
    tierScope: 'firewall',
    archetypeScope: 'GS',
    artUrl: '/badges/f4-gs.svg',
    discountPercent: 30,
    discountCap: 5000
  },

  // Secure Node (SN) Archetype Badges
  {
    id: 'F1_SN',
    code: 'F1_SN',
    name: 'Node Synchronized',
    description: 'Encrypted pathways active - your connection is secure',
    tierScope: 'firewall',
    archetypeScope: 'SN',
    artUrl: '/badges/f1-sn.svg',
    discountPercent: 15,
    discountCap: 2000
  },
  {
    id: 'F2_SN',
    code: 'F2_SN',
    name: 'Node Tuner',
    description: 'Network mastery achieved - fine-tuning secure connections',
    tierScope: 'firewall',
    archetypeScope: 'SN',
    artUrl: '/badges/f2-sn.svg',
    discountPercent: 20,
    discountCap: 3000
  },
  {
    id: 'F3_SN',
    code: 'F3_SN',
    name: 'Node Navigator',
    description: 'Wall encryption specialist - securing the community network',
    tierScope: 'firewall',
    archetypeScope: 'SN',
    artUrl: '/badges/f3-sn.svg',
    discountPercent: 25,
    discountCap: 4000
  },
  {
    id: 'F4_SN',
    code: 'F4_SN',
    name: 'Secure Sage',
    description: 'AI therapy encryption - healing through protected channels',
    tierScope: 'firewall',
    archetypeScope: 'SN',
    artUrl: '/badges/f4-sn.svg',
    discountPercent: 30,
    discountCap: 5000
  },

  // Global Firewall Badges (X-Series)
  {
    id: 'X1_Firewall',
    code: 'X1_Firewall',
    name: 'Firewall Initiate',
    description: 'First steps beyond the Ghost tier - premium access unlocked',
    tierScope: 'firewall',
    archetypeScope: null,
    artUrl: '/badges/x1-firewall.svg',
    discountPercent: 25,
    discountCap: 5000
  },
  {
    id: 'X2_Phoenix',
    code: 'X2_Phoenix',
    name: 'Phoenix Protocol',
    description: 'Rebirth through streaks - rising from digital ashes',
    tierScope: 'firewall',
    archetypeScope: null,
    artUrl: '/badges/x2-phoenix.svg',
    discountPercent: 40,
    discountCap: 8000
  },
  {
    id: 'X3_Eternal',
    code: 'X3_Eternal',
    name: 'Eternal Node',
    description: 'Transcendent achievement - beyond normal limitations',
    tierScope: 'firewall',
    archetypeScope: null,
    artUrl: '/badges/x3-eternal.svg',
    discountPercent: 60,
    discountCap: 12000
  },
  {
    id: 'X4_Legend',
    code: 'X4_Legend',
    name: 'System Legend',
    description: 'Maximum achievement - true mastery of CTRL+ALT+BLOCK™',
    tierScope: 'firewall',
    archetypeScope: null,
    artUrl: '/badges/x4-legend.svg',
    discountPercent: 100,
    discountCap: 20000
  }
];

async function seedBadgeDefinitions() {
  console.log('🎯 Seeding badge definitions...');
  
  try {
    let insertedCount = 0;
    
    for (const badgeData of BADGE_DEFINITIONS) {
      try {
        // Check if badge already exists
        const existing = await db.execute(sql`
          SELECT id FROM badges WHERE id = ${badgeData.id}
        `);
        
        if (existing.length === 0) {
          // Insert new badge using existing table schema
          await db.execute(sql`
            INSERT INTO badges (
              id, name, description, icon_url, category, xp_reward, byte_reward, is_active
            ) VALUES (
              ${badgeData.id}, ${badgeData.name}, ${badgeData.description}, 
              ${badgeData.artUrl}, ${badgeData.tierScope || 'general'}, 
              ${badgeData.discountPercent * 10}, ${badgeData.discountCap / 100}, true
            )
          `);
          insertedCount++;
          console.log(`  ✓ Inserted ${badgeData.id}: ${badgeData.name}`);
        } else {
          console.log(`  → Badge ${badgeData.id} already exists`);
        }
      } catch (error) {
        console.error(`  ❌ Failed to insert ${badgeData.id}:`, error);
      }
    }
    
    console.log(`🎉 Badge seeding complete! Inserted ${insertedCount} new badges.`);
    console.log(`📊 Total badges available: ${BADGE_DEFINITIONS.length}`);
    
    return insertedCount;
    
  } catch (error) {
    console.error('❌ Badge seeding failed:', error);
    throw error;
  }
}

// Run seeding
if (require.main === module) {
  seedBadgeDefinitions()
    .then((count) => {
      console.log(`✅ Badge definitions seeded! ${count} badges inserted.`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Badge seeding failed:', error);
      process.exit(1);
    });
}

export { seedBadgeDefinitions, BADGE_DEFINITIONS };
