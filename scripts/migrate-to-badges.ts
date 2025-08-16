// CTRL+ALT+BLOCK™ Badge System Migration
// Migrates users from old XP/Bytes/Levels system to new badge-only system

import { db } from '@/lib/db/drizzle';
import { badges, userBadges, users, badgeEvents } from '@/lib/db/badges-schema';
import { eq, sql, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// =====================================
// MIGRATION CONFIGURATION
// =====================================

interface MigrationConfig {
  // XP thresholds for badge migration
  xpThresholds: {
    starter: 100;      // G0_Phantom
    consistent: 500;   // G1_Lurker  
    dedicated: 1500;   // G2_Presence
    master: 3000;      // G3_Manifest
  };
  
  // Level thresholds for Firewall badges
  levelThresholds: {
    ritualMaster: 10;  // F2 badges (Tuner series)
    wallEngager: 5;    // Wall interaction badges
    aiTherapist: 3;    // AI therapy completion badges
  };

  // Preserve user progress
  preserveOriginalData: boolean;
  
  // Dry run mode
  dryRun: boolean;
}

const DEFAULT_CONFIG: MigrationConfig = {
  xpThresholds: {
    starter: 100,
    consistent: 500,
    dedicated: 1500,
    master: 3000
  },
  levelThresholds: {
    ritualMaster: 10,
    wallEngager: 5,
    aiTherapist: 3
  },
  preserveOriginalData: true,
  dryRun: false
};

// =====================================
// LEGACY DATA INTERFACES
// =====================================

interface LegacyUser {
  id: string;
  email: string;
  tier: 'ghost' | 'firewall';
  archetype?: string;
  xp?: number;
  level?: number;
  bytes?: number;
  currentStreak?: number;
  totalRituals?: number;
  wallInteractions?: number;
  aiTherapySessions?: number;
}

interface MigrationResult {
  userId: string;
  userEmail: string;
  tier: string;
  archetype: string | null;
  badgesAwarded: string[];
  xpMigrated: number;
  levelMigrated: number;
  errors: string[];
}

// =====================================
// MIGRATION LOGIC
// =====================================

class BadgeMigrator {
  private config: MigrationConfig;
  private migrationResults: MigrationResult[] = [];

  constructor(config: Partial<MigrationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async migrate(): Promise<MigrationResult[]> {
    console.log('Starting badge system migration...');
    console.log('Config:', this.config);

    try {
      // 1. Load legacy users with XP/Level data
      const legacyUsers = await this.loadLegacyUsers();
      console.log(`Found ${legacyUsers.length} users to migrate`);

      // 2. Process each user
      for (const user of legacyUsers) {
        const result = await this.migrateUser(user);
        this.migrationResults.push(result);
      }

      // 3. Generate summary
      this.printMigrationSummary();

      return this.migrationResults;

    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  private async loadLegacyUsers(): Promise<LegacyUser[]> {
    // This would need to query your existing users table
    // Adjust the query based on your actual schema
    const query = sql`
      SELECT 
        id,
        email,
        tier,
        archetype,
        xp,
        level,
        bytes,
        current_streak,
        total_rituals,
        wall_interactions,
        ai_therapy_sessions
      FROM users 
      WHERE (xp > 0 OR level > 0 OR bytes > 0)
      ORDER BY xp DESC
    `;

    try {
      const result = await db.execute(query);
      // Handle the result based on your Drizzle version
      const rows = Array.isArray(result) ? result : (result as any).rows || [];
      return rows.map((row: any) => ({
        id: String(row.id),
        email: String(row.email),
        tier: String(row.tier) as 'ghost' | 'firewall',
        archetype: row.archetype ? String(row.archetype) : undefined,
        xp: row.xp ? Number(row.xp) : 0,
        level: row.level ? Number(row.level) : 0,
        bytes: row.bytes ? Number(row.bytes) : 0,
        currentStreak: row.current_streak ? Number(row.current_streak) : 0,
        totalRituals: row.total_rituals ? Number(row.total_rituals) : 0,
        wallInteractions: row.wall_interactions ? Number(row.wall_interactions) : 0,
        aiTherapySessions: row.ai_therapy_sessions ? Number(row.ai_therapy_sessions) : 0
      }));
    } catch (error) {
      console.warn('Could not load legacy data, using fallback method');
      // Fallback: load users and assume zero legacy stats
      const basicUsers = await db.select().from(users);
      return basicUsers.map(user => ({
        id: user.id,
        email: user.email || '',
        tier: (user.tier as 'ghost' | 'firewall') || 'ghost',
        archetype: user.archetype || undefined,
        xp: 0,
        level: 0,
        bytes: 0,
        currentStreak: 0,
        totalRituals: 0,
        wallInteractions: 0,
        aiTherapySessions: 0
      }));
    }
  }

  private async migrateUser(user: LegacyUser): Promise<MigrationResult> {
    const result: MigrationResult = {
      userId: user.id,
      userEmail: user.email,
      tier: user.tier,
      archetype: user.archetype || null,
      badgesAwarded: [],
      xpMigrated: user.xp || 0,
      levelMigrated: user.level || 0,
      errors: []
    };

    try {
      // Check if user already has badges (skip if already migrated)
      const existingBadges = await db.select().from(userBadges).where(eq(userBadges.userId, user.id));
      if (existingBadges.length > 0) {
        result.errors.push('User already has badges, skipping migration');
        return result;
      }

      // Determine badges based on XP/Level progression
      const badgesToAward = this.calculateBadges(user);
      
      // Award badges
      for (const badgeId of badgesToAward) {
        if (!this.config.dryRun) {
          await this.awardBadge(user.id, badgeId, 'migration');
        }
        result.badgesAwarded.push(badgeId);
      }

      // Set profile badge for Firewall users (first badge or archetype badge)
      if (user.tier === 'firewall' && badgesToAward.length > 0 && !this.config.dryRun) {
        const profileBadgeId = this.selectProfileBadge(badgesToAward, user.archetype);
        if (profileBadgeId) {
          await this.setProfileBadge(user.id, profileBadgeId);
        }
      }

      console.log(`✓ Migrated ${user.email}: ${badgesToAward.length} badges`);

    } catch (error) {
      result.errors.push(`Migration error: ${error}`);
      console.error(`✗ Failed to migrate ${user.email}:`, error);
    }

    return result;
  }

  private calculateBadges(user: LegacyUser): string[] {
    const badges: string[] = [];
    const xp = user.xp || 0;
    const level = user.level || 0;

    // XP-based progression badges (available to all tiers)
    if (xp >= this.config.xpThresholds.starter) {
      badges.push('G0_Phantom'); // First badge
    }
    if (xp >= this.config.xpThresholds.consistent) {
      badges.push('G1_Lurker'); // Consistent user
    }
    if (xp >= this.config.xpThresholds.dedicated) {
      badges.push('G2_Presence'); // Dedicated user
    }
    if (xp >= this.config.xpThresholds.master) {
      badges.push('G3_Manifest'); // Master user
    }

    // Firewall-specific badges based on level/activity
    if (user.tier === 'firewall') {
      // Archetype F1 badge (immediate for Firewall users)
      if (user.archetype) {
        const f1Badge = this.getArchetypeF1Badge(user.archetype);
        if (f1Badge) badges.push(f1Badge);
      }

      // Ritual mastery (F2 Tuner badges)
      if (level >= this.config.levelThresholds.ritualMaster) {
        const f2Badge = this.getArchetypeF2Badge(user.archetype);
        if (f2Badge) badges.push(f2Badge);
      }

      // Wall engagement
      if ((user.wallInteractions || 0) >= 20) {
        const f3Badge = this.getArchetypeF3Badge(user.archetype);
        if (f3Badge) badges.push(f3Badge);
      }

      // AI therapy completion
      if ((user.aiTherapySessions || 0) >= 5) {
        const f4Badge = this.getArchetypeF4Badge(user.archetype);
        if (f4Badge) badges.push(f4Badge);
      }

      // Global Firewall badges (X-series)
      if (level >= 20) badges.push('X1_Firewall');
      if (level >= 30 && (user.currentStreak || 0) >= 14) badges.push('X2_Phoenix');
      if (level >= 40) badges.push('X3_Eternal');
      if (level >= 50) badges.push('X4_Legend');
    }

    // Limit badges based on tier
    const maxBadges = user.tier === 'ghost' ? 4 : 10;
    return badges.slice(0, maxBadges);
  }

  private getArchetypeF1Badge(archetype?: string): string | null {
    const mapping: Record<string, string> = {
      'DF': 'F1_DF', // Stream Stabilized
      'FB': 'F1_FB', // Barrier Synchronized  
      'GS': 'F1_GS', // Echo Stabilized
      'SN': 'F1_SN'  // Node Synchronized
    };
    return archetype ? mapping[archetype] || null : null;
  }

  private getArchetypeF2Badge(archetype?: string): string | null {
    const mapping: Record<string, string> = {
      'DF': 'F2_DF', // Signal Tuner
      'FB': 'F2_FB', // Protocol Tuner
      'GS': 'F2_GS', // Echo Tuner  
      'SN': 'F2_SN'  // Node Tuner
    };
    return archetype ? mapping[archetype] || null : null;
  }

  private getArchetypeF3Badge(archetype?: string): string | null {
    const mapping: Record<string, string> = {
      'DF': 'F3_DF', // Stream Navigator
      'FB': 'F3_FB', // Barrier Navigator
      'GS': 'F3_GS', // Echo Navigator
      'SN': 'F3_SN'  // Node Navigator
    };
    return archetype ? mapping[archetype] || null : null;
  }

  private getArchetypeF4Badge(archetype?: string): string | null {
    const mapping: Record<string, string> = {
      'DF': 'F4_DF', // Data Sage
      'FB': 'F4_FB', // Firewall Sage
      'GS': 'F4_GS', // Ghost Sage
      'SN': 'F4_SN'  // Secure Sage
    };
    return archetype ? mapping[archetype] || null : null;
  }

  private selectProfileBadge(badgeIds: string[], archetype?: string): string | null {
    // Prefer archetype-specific badge for profile
    if (archetype) {
      const archetypeBadge = badgeIds.find(id => id.includes(archetype));
      if (archetypeBadge) return archetypeBadge;
    }
    // Fall back to first badge
    return badgeIds[0] || null;
  }

  private async awardBadge(userId: string, badgeId: string, eventType: string): Promise<void> {
    const userBadgeId = nanoid();
    
    await db.insert(userBadges).values({
      id: userBadgeId,
      userId,
      badgeId,
      sourceEvent: eventType,
      earnedAt: new Date(),
      appliedAsProfile: false // Will be set separately for profile badges
    });

    // Log the badge event
    await db.insert(badgeEvents).values({
      id: nanoid(),
      userId,
      eventType,
      payloadJson: { source: 'migration', badgeId },
      createdAt: new Date()
    });
  }

  private async setProfileBadge(userId: string, badgeId: string): Promise<void> {
    // Clear existing profile badges
    await db.update(userBadges)
      .set({ appliedAsProfile: false })
      .where(eq(userBadges.userId, userId));

    // Set new profile badge
    await db.update(userBadges)
      .set({ appliedAsProfile: true })
      .where(
        and(
          eq(userBadges.userId, userId),
          eq(userBadges.badgeId, badgeId)
        )
      );
  }

  private printMigrationSummary(): void {
    console.log('\n=== MIGRATION SUMMARY ===');
    
    const totalUsers = this.migrationResults.length;
    const successfulMigrations = this.migrationResults.filter(r => r.errors.length === 0).length;
    const totalBadgesAwarded = this.migrationResults.reduce((sum, r) => sum + r.badgesAwarded.length, 0);
    
    console.log(`Total users processed: ${totalUsers}`);
    console.log(`Successful migrations: ${successfulMigrations}`);
    console.log(`Total badges awarded: ${totalBadgesAwarded}`);
    console.log(`Errors: ${totalUsers - successfulMigrations}`);

    // Badge distribution
    const badgeDistribution: Record<string, number> = {};
    this.migrationResults.forEach(result => {
      result.badgesAwarded.forEach(badgeId => {
        badgeDistribution[badgeId] = (badgeDistribution[badgeId] || 0) + 1;
      });
    });

    console.log('\nBadge distribution:');
    Object.entries(badgeDistribution)
      .sort(([,a], [,b]) => b - a)
      .forEach(([badgeId, count]) => {
        console.log(`  ${badgeId}: ${count} users`);
      });

    // Errors
    const errors = this.migrationResults.filter(r => r.errors.length > 0);
    if (errors.length > 0) {
      console.log('\nErrors:');
      errors.forEach(result => {
        console.log(`  ${result.userEmail}: ${result.errors.join(', ')}`);
      });
    }
  }
}

// =====================================
// MIGRATION RUNNER
// =====================================

export async function runBadgeMigration(config?: Partial<MigrationConfig>): Promise<MigrationResult[]> {
  const migrator = new BadgeMigrator(config);
  return await migrator.migrate();
}

// CLI runner for standalone execution
export async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const preserveData = !args.includes('--no-preserve');

  console.log('CTRL+ALT+BLOCK™ Badge Migration Tool');
  console.log('====================================');

  try {
    const results = await runBadgeMigration({
      dryRun,
      preserveOriginalData: preserveData
    });

    if (dryRun) {
      console.log('\n🔍 DRY RUN COMPLETE - No changes were made');
      console.log('Run without --dry-run to apply changes');
    } else {
      console.log('\n✅ MIGRATION COMPLETE');
      console.log('Badge system is now active!');
    }

    return results;
  } catch (error) {
    console.error('\n❌ MIGRATION FAILED');
    console.error(error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
