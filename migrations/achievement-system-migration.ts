/**
 * Achievement System Migration for CTRL+ALT+BLOCK
 * 
 * Creates tables for achievements, multipliers, and progress tracking
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ No database connection string found');
  console.error('Please set POSTGRES_URL or DATABASE_URL environment variable');
  process.exit(1);
}

const sql = postgres(connectionString);
const db = drizzle(sql);

async function runAchievementMigration() {
  console.log('🚀 Starting Achievement System Migration...');
  
  try {
    // Create user_achievements table
    console.log('📋 Creating user_achievements table...');
    await sql`
      CREATE TABLE IF NOT EXISTS user_achievements (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        achievement_id TEXT NOT NULL,
        awarded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        byte_reward INTEGER NOT NULL DEFAULT 0,
        metadata JSON,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        
        UNIQUE(user_id, achievement_id)
      );
    `;

    // Create user_multipliers table
    console.log('⚡ Creating user_multipliers table...');
    await sql`
      CREATE TABLE IF NOT EXISTS user_multipliers (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        multiplier_id TEXT NOT NULL,
        multiplier REAL NOT NULL,
        activated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        source_achievement_id TEXT,
        usage_count INTEGER NOT NULL DEFAULT 0,
        total_bytes_multiplied INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `;

    // Create achievement_progress table
    console.log('📊 Creating achievement_progress table...');
    await sql`
      CREATE TABLE IF NOT EXISTS achievement_progress (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        achievement_id TEXT NOT NULL,
        current_value INTEGER NOT NULL DEFAULT 0,
        target_value INTEGER NOT NULL,
        progress_percentage REAL NOT NULL DEFAULT 0,
        last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        first_progress_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        
        UNIQUE(user_id, achievement_id)
      );
    `;

    // Create indexes for performance
    console.log('🔍 Creating performance indexes...');
    
    await sql`CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_achievements_awarded_at ON user_achievements(awarded_at);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);`;
    
    await sql`CREATE INDEX IF NOT EXISTS idx_user_multipliers_user_id ON user_multipliers(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_multipliers_active ON user_multipliers(is_active, expires_at);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_multipliers_expires ON user_multipliers(expires_at);`;
    
    await sql`CREATE INDEX IF NOT EXISTS idx_achievement_progress_user_id ON achievement_progress(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_achievement_progress_achievement ON achievement_progress(achievement_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_achievement_progress_updated ON achievement_progress(last_updated);`;

    // Verify tables exist
    console.log('✅ Verifying table creation...');
    
    const achievementTableCheck = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'user_achievements';
    `;
    
    const multiplierTableCheck = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'user_multipliers';
    `;
    
    const progressTableCheck = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'achievement_progress';
    `;

    if (achievementTableCheck.length === 0) {
      throw new Error('user_achievements table was not created');
    }
    
    if (multiplierTableCheck.length === 0) {
      throw new Error('user_multipliers table was not created');
    }
    
    if (progressTableCheck.length === 0) {
      throw new Error('achievement_progress table was not created');
    }

    console.log('🎯 Achievement System Migration completed successfully!');
    console.log('');
    console.log('📋 Tables created:');
    console.log('   ✅ user_achievements - tracks earned achievements');
    console.log('   ✅ user_multipliers - tracks active byte multipliers');
    console.log('   ✅ achievement_progress - tracks progress toward achievements');
    console.log('');
    console.log('🔍 Indexes created for optimal performance');
    console.log('');
    console.log('🎉 Achievement system is ready for use!');

  } catch (error) {
    console.error('❌ Achievement System Migration failed:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

// Run migration if called directly
if (require.main === module) {
  runAchievementMigration()
    .then(() => {
      console.log('✅ Achievement migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Achievement migration failed:', error);
      process.exit(1);
    });
}

export { runAchievementMigration };
