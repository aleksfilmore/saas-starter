import { db } from './lib/db/index.js';
import { sql } from 'drizzle-orm';

async function addFirewallBadges() {
  console.log('🔥 Phase 2: Adding Firewall Badge System...');

  try {
    console.log('1. Adding F5-F8 badges for all archetypes...');
    
    // F5 badges - Data Mastery (100 rituals)
    const f5Badges = [
      {
        id: 'F5_DF',
        name: 'Data Deluge Master',
        description: 'One hundred streams converged - you command the data flood',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=F5_DF&backgroundColor=1e40af&scale=80',
        category: 'mastery',
        xp_reward: 500,
        byte_reward: 100,
        tier_scope: 'firewall',
        archetype_scope: 'DF',
        code: 'F5_DF_DELUGE',
        discount_percent: 25,
        is_active: true
      },
      {
        id: 'F5_FB',
        name: 'Fortress Architect',
        description: 'Master builder of digital fortresses - your walls are legendary',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=F5_FB&backgroundColor=dc2626&scale=80',
        category: 'mastery',
        xp_reward: 500,
        byte_reward: 100,
        tier_scope: 'firewall',
        archetype_scope: 'FB',
        code: 'F5_FB_FORTRESS',
        discount_percent: 25,
        is_active: true
      },
      {
        id: 'F5_GS',
        name: 'Phantom Virtuoso',
        description: 'Master of the digital realm - you move between worlds at will',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=F5_GS&backgroundColor=1f2937&scale=80',
        category: 'mastery',
        xp_reward: 500,
        byte_reward: 100,
        tier_scope: 'firewall',
        archetype_scope: 'GS',
        code: 'F5_GS_PHANTOM',
        discount_percent: 25,
        is_active: true
      },
      {
        id: 'F5_SN',
        name: 'Network Sovereign',
        description: 'Ruler of secure networks - your nodes form an unbreakable web',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=F5_SN&backgroundColor=047857&scale=80',
        category: 'mastery',
        xp_reward: 500,
        byte_reward: 100,
        tier_scope: 'firewall',
        archetype_scope: 'SN',
        code: 'F5_SN_SOVEREIGN',
        discount_percent: 25,
        is_active: true
      }
    ];

    // F6 badges - Consistency Master (90-day streak) 
    const f6Badges = [
      {
        id: 'F6_DF',
        name: 'Eternal Flow',
        description: 'Ninety days of endless stream - you are the constant current',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=F6_DF&backgroundColor=3730a3&scale=80',
        category: 'consistency',
        xp_reward: 750,
        byte_reward: 150,
        tier_scope: 'firewall',
        archetype_scope: 'DF',
        code: 'F6_DF_ETERNAL',
        discount_percent: 30,
        is_active: true
      },
      {
        id: 'F6_FB',
        name: 'Immutable Defense',
        description: 'Ninety days of unwavering protection - your defense never fails',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=F6_FB&backgroundColor=b91c1c&scale=80',
        category: 'consistency',
        xp_reward: 750,
        byte_reward: 150,
        tier_scope: 'firewall',
        archetype_scope: 'FB',
        code: 'F6_FB_IMMUTABLE',
        discount_percent: 30,
        is_active: true
      },
      {
        id: 'F6_GS',
        name: 'Persistent Shade',
        description: 'Ninety days in the shadows - you have become one with the void',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=F6_GS&backgroundColor=111827&scale=80',
        category: 'consistency',
        xp_reward: 750,
        byte_reward: 150,
        tier_scope: 'firewall',
        archetype_scope: 'GS',
        code: 'F6_GS_PERSISTENT',
        discount_percent: 30,
        is_active: true
      },
      {
        id: 'F6_SN',
        name: 'Steadfast Guardian',
        description: 'Ninety days of loyal service - the network depends on you',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=F6_SN&backgroundColor=065f46&scale=80',
        category: 'consistency',
        xp_reward: 750,
        byte_reward: 150,
        tier_scope: 'firewall',
        archetype_scope: 'SN',
        code: 'F6_SN_STEADFAST',
        discount_percent: 30,
        is_active: true
      }
    ];

    // F7 badges - Social Master (25 wall interactions)
    const f7Badges = [
      {
        id: 'F7_DF',
        name: 'Stream Broadcaster',
        description: 'Your voice amplifies across all channels - the network listens',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=F7_DF&backgroundColor=4338ca&scale=80',
        category: 'social',
        xp_reward: 400,
        byte_reward: 80,
        tier_scope: 'firewall',
        archetype_scope: 'DF',
        code: 'F7_DF_BROADCASTER',
        discount_percent: 20,
        is_active: true
      },
      {
        id: 'F7_FB',
        name: 'Community Bastion',
        description: 'Protector of the digital tribe - others seek shelter in your presence',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=F7_FB&backgroundColor=dc2626&scale=80',
        category: 'social',
        xp_reward: 400,
        byte_reward: 80,
        tier_scope: 'firewall',
        archetype_scope: 'FB',
        code: 'F7_FB_BASTION',
        discount_percent: 20,
        is_active: true
      },
      {
        id: 'F7_GS',
        name: 'Echo Amplifier',
        description: 'Your whispers become roars - the shell resonates with power',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=F7_GS&backgroundColor=374151&scale=80',
        category: 'social',
        xp_reward: 400,
        byte_reward: 80,
        tier_scope: 'firewall',
        archetype_scope: 'GS',
        code: 'F7_GS_AMPLIFIER',
        discount_percent: 20,
        is_active: true
      },
      {
        id: 'F7_SN',
        name: 'Network Nexus',
        description: 'Central hub of connection - all paths lead through you',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=F7_SN&backgroundColor=059669&scale=80',
        category: 'social',
        xp_reward: 400,
        byte_reward: 80,
        tier_scope: 'firewall',
        archetype_scope: 'SN',
        code: 'F7_SN_NEXUS',
        discount_percent: 20,
        is_active: true
      }
    ];

    // F8 badges - Ultimate Achievement (200 rituals)
    const f8Badges = [
      {
        id: 'F8_DF',
        name: 'Data Deity',
        description: 'Transcendent master of information - you have become pure data',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=F8_DF&backgroundColor=5b21b6&scale=80',
        category: 'ultimate',
        xp_reward: 1000,
        byte_reward: 200,
        tier_scope: 'firewall',
        archetype_scope: 'DF',
        code: 'F8_DF_DEITY',
        discount_percent: 40,
        is_active: true
      },
      {
        id: 'F8_FB',
        name: 'Eternal Sentinel',
        description: 'Guardian beyond time - your watch never ends, your walls never fall',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=F8_FB&backgroundColor=991b1b&scale=80',
        category: 'ultimate',
        xp_reward: 1000,
        byte_reward: 200,
        tier_scope: 'firewall',
        archetype_scope: 'FB',
        code: 'F8_FB_SENTINEL',
        discount_percent: 40,
        is_active: true
      },
      {
        id: 'F8_GS',
        name: 'Digital Transcendence',
        description: 'Beyond ghost, beyond shell - you exist in all realities simultaneously',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=F8_GS&backgroundColor=0f172a&scale=80',
        category: 'ultimate',
        xp_reward: 1000,
        byte_reward: 200,
        tier_scope: 'firewall',
        archetype_scope: 'GS',
        code: 'F8_GS_TRANSCENDENCE',
        discount_percent: 40,
        is_active: true
      },
      {
        id: 'F8_SN',
        name: 'Omninet Overseer',
        description: 'Master of all networks - the entire digital realm bends to your will',
        icon_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=F8_SN&backgroundColor=064e3b&scale=80',
        category: 'ultimate',
        xp_reward: 1000,
        byte_reward: 200,
        tier_scope: 'firewall',
        archetype_scope: 'SN',
        code: 'F8_SN_OVERSEER',
        discount_percent: 40,
        is_active: true
      }
    ];

    // Insert all Firewall badges
    const allBadges = [...f5Badges, ...f6Badges, ...f7Badges, ...f8Badges];
    
    for (const badge of allBadges) {
      await db.execute(sql`
        INSERT INTO badges (id, name, description, icon_url, category, xp_reward, byte_reward, tier_scope, archetype_scope, code, discount_percent, is_active, created_at)
        VALUES (${badge.id}, ${badge.name}, ${badge.description}, ${badge.icon_url}, ${badge.category}, ${badge.xp_reward}, ${badge.byte_reward}, ${badge.tier_scope}, ${badge.archetype_scope}, ${badge.code}, ${badge.discount_percent}, ${badge.is_active}, NOW())
        ON CONFLICT (id) DO NOTHING
      `);
      console.log(`✅ Added ${badge.id}: ${badge.name}`);
    }

    console.log('\n🎉 Successfully added all Firewall badges!');
    console.log('Firewall badge system now complete:');
    console.log('- F5: Mastery badges (100 rituals, 25% discount)');
    console.log('- F6: Consistency badges (90-day streak, 30% discount)');
    console.log('- F7: Social badges (25 wall interactions, 20% discount)');
    console.log('- F8: Ultimate badges (200 rituals, 40% discount)');

    // Verify all Firewall badges
    const firewallBadges = await db.execute(sql`
      SELECT id, name, tier_scope, archetype_scope, discount_percent
      FROM badges 
      WHERE tier_scope = 'firewall' 
      ORDER BY id
    `);
    
    console.log('\n📋 All Firewall badges in database:');
    firewallBadges.forEach(badge => {
      console.log(`${badge.id}: ${badge.name} (${badge.archetype_scope}) - ${badge.discount_percent}% discount`);
    });

  } catch (error) {
    console.error('💥 Failed to add Firewall badges:', error);
  } finally {
    process.exit(0);
  }
}

addFirewallBadges();
