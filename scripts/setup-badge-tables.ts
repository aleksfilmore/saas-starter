// CTRL+ALT+BLOCK™ Badge System Database Setup
// Creates badge tables using existing database connection

import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

async function createBadgeSystemTables() {
  console.log('🎯 Setting up badge system database tables...');
  
  try {
    // Create badges table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS badges (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        tier_scope TEXT NOT NULL CHECK (tier_scope IN ('ghost', 'firewall')),
        archetype_scope TEXT CHECK (archetype_scope IN ('DF', 'FB', 'GS', 'SN')),
        art_url TEXT NOT NULL,
        share_template_id TEXT,
        discount_percent INTEGER,
        discount_cap INTEGER,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✓ Created badges table');

    // Create user_badges table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_badges (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        badge_id TEXT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
        earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        applied_as_profile BOOLEAN NOT NULL DEFAULT false,
        source_event TEXT NOT NULL,
        discount_code_id TEXT,
        UNIQUE(user_id, badge_id)
      )
    `);
    console.log('✓ Created user_badges table');

    // Create badge_events table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS badge_events (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        event_type TEXT NOT NULL,
        payload_json JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✓ Created badge_events table');

    // Create discount_codes table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS discount_codes (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        percent INTEGER NOT NULL,
        cap_value INTEGER,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        badge_id TEXT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
        redeemed_at TIMESTAMPTZ,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✓ Created discount_codes table');

    // Create badge_settings table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS badge_settings (
        id TEXT PRIMARY KEY DEFAULT 'global',
        max_ghost_badges INTEGER NOT NULL DEFAULT 4,
        max_firewall_badges INTEGER NOT NULL DEFAULT 10,
        auto_profile_for_ghost BOOLEAN NOT NULL DEFAULT true,
        enable_sharing BOOLEAN NOT NULL DEFAULT true,
        require_moderation BOOLEAN NOT NULL DEFAULT false,
        daily_checkin_enabled BOOLEAN NOT NULL DEFAULT true,
        streak_multiplier NUMERIC(3,1) NOT NULL DEFAULT 1.0,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✓ Created badge_settings table');

    // Create indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_badge_events_user_id ON badge_events(user_id)`);
    console.log('✓ Created indexes');

    // Insert global settings
    await db.execute(sql`
      INSERT INTO badge_settings (id) VALUES ('global') 
      ON CONFLICT (id) DO NOTHING
    `);
    console.log('✓ Inserted global settings');

    console.log('🎉 Badge system tables created successfully!');
    return true;

  } catch (error) {
    console.error('❌ Badge system setup failed:', error);
    throw error;
  }
}

// Run setup
if (require.main === module) {
  createBadgeSystemTables()
    .then(() => {
      console.log('✅ Badge system setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Setup failed:', error);
      process.exit(1);
    });
}

export { createBadgeSystemTables };
