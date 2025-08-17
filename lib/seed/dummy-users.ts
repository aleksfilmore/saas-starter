import { db } from '@/lib/db';
import { users, anonymousPosts, userBadges, badges } from '@/lib/db/schema';
import { generateId } from 'lucia';
import bcrypt from 'bcryptjs';

const DUMMY_USERS = [
  {
    username: 'ghost_warrior_23',
    email: 'dummy1@internal.local',
    emotionalArchetype: 'Firewall Builder',
    tier: 'paid',
    level: 5,
    xp: 450,
    streakDays: 23,
    noContactDays: 45
  },
  {
    username: 'cipher_healer',
    email: 'dummy2@internal.local', 
    emotionalArchetype: 'Data Flooder',
    tier: 'freemium',
    level: 3,
    xp: 280,
    streakDays: 12,
    noContactDays: 30
  },
  {
    username: 'neon_phoenix',
    email: 'dummy3@internal.local',
    emotionalArchetype: 'System Optimizer',
    tier: 'paid',
    level: 7,
    xp: 680,
    streakDays: 67,
    noContactDays: 89
  },
  {
    username: 'quantum_survivor',
    email: 'dummy4@internal.local',
    emotionalArchetype: 'Secure Node',
    tier: 'freemium',
    level: 2,
    xp: 150,
    streakDays: 5,
    noContactDays: 15
  },
  {
    username: 'digital_nomad_x',
    email: 'dummy5@internal.local',
    emotionalArchetype: 'Explorer',
    tier: 'paid',
    level: 4,
    xp: 350,
    streakDays: 34,
    noContactDays: 52
  }
];

const DUMMY_POSTS = [
  {
    content: "Day 45 no contact. Still get phantom vibrations from my phone but I'm not checking anymore. Small win.",
    glitchCategory: 'memory_leak',
    glitchTitle: 'M3M0RY_L34K_1D3NT1F13D',
    archetype: 'Firewall Builder'
  },
  {
    content: "Realized I was trauma-bonding instead of actually connecting. This app helped me see the patterns.",
    glitchCategory: 'loop_detected', 
    glitchTitle: 'L00P_1NF1N1T3_D3T3CT3D',
    archetype: 'System Optimizer'
  },
  {
    content: "Three months in and I actually laughed today. Real laugh, not the fake ones I used to do.",
    glitchCategory: 'system_error',
    glitchTitle: '5Y5T3M_3RR0R_D3T3CT3D',
    archetype: 'Data Flooder'
  },
  {
    content: "The urge to text them is like a withdrawal symptom. But each day it gets a little easier to resist.",
    glitchCategory: 'buffer_overflow',
    glitchTitle: 'BUFF3R_0V3RFL0W_W4RN1NG',
    archetype: 'Secure Node'
  },
  {
    content: "Started therapy again. Turns out I wasn't broken, just running outdated emotional software.",
    glitchCategory: 'syntax_error',
    glitchTitle: '5YNT4X_3RR0R_L1N3_0',
    archetype: 'Explorer'
  },
  {
    content: "Two weeks streak! The daily rituals actually work when you stick to them consistently.",
    glitchCategory: 'access_denied',
    glitchTitle: '4CC355_D3N13D_3RR0R_403',
    archetype: 'Firewall Builder'
  }
];

export class SeedService {
  static async createDummyUsers(): Promise<void> {
    try {
      console.log('🎭 Creating dummy users for community life...');

      // Check if dummy users already exist
      const existingDummies = await db.execute(`
        SELECT id FROM users WHERE email LIKE '%@internal.local' LIMIT 1
      `);

      if (existingDummies.length > 0) {
        console.log('✅ Dummy users already exist, skipping creation');
        return;
      }

      const dummyPassword = await bcrypt.hash('DummyPassword123!', 10);

      // Create dummy users
      for (const dummy of DUMMY_USERS) {
        const userId = generateId(15);
        
        await db.execute(`
          INSERT INTO users (
            id, email, password_hash, username, emotional_archetype, tier, level, xp, 
            streak_days, no_contact_days, subscription_tier, onboarding_completed, status, created_at
          ) VALUES (
            '${userId}', '${dummy.email}', '${dummyPassword}', '${dummy.username}', 
            '${dummy.emotionalArchetype}', '${dummy.tier}', ${dummy.level}, ${dummy.xp},
            ${dummy.streakDays}, ${dummy.noContactDays}, '${dummy.tier === 'paid' ? 'firewall_pro' : 'ghost_mode'}', 
            true, 'active', NOW() - INTERVAL '${Math.floor(Math.random() * 30)} days'
          )
        `);

        console.log(`✅ Created dummy user: ${dummy.username}`);
      }

      console.log('🎭 Dummy users created successfully!');
    } catch (error) {
      console.error('❌ Failed to create dummy users:', error);
      throw error;
    }
  }

  static async createDummyPosts(): Promise<void> {
    try {
      console.log('📝 Creating dummy wall posts...');

      // Get dummy user IDs
      const dummyUsers = await db.execute(`
        SELECT id, username FROM users WHERE email LIKE '%@internal.local'
      `);

      if (dummyUsers.length === 0) {
        console.log('⚠️  No dummy users found, creating them first...');
        await this.createDummyUsers();
        return this.createDummyPosts();
      }

      // Check if dummy posts already exist
      const existingPosts = await db
        .select({ id: anonymousPosts.id })
        .from(anonymousPosts)
        .limit(1);

      if (existingPosts.length > 5) {
        console.log('✅ Wall posts already exist, skipping dummy creation');
        return;
      }

      // Create dummy posts
      for (let i = 0; i < DUMMY_POSTS.length; i++) {
        const post = DUMMY_POSTS[i];
        const randomUser = dummyUsers[Math.floor(Math.random() * dummyUsers.length)];
        const postId = generateId(15);

        await db.execute(`
          INSERT INTO anonymous_posts (
            id, user_id, content, glitch_category, glitch_title, category, is_anonymous,
            resonate_count, same_loop_count, dragged_me_too_count, stone_cold_count, cleansed_count,
            created_at
          ) VALUES (
            '${postId}', '${randomUser.id}', '${post.content.replace(/'/g, "''")}', 
            '${post.glitchCategory}', '${post.glitchTitle}', '${post.glitchCategory}', true,
            ${Math.floor(Math.random() * 15) + 1}, ${Math.floor(Math.random() * 8)}, 
            ${Math.floor(Math.random() * 5)}, ${Math.floor(Math.random() * 3)}, 
            ${Math.floor(Math.random() * 7)},
            NOW() - INTERVAL '${Math.floor(Math.random() * 7)} days'
          )
        `);

        console.log(`✅ Created dummy post by ${randomUser.username}`);
      }

      console.log('📝 Dummy posts created successfully!');
    } catch (error) {
      console.error('❌ Failed to create dummy posts:', error);
      throw error;
    }
  }

  static async giveFirewallPerks(): Promise<void> {
    try {
      console.log('🏅 Giving firewall perks to paid dummy users...');

      // Get paid dummy users
      const paidDummies = await db.execute(`
        SELECT id, username FROM users WHERE email LIKE '%@internal.local' AND tier = 'paid'
      `);

      // Get available badges
      const availableBadges = await db.execute(`
        SELECT id, name FROM badges WHERE is_active = true LIMIT 5
      `);

      if (availableBadges.length === 0) {
        console.log('⚠️  No badges found, creating basic ones...');
        // Create some basic badges if none exist
        const basicBadges = [
          { 
            id: generateId(15), 
            name: 'Streak Master', 
            description: 'Maintained a healing streak for 30+ days',
            iconUrl: '🔥', 
            category: 'progress',
            isActive: true 
          },
          { 
            id: generateId(15), 
            name: 'No Contact Champion', 
            description: 'Successfully maintained no contact for 60+ days',
            iconUrl: '🛡️', 
            category: 'milestone',
            isActive: true 
          },
          { 
            id: generateId(15), 
            name: 'Community Helper', 
            description: 'Actively supported other community members',
            iconUrl: '❤️', 
            category: 'social',
            isActive: true 
          },
          { 
            id: generateId(15), 
            name: 'Firewall Elite', 
            description: 'Premium member with exceptional progress',
            iconUrl: '👑', 
            category: 'premium',
            isActive: true 
          }
        ];

        for (const badge of basicBadges) {
          await db.execute(`
            INSERT INTO badges (id, name, description, icon_url, category, is_active, created_at)
            VALUES ('${badge.id}', '${badge.name}', '${badge.description}', '${badge.iconUrl}', '${badge.category}', ${badge.isActive}, NOW())
          `);
        }

        return this.giveFirewallPerks(); // Retry after creating badges
      }

      // Give badges to paid users
      for (const user of paidDummies) {
        const numBadges = Math.floor(Math.random() * 3) + 2; // 2-4 badges
        const selectedBadges = availableBadges
          .sort(() => Math.random() - 0.5)
          .slice(0, numBadges);

        for (const badge of selectedBadges) {
          await db.execute(`
            INSERT INTO user_badges (id, user_id, badge_id, earned_at)
            VALUES ('${generateId(15)}', '${user.id}', '${badge.id}', NOW() - INTERVAL '${Math.floor(Math.random() * 14)} days')
          `);
        }

        console.log(`✅ Gave ${numBadges} badges to ${user.username}`);
      }

      console.log('🏅 Firewall perks distributed successfully!');
    } catch (error) {
      console.error('❌ Failed to give firewall perks:', error);
      throw error;
    }
  }

  static async seedAll(): Promise<void> {
    try {
      console.log('🌱 Starting complete dummy data seeding...');
      
      await this.createDummyUsers();
      await this.createDummyPosts(); 
      await this.giveFirewallPerks();
      
      console.log('🌱 ✅ All dummy data seeded successfully!');
      console.log('The community now has life and activity for new users to see.');
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      throw error;
    }
  }
}
