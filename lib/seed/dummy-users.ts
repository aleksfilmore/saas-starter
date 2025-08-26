import { db } from '@/lib/db';
import { users, anonymousPosts, userBadges, badges } from '@/lib/db/unified-schema';
import { generateId } from 'lucia';
import bcrypt from 'bcryptjs';
import { sql, eq, like } from 'drizzle-orm';

export class SeedService {
  static async createDummyUsers(): Promise<void> {
    // TEMPORARILY DISABLED: Raw SQL execute() calls incompatible with Drizzle 0.32.2
    // This feature will be re-enabled after upgrading to a newer Drizzle version
    console.log('⚠️  Dummy user seeding temporarily disabled due to Drizzle compatibility');
    return;
  }

  static async seedPostsForDummyUsers(): Promise<void> {
    // TEMPORARILY DISABLED: Raw SQL execute() calls incompatible with Drizzle 0.32.2
    console.log('⚠️  Dummy post seeding temporarily disabled due to Drizzle compatibility');
    return;
  }

  static async seedBadgesForDummyUsers(): Promise<void> {
    // TEMPORARILY DISABLED: Raw SQL execute() calls incompatible with Drizzle 0.32.2
    console.log('⚠️  Dummy badge seeding temporarily disabled due to Drizzle compatibility');
    return;
  }

  static async seedAll(): Promise<void> {
    console.log('🌱 Starting dummy data seeding (limited due to Drizzle compatibility)...');
    await this.createDummyUsers();
    await this.seedPostsForDummyUsers();
    await this.seedBadgesForDummyUsers();
    console.log('✅ Dummy data seeding completed (limited functionality)');
  }
}
