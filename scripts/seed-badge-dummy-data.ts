// CTRL+ALT+BLOCK™ Badge System Dummy Data Seeder
// Populates badge system with test users and varied badge progressions for development

import { db } from '@/lib/db/drizzle';
import { badges, userBadges, badgeEvents, discountCodes, users } from '@/lib/db/badges-schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// =====================================
// DUMMY DATA CONFIGURATION
// =====================================

interface DummyUser {
  email: string;
  tier: 'ghost' | 'firewall';
  archetype?: 'DF' | 'FB' | 'GS' | 'SN';
  badgeCount: number;
  profileBadge?: string;
  characteristics: string;
}

const DUMMY_USERS: DummyUser[] = [
  // Ghost tier users (max 4 badges)
  {
    email: 'ghost.newbie@example.com',
    tier: 'ghost',
    badgeCount: 1,
    characteristics: 'New user with just starting badge'
  },
  {
    email: 'ghost.regular@example.com', 
    tier: 'ghost',
    badgeCount: 2,
    characteristics: 'Regular check-in user'
  },
  {
    email: 'ghost.dedicated@example.com',
    tier: 'ghost', 
    badgeCount: 3,
    characteristics: 'Dedicated ritual practitioner'
  },
  {
    email: 'ghost.maxed@example.com',
    tier: 'ghost',
    badgeCount: 4,
    characteristics: 'Maxed out Ghost tier user'
  },

  // Firewall tier users with different archetypes
  {
    email: 'firewall.df.starter@example.com',
    tier: 'firewall',
    archetype: 'DF',
    badgeCount: 3,
    profileBadge: 'F1_DF',
    characteristics: 'Data Flooder archetype, early stage'
  },
  {
    email: 'firewall.df.advanced@example.com', 
    tier: 'firewall',
    archetype: 'DF',
    badgeCount: 6,
    profileBadge: 'F3_DF',
    characteristics: 'Advanced Data Flooder with wall engagement'
  },
  {
    email: 'firewall.fb.specialist@example.com',
    tier: 'firewall',
    archetype: 'FB', 
    badgeCount: 5,
    profileBadge: 'F2_FB',
    characteristics: 'Firewall Builder ritual specialist'
  },
  {
    email: 'firewall.gs.therapist@example.com',
    tier: 'firewall',
    archetype: 'GS',
    badgeCount: 7,
    profileBadge: 'F4_GS',
    characteristics: 'Ghost in Shell AI therapy enthusiast'
  },
  {
    email: 'firewall.sn.legend@example.com',
    tier: 'firewall',
    archetype: 'SN',
    badgeCount: 9,
    profileBadge: 'X4_Legend',
    characteristics: 'Secure Node legend with global badges'
  },
  {
    email: 'firewall.completionist@example.com',
    tier: 'firewall', 
    archetype: 'FB',
    badgeCount: 10,
    profileBadge: 'X1_Firewall',
    characteristics: 'Completionist with max badges'
  }
];

const BADGE_PROGRESSION_ORDERS = {
  ghost: [
    ['G0_Phantom'],
    ['G0_Phantom', 'G1_Lurker'],
    ['G0_Phantom', 'G1_Lurker', 'G2_Presence'],
    ['G0_Phantom', 'G1_Lurker', 'G2_Presence', 'G3_Manifest']
  ],
  
  firewall: {
    DF: [
      ['F1_DF'],
      ['F1_DF', 'G0_Phantom'],
      ['F1_DF', 'G0_Phantom', 'F2_DF'],
      ['F1_DF', 'G0_Phantom', 'F2_DF', 'G1_Lurker'],
      ['F1_DF', 'G0_Phantom', 'F2_DF', 'G1_Lurker', 'X1_Firewall'],
      ['F1_DF', 'G0_Phantom', 'F2_DF', 'G1_Lurker', 'X1_Firewall', 'F3_DF'],
      ['F1_DF', 'G0_Phantom', 'F2_DF', 'G1_Lurker', 'X1_Firewall', 'F3_DF', 'G2_Presence'],
      ['F1_DF', 'G0_Phantom', 'F2_DF', 'G1_Lurker', 'X1_Firewall', 'F3_DF', 'G2_Presence', 'F4_DF'],
      ['F1_DF', 'G0_Phantom', 'F2_DF', 'G1_Lurker', 'X1_Firewall', 'F3_DF', 'G2_Presence', 'F4_DF', 'X2_Phoenix'],
      ['F1_DF', 'G0_Phantom', 'F2_DF', 'G1_Lurker', 'X1_Firewall', 'F3_DF', 'G2_Presence', 'F4_DF', 'X2_Phoenix', 'X4_Legend']
    ],
    
    FB: [
      ['F1_FB'],
      ['F1_FB', 'G0_Phantom'],
      ['F1_FB', 'G0_Phantom', 'F2_FB'],
      ['F1_FB', 'G0_Phantom', 'F2_FB', 'G1_Lurker'],
      ['F1_FB', 'G0_Phantom', 'F2_FB', 'G1_Lurker', 'F3_FB'],
      ['F1_FB', 'G0_Phantom', 'F2_FB', 'G1_Lurker', 'F3_FB', 'X1_Firewall'],
      ['F1_FB', 'G0_Phantom', 'F2_FB', 'G1_Lurker', 'F3_FB', 'X1_Firewall', 'G2_Presence'],
      ['F1_FB', 'G0_Phantom', 'F2_FB', 'G1_Lurker', 'F3_FB', 'X1_Firewall', 'G2_Presence', 'F4_FB'],
      ['F1_FB', 'G0_Phantom', 'F2_FB', 'G1_Lurker', 'F3_FB', 'X1_Firewall', 'G2_Presence', 'F4_FB', 'X2_Phoenix'],
      ['F1_FB', 'G0_Phantom', 'F2_FB', 'G1_Lurker', 'F3_FB', 'X1_Firewall', 'G2_Presence', 'F4_FB', 'X2_Phoenix', 'X4_Legend']
    ],
    
    GS: [
      ['F1_GS'],
      ['F1_GS', 'G0_Phantom'],
      ['F1_GS', 'G0_Phantom', 'G1_Lurker'],
      ['F1_GS', 'G0_Phantom', 'G1_Lurker', 'F2_GS'],
      ['F1_GS', 'G0_Phantom', 'G1_Lurker', 'F2_GS', 'F3_GS'],
      ['F1_GS', 'G0_Phantom', 'G1_Lurker', 'F2_GS', 'F3_GS', 'G2_Presence'],
      ['F1_GS', 'G0_Phantom', 'G1_Lurker', 'F2_GS', 'F3_GS', 'G2_Presence', 'F4_GS'],
      ['F1_GS', 'G0_Phantom', 'G1_Lurker', 'F2_GS', 'F3_GS', 'G2_Presence', 'F4_GS', 'X1_Firewall'],
      ['F1_GS', 'G0_Phantom', 'G1_Lurker', 'F2_GS', 'F3_GS', 'G2_Presence', 'F4_GS', 'X1_Firewall', 'X3_Eternal'],
      ['F1_GS', 'G0_Phantom', 'G1_Lurker', 'F2_GS', 'F3_GS', 'G2_Presence', 'F4_GS', 'X1_Firewall', 'X3_Eternal', 'G3_Manifest']
    ],

    SN: [
      ['F1_SN'],
      ['F1_SN', 'G0_Phantom'],
      ['F1_SN', 'G0_Phantom', 'F2_SN'],
      ['F1_SN', 'G0_Phantom', 'F2_SN', 'G1_Lurker'],
      ['F1_SN', 'G0_Phantom', 'F2_SN', 'G1_Lurker', 'F3_SN'],
      ['F1_SN', 'G0_Phantom', 'F2_SN', 'G1_Lurker', 'F3_SN', 'X1_Firewall'],
      ['F1_SN', 'G0_Phantom', 'F2_SN', 'G1_Lurker', 'F3_SN', 'X1_Firewall', 'F4_SN'],
      ['F1_SN', 'G0_Phantom', 'F2_SN', 'G1_Lurker', 'F3_SN', 'X1_Firewall', 'F4_SN', 'G2_Presence'],
      ['F1_SN', 'G0_Phantom', 'F2_SN', 'G1_Lurker', 'F3_SN', 'X1_Firewall', 'F4_SN', 'G2_Presence', 'X4_Legend'],
      ['F1_SN', 'G0_Phantom', 'F2_SN', 'G1_Lurker', 'F3_SN', 'X1_Firewall', 'F4_SN', 'G2_Presence', 'X4_Legend', 'G3_Manifest']
    ]
  }
} as const;

// =====================================
// SEEDER CLASS
// =====================================

class BadgeSeeder {
  private createdUsers: string[] = [];
  private createdBadges: string[] = [];

  async seed(): Promise<void> {
    console.log('🌱 Starting badge system dummy data seeding...');

    try {
      // 1. Ensure all badge definitions exist
      await this.ensureBadgeDefinitions();
      
      // 2. Create or update dummy users
      await this.createDummyUsers();
      
      // 3. Award badges based on progression
      await this.awardUserBadges();
      
      // 4. Generate some discount codes
      await this.generateDiscountCodes();

      console.log('✅ Badge system seeding completed successfully!');
      this.printSummary();

    } catch (error) {
      console.error('❌ Seeding failed:', error);
      throw error;
    }
  }

  private async ensureBadgeDefinitions(): Promise<void> {
    console.log('📝 Ensuring badge definitions exist...');
    
    // Check if badges are already defined
    const existingBadges = await db.select().from(badges);
    
    if (existingBadges.length === 0) {
      console.log('⚠️  No badges found in database. Badge definitions need to be inserted first.');
      console.log('   Run the badge schema setup script before seeding dummy data.');
      throw new Error('Badge definitions missing - run badge setup first');
    }

    console.log(`✓ Found ${existingBadges.length} badge definitions`);
  }

  private async createDummyUsers(): Promise<void> {
    console.log('👥 Creating dummy users...');

    for (const dummyUser of DUMMY_USERS) {
      try {
        // Check if user already exists
        const existingUser = await db.select()
          .from(users)
          .where(eq(users.email, dummyUser.email))
          .limit(1);

        let userId: string;

        if (existingUser.length > 0) {
          userId = existingUser[0].id;
          console.log(`  ↻ User exists: ${dummyUser.email}`);
        } else {
          userId = nanoid();
          
          // Create user (adjust based on your actual users table schema)
          // Note: You may need to modify this based on your actual user schema
          try {
            await db.insert(users).values({
              id: userId,
              email: dummyUser.email,
              hashedPassword: 'dummy-password-hash', // Placeholder
              tier: dummyUser.tier,
              archetype: dummyUser.archetype || null,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          } catch (error) {
            // If user creation fails due to schema mismatch, log warning
            console.warn(`    Could not create user ${dummyUser.email}, may need manual creation`);
            continue;
          }

          this.createdUsers.push(userId);
          console.log(`  ✓ Created user: ${dummyUser.email} (${dummyUser.tier}${dummyUser.archetype ? ' ' + dummyUser.archetype : ''})`);
        }
      } catch (error) {
        console.warn(`  ⚠️  Could not create/verify user ${dummyUser.email}:`, error);
      }
    }
  }

  private async awardUserBadges(): Promise<void> {
    console.log('🏆 Awarding badges to dummy users...');

    for (const dummyUser of DUMMY_USERS) {
      try {
        // Get user ID
        const userResult = await db.select()
          .from(users)
          .where(eq(users.email, dummyUser.email))
          .limit(1);

        if (userResult.length === 0) {
          console.warn(`  ⚠️  User not found: ${dummyUser.email}`);
          continue;
        }

        const userId = userResult[0].id;

        // Clear existing badges for re-seeding
        await db.delete(userBadges).where(eq(userBadges.userId, userId));
        await db.delete(badgeEvents).where(eq(badgeEvents.userId, userId));

        // Get badges to award based on progression
        const badgesToAward = this.getBadgesForUser(dummyUser);

        // Award each badge
        for (let i = 0; i < badgesToAward.length; i++) {
          const badgeId = badgesToAward[i];
          const isProfile = badgeId === dummyUser.profileBadge;
          
          await this.awardBadge(userId, badgeId, this.getEventTypeForBadge(badgeId), isProfile);
        }

        console.log(`  ✓ Awarded ${badgesToAward.length} badges to ${dummyUser.email}`);

      } catch (error) {
        console.error(`  ❌ Failed to award badges to ${dummyUser.email}:`, error);
      }
    }
  }

  private getBadgesForUser(user: DummyUser): string[] {
    if (user.tier === 'ghost') {
      const index = Math.max(0, Math.min(user.badgeCount - 1, 3));
      return [...(BADGE_PROGRESSION_ORDERS.ghost[index] || [])];
    } else {
      const archetype = user.archetype || 'FB';
      const progressions = BADGE_PROGRESSION_ORDERS.firewall[archetype];
      const index = Math.max(0, Math.min(user.badgeCount - 1, 9));
      return [...(progressions[index] || [])];
    }
  }

  private getEventTypeForBadge(badgeId: string): string {
    if (badgeId.startsWith('G0') || badgeId.startsWith('G1')) return 'check_in_completed';
    if (badgeId.startsWith('G2') || badgeId.startsWith('G3')) return 'ritual_completed';
    if (badgeId.startsWith('F1') || badgeId.startsWith('F2')) return 'ritual_completed';
    if (badgeId.startsWith('F3')) return 'wall_reaction_posted';
    if (badgeId.startsWith('F4')) return 'ai_therapy_completed';
    if (badgeId.startsWith('X')) return 'level_milestone_reached';
    return 'manual_award';
  }

  private async awardBadge(userId: string, badgeId: string, eventType: string, isProfile = false): Promise<void> {
    const userBadgeId = nanoid();
    const eventId = nanoid();

    // Create user badge
    await db.insert(userBadges).values({
      id: userBadgeId,
      userId,
      badgeId,
      sourceEvent: eventType,
      earnedAt: new Date(),
      appliedAsProfile: isProfile
    });

    // Log badge event
    await db.insert(badgeEvents).values({
      id: eventId,
      userId,
      eventType,
      payloadJson: { 
        badgeId, 
        source: 'dummy_data_seed',
        timestamp: new Date().toISOString()
      },
      createdAt: new Date()
    });

    this.createdBadges.push(userBadgeId);
  }

  private async generateDiscountCodes(): Promise<void> {
    console.log('🎫 Generating sample discount codes...');

    // Get some users to link discount codes to
    const someUsers = await db.select().from(users).limit(4);
    const someBadges = await db.select().from(badges).limit(4);

    if (someUsers.length === 0 || someBadges.length === 0) {
      console.log('  ⚠️  No users or badges found, skipping discount code generation');
      return;
    }

    const sampleCodes = [
      { code: 'PHANTOM10', percent: 10, description: 'First badge reward' },
      { code: 'LURKER15', percent: 15, description: 'Regular user reward' },
      { code: 'FIREWALL20', percent: 20, description: 'Firewall tier bonus' },
      { code: 'LEGEND50', percent: 50, description: 'Achievement master reward' }
    ];

    for (let i = 0; i < sampleCodes.length && i < someUsers.length; i++) {
      const codeData = sampleCodes[i];
      const user = someUsers[i];
      const badge = someBadges[i];

      try {
        const existing = await db.select()
          .from(discountCodes)
          .where(eq(discountCodes.code, codeData.code))
          .limit(1);

        if (existing.length === 0) {
          await db.insert(discountCodes).values({
            id: nanoid(),
            code: codeData.code,
            percent: codeData.percent,
            userId: user.id,
            badgeId: badge.id,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            createdAt: new Date()
          });

          console.log(`  ✓ Created discount code: ${codeData.code} (${codeData.percent}%)`);
        }
      } catch (error) {
        console.warn(`  ⚠️  Could not create discount code ${codeData.code}:`, error);
      }
    }
  }

  private printSummary(): void {
    console.log('\n📊 SEEDING SUMMARY');
    console.log('==================');
    console.log(`Users created: ${this.createdUsers.length}`);
    console.log(`User badges created: ${this.createdBadges.length}`);
    console.log(`Dummy users: ${DUMMY_USERS.length} total`);
    
    console.log('\n🎯 Test Scenarios Available:');
    DUMMY_USERS.forEach(user => {
      console.log(`  • ${user.email}: ${user.characteristics}`);
    });

    console.log('\n💡 Next Steps:');
    console.log('  • Visit /badges/locker to see user badge collections');
    console.log('  • Test badge API endpoints with dummy user data'); 
    console.log('  • Check admin console for badge management');
  }
}

// =====================================
// SEEDER RUNNER
// =====================================

export async function seedBadgeSystem(): Promise<void> {
  const seeder = new BadgeSeeder();
  await seeder.seed();
}

// CLI runner for standalone execution
export async function main() {
  console.log('CTRL+ALT+BLOCK™ Badge System Dummy Data Seeder');
  console.log('==============================================');

  try {
    await seedBadgeSystem();
  } catch (error) {
    console.error('\n❌ SEEDING FAILED');
    console.error(error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
