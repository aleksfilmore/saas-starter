// Badge Seeding for Gamification System
import { db } from './drizzle';
import { badges } from './schema';
import { generateId } from 'lucia';

export async function seedBadges() {
  const badgeData = [
    // ===== WALL OF WOUNDS BADGES =====
    {
      id: 'void_whisperer_bronze',
      name: 'Void Whisperer I',
      description: 'Posted 5 times to the Wall of Wounds',
      category: 'wall_activity',
      tier: 'bronze',
      iconUrl: '/badges/void-whisperer-bronze.svg',
    // xpReward removed
      byteReward: 100,
      rarity: 'common',
    },
    {
      id: 'void_whisperer_silver', 
      name: 'Void Whisperer II',
      description: 'Posted 20 times to the Wall of Wounds',
      category: 'wall_activity',
      tier: 'silver',
      iconUrl: '/badges/void-whisperer-silver.svg',
    // xpReward removed
      byteReward: 200,
      rarity: 'uncommon',
    },
    {
      id: 'void_whisperer_gold',
      name: 'Void Whisperer III',
      description: 'Posted 50 times to the Wall of Wounds',
      category: 'wall_activity', 
      tier: 'gold',
      iconUrl: '/badges/void-whisperer-gold.svg',
    // xpReward removed
      byteReward: 500,
      rarity: 'rare',
    },
    {
      id: 'resonance_collector',
      name: 'Resonance Collector',
      description: 'Received 100 total reactions on wall posts',
      category: 'engagement',
      tier: 'silver',
      iconUrl: '/badges/resonance-collector.svg',
    // xpReward removed
      byteReward: 300,
      rarity: 'uncommon',
    },
    {
      id: 'viral_sensation',
      name: 'Viral Sensation',
      description: 'Had a post go viral (50+ reactions)',
      category: 'engagement',
      tier: 'gold',
      iconUrl: '/badges/viral-sensation.svg', 
    // xpReward removed
      byteReward: 750,
      rarity: 'rare',
    },
    {
      id: 'oracle_ascended',
      name: 'Oracle Ascended',
      description: 'Featured as weekly Oracle 3 times',
      category: 'recognition',
      tier: 'platinum',
      iconUrl: '/badges/oracle-ascended.svg',
    // xpReward removed
      byteReward: 1000,
      rarity: 'legendary',
    },

    // ===== STREAK SYSTEM BADGES =====
    {
      id: 'firewall_activated',
      name: 'Firewall Activated',
      description: 'Maintained a 5-day ritual streak',
      category: 'streaks',
      tier: 'bronze',
      iconUrl: '/badges/firewall-activated.svg',
    // xpReward removed
      byteReward: 150,
      rarity: 'common',
    },
    {
      id: 'reboot_complete',
      name: 'System Reboot Complete',
      description: 'Maintained a 30-day ritual streak',
      category: 'streaks',
      tier: 'gold',
      iconUrl: '/badges/reboot-complete.svg',
    // xpReward removed
      byteReward: 600,
      rarity: 'rare',
    },
    {
      id: 'protocol_mastered',
      name: 'Protocol Mastered',
      description: 'Maintained a 60-day ritual streak',
      category: 'streaks',
      tier: 'platinum',
      iconUrl: '/badges/protocol-mastered.svg',
    // xpReward removed
      byteReward: 1000,
      rarity: 'epic',
    },
    {
      id: 'deep_reset_achieved',
      name: 'Deep Reset Achieved',
      description: 'Maintained a 90-day ritual streak',
      category: 'streaks',
      tier: 'diamond',
      iconUrl: '/badges/deep-reset-achieved.svg',
    // xpReward removed
      byteReward: 2000,
      rarity: 'legendary',
    },
    {
      id: 'streak_phoenix',
      name: 'Streak Phoenix',
      description: 'Bounced back from 3+ streak breaks',
      category: 'resilience',
      tier: 'gold',
      iconUrl: '/badges/streak-phoenix.svg',
    // xpReward removed
      byteReward: 400,
      rarity: 'rare',
    },

    // ===== RITUAL COMPLETION BADGES =====
    {
      id: 'ritual_initiate',
      name: 'Ritual Initiate',
      description: 'Completed 10 daily rituals',
      category: 'rituals',
      tier: 'bronze',
      iconUrl: '/badges/ritual-initiate.svg',
    // xpReward removed
      byteReward: 100,
      rarity: 'common',
    },
    {
      id: 'emotional_engineer',
      name: 'Emotional Engineer',
      description: 'Completed 100 daily rituals',
      category: 'rituals',
      tier: 'gold',
      iconUrl: '/badges/emotional-engineer.svg',
    // xpReward removed
      byteReward: 600,
      rarity: 'rare',
    },
    {
      id: 'zen_master',
      name: 'Zen Protocol Master',
      description: 'Completed 500 daily rituals',
      category: 'rituals',
      tier: 'diamond',
      iconUrl: '/badges/zen-master.svg',
    // xpReward removed
      byteReward: 2000,
      rarity: 'legendary',
    },

    // ===== LEVEL PROGRESSION BADGES =====
    {
      id: 'system_stable',
      name: 'System Stabilized',
      description: 'Reached Glow-Up Level 10',
      category: 'progression',
      tier: 'silver',
      iconUrl: '/badges/system-stable.svg',
    // xpReward removed
      byteReward: 200,
      rarity: 'uncommon',
    },
    {
      id: 'firewall_mastery',
      name: 'Firewall Mastery',
      description: 'Reached Glow-Up Level 25',
      category: 'progression',
      tier: 'gold',
      iconUrl: '/badges/firewall-mastery.svg',
    // xpReward removed
      byteReward: 500,
      rarity: 'rare',
    },
    {
      id: 'cult_leader_ascension',
      name: 'Cult Leader Ascension',
      description: 'Reached Glow-Up Level 40',
      category: 'progression',
      tier: 'diamond',
      iconUrl: '/badges/cult-leader-ascension.svg',
    // xpReward removed
      byteReward: 1000,
      rarity: 'legendary',
    },

    // ===== SPECIAL ACHIEVEMENT BADGES =====
    {
      id: 'byte_millionaire',
      name: 'Byte Millionaire',
      description: 'Accumulated 10,000 total bytes',
      category: 'achievement',
      tier: 'platinum',
      iconUrl: '/badges/byte-millionaire.svg',
    // xpReward removed
      byteReward: 0, // No byte reward for byte achievement
      rarity: 'epic',
    },
    {
      id: 'community_pillar',
      name: 'Community Pillar',
      description: 'Helped 100 users through reactions/comments',
      category: 'community',
      tier: 'platinum',
      iconUrl: '/badges/community-pillar.svg',
    // xpReward removed
      byteReward: 800,
      rarity: 'epic',
    },
    {
      id: 'first_post',
      name: 'First Transmission',
      description: 'Posted your first message to the void',
      category: 'milestone',
      tier: 'bronze',
      iconUrl: '/badges/first-post.svg',
    // xpReward removed
      byteReward: 50,
      rarity: 'common',
    },
    {
      id: 'week_one_survivor',
      name: 'Week One Survivor',
      description: 'Completed your first week on the platform',
      category: 'milestone',
      tier: 'bronze',
      iconUrl: '/badges/week-one-survivor.svg',
    // xpReward removed
      byteReward: 150,
      rarity: 'common',
    },

    // ===== CULT BUBBLE BADGES =====
    {
      id: 'bubble_creator',
      name: 'Bubble Creator',
      description: 'Created your first Cult Bubble',
      category: 'cult_bubbles',
      tier: 'gold',
      iconUrl: '/badges/bubble-creator.svg',
    // xpReward removed
      byteReward: 400,
      rarity: 'rare',
    },
    {
      id: 'cult_architect',
      name: 'Cult Architect',
      description: 'Created 5 successful Cult Bubbles',
      category: 'cult_bubbles',
      tier: 'platinum',
      iconUrl: '/badges/cult-architect.svg',
    // xpReward removed
      byteReward: 1000,
      rarity: 'epic',
    },

    // ===== SEASONAL/EVENT BADGES =====
    {
      id: 'beta_pioneer',
      name: 'Beta Pioneer',
      description: 'Joined during the beta phase',
      category: 'special',
      tier: 'diamond',
      iconUrl: '/badges/beta-pioneer.svg',
        // xpReward removed
      byteReward: 2000,
      rarity: 'legendary',
    },
  ];

  try {
    // Clear existing badges (optional - remove if you want to keep existing)
    // await db.delete(badges);

    // Insert all badges
    for (const badge of badgeData) {
      await db.insert(badges).values({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        category: badge.category,
        tier: badge.tier,
        iconUrl: badge.iconUrl,
          // xpReward removed from insert
        byteReward: badge.byteReward,
        rarity: badge.rarity,
      }).onConflictDoNothing(); // Skip if badge already exists
    }

    console.log(`✅ Seeded ${badgeData.length} badges successfully`);
    return { success: true, count: badgeData.length };

  } catch (error) {
    console.error('❌ Badge seeding failed:', error);
    throw error;
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedBadges()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
