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
  // Heartbreak posts
  {
    content: "Day 45 no contact. Still get phantom vibrations from my phone but I'm not checking anymore. Small win.",
    glitchCategory: 'heartbreak',
    glitchTitle: 'M3M0RY_L34K_1D3NT1F13D',
    archetype: 'Firewall Builder'
  },
  {
    content: "Three months since they left. Some days I forget they existed. Other days I remember everything. Today was a remembering day.",
    glitchCategory: 'heartbreak',
    glitchTitle: 'BUFF3R_0V3RFL0W_W4RN1NG',
    archetype: 'Data Flooder'
  },
  {
    content: "Deleted 847 photos today. Each one felt like a small funeral. But my phone storage is lighter now.",
    glitchCategory: 'heartbreak',
    glitchTitle: '5Y5T3M_3RR0R_D3T3CT3D',
    archetype: 'System Optimizer'
  },
  
  // Sadness posts
  {
    content: "Realized I was trauma-bonding instead of actually connecting. This app helped me see the patterns.",
    glitchCategory: 'sadness', 
    glitchTitle: 'L00P_1NF1N1T3_D3T3CT3D',
    archetype: 'System Optimizer'
  },
  {
    content: "Cried in the grocery store today because I saw their favorite cereal. At least I'm feeling again.",
    glitchCategory: 'sadness',
    glitchTitle: 'M3M0RY_L34K_1D3NT1F13D',
    archetype: 'Explorer'
  },
  {
    content: "My therapist says sadness is just love with nowhere to go. That actually helps somehow.",
    glitchCategory: 'sadness',
    glitchTitle: '5YNT4X_3RR0R_L1N3_0',
    archetype: 'Secure Node'
  },

  // Anger posts
  {
    content: "The audacity of them to act like we never happened. Like 3 years was just a practice round.",
    glitchCategory: 'anger',
    glitchTitle: '4CC355_D3N13D_3RR0R_403',
    archetype: 'Firewall Builder'
  },
  {
    content: "Rage-cleaned my entire apartment at 2am. Everything sparkles now. Still furious but at least it's organized fury.",
    glitchCategory: 'anger',
    glitchTitle: '5T4CK_0V3RFL0W_3XC3PT10N',
    archetype: 'Data Flooder'
  },
  {
    content: "They moved on in 2 weeks. TWO WEEKS. I'm out here processing trauma they gave me and they're posting vacation pics.",
    glitchCategory: 'anger',
    glitchTitle: 'NULL_P01NT3R_3XC3PT10N',
    archetype: 'System Optimizer'
  },

  // Anxiety posts
  {
    content: "The urge to text them is like a withdrawal symptom. But each day it gets a little easier to resist.",
    glitchCategory: 'anxiety',
    glitchTitle: 'BUFF3R_0V3RFL0W_W4RN1NG',
    archetype: 'Secure Node'
  },
  {
    content: "Panic attack at 3am because I dreamed we were still together. My brain needs to update its software.",
    glitchCategory: 'anxiety',
    glitchTitle: '5Y5T3M_3RR0R_D3T3CT3D',
    archetype: 'Explorer'
  },
  {
    content: "Checking their social media is like picking a scab. It feels necessary but just makes everything worse.",
    glitchCategory: 'anxiety',
    glitchTitle: 'L00P_1NF1N1T3_D3T3CT3D',
    archetype: 'Firewall Builder'
  },

  // Hope posts
  {
    content: "Three months in and I actually laughed today. Real laugh, not the fake ones I used to do.",
    glitchCategory: 'hope',
    glitchTitle: '5Y5T3M_3RR0R_D3T3CT3D',
    archetype: 'Data Flooder'
  },
  {
    content: "Started therapy again. Turns out I wasn't broken, just running outdated emotional software.",
    glitchCategory: 'hope',
    glitchTitle: '5YNT4X_3RR0R_L1N3_0',
    archetype: 'Explorer'
  },
  {
    content: "Two weeks streak! The daily rituals actually work when you stick to them consistently.",
    glitchCategory: 'hope',
    glitchTitle: '4CC355_D3N13D_3RR0R_403',
    archetype: 'Firewall Builder'
  },

  // Confusion posts
  {
    content: "They said they loved me on Tuesday and blocked me on Friday. Someone explain that logic please.",
    glitchCategory: 'confusion',
    glitchTitle: 'NULL_P01NT3R_3XC3PT10N',
    archetype: 'System Optimizer'
  },
  {
    content: "6 months later and I still don't understand what happened. Was any of it real?",
    glitchCategory: 'confusion',
    glitchTitle: 'M3M0RY_L34K_1D3NT1F13D',
    archetype: 'Data Flooder'
  },
  {
    content: "Everyone keeps asking if I'm over it. How do you get over someone who rewrote your entire operating system?",
    glitchCategory: 'confusion',
    glitchTitle: '5T4CK_0V3RFL0W_3XC3PT10N',
    archetype: 'Secure Node'
  },

  // Breakthrough posts
  {
    content: "Moment of clarity: I wasn't trying to get them back, I was trying to get myself back. Different mission entirely.",
    glitchCategory: 'breakthrough',
    glitchTitle: '5Y5T3M_R35T0R3_C0MPL3T3',
    archetype: 'System Optimizer'
  },
  {
    content: "Realized I can miss the good times without wanting them back. Revolutionary concept for my brain.",
    glitchCategory: 'breakthrough',
    glitchTitle: 'UPD4T3_1N5T4LL3D',
    archetype: 'Explorer'
  },
  {
    content: "The person who can hurt you the most is the person you give the most access to. Access revoked.",
    glitchCategory: 'breakthrough',
    glitchTitle: '4CC355_D3N13D_3RR0R_403',
    archetype: 'Firewall Builder'
  },

  // Rage posts
  {
    content: "The ABSOLUTE RAGE when they said 'we can still be friends.' Like no, we can't. You don't get to keep me as a backup.",
    glitchCategory: 'rage',
    glitchTitle: 'CR1T1C4L_3RR0R_D3T3CT3D',
    archetype: 'Firewall Builder'
  },
  {
    content: "Destroyed a whole punching bag today. Every hit was their face. Expensive therapy but worth every penny.",
    glitchCategory: 'rage',
    glitchTitle: '5Y5T3M_0V3RL04D_W4RN1NG',
    archetype: 'Data Flooder'
  },
  {
    content: "White hot fury when I found out they were already seeing someone new while lying to me about 'needing space.'",
    glitchCategory: 'rage',
    glitchTitle: 'F4T4L_3XC3PT10N_3RR0R',
    archetype: 'System Optimizer'
  },

  // Identity posts  
  {
    content: "I forgot who I was before them. Now I'm slowly remembering - and I actually like this person more.",
    glitchCategory: 'identity',
    glitchTitle: 'ID3NT1TY_R35T0R4T10N',
    archetype: 'Explorer'
  },
  {
    content: "They said I was 'too much.' Turns out that was just me being authentically myself. Their loss.",
    glitchCategory: 'identity',
    glitchTitle: 'S3LF_1MPL3M3NT4T10N',
    archetype: 'Secure Node'
  },
  {
    content: "Rediscovering hobbies I abandoned for them. Amazing how much personality I compressed to fit their preferences.",
    glitchCategory: 'identity',
    glitchTitle: 'C0R3_D4T4_R3C0V3RY',
    archetype: 'System Optimizer'
  },

  // Future posts
  {
    content: "First time in months I'm excited about tomorrow instead of dreading it. Small but significant shift.",
    glitchCategory: 'future',
    glitchTitle: 'H0P3_PR0T0C0L_4CT1V3',
    archetype: 'Data Flooder'
  },
  {
    content: "Made plans for next year that don't include them. Weird but liberating to design a future just for me.",
    glitchCategory: 'future',
    glitchTitle: 'T1M3L1N3_UPD4T3D',
    archetype: 'Explorer'
  },
  {
    content: "The future I was building with them crumbled. But now I'm building something even better - just for me.",
    glitchCategory: 'future',
    glitchTitle: 'N3W_P4TH_1N1T14L1Z3D',
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

      if (existingPosts.length > 15) {
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
