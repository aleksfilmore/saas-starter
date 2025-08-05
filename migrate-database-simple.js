// Simple migration script to add missing columns one by one
const { neon } = require('@neondatabase/serverless');

require('dotenv').config({ path: '.env.local' });

async function migrateDatabase() {
  try {
    console.log('🔧 Starting database migration...');
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Check current schema first
    console.log('📊 Checking current schema...');
    const currentColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `;
    
    console.log('Current columns:', currentColumns.map(c => c.column_name));
    
    // Define columns to add
    const columnsToAdd = [
      { name: 'username', sql: 'username TEXT' },
      { name: 'avatar', sql: 'avatar TEXT' },
      { name: 'onboarding_completed', sql: 'onboarding_completed BOOLEAN NOT NULL DEFAULT false' },
      { name: 'reset_token', sql: 'reset_token TEXT' },
      { name: 'reset_token_expiry', sql: 'reset_token_expiry TIMESTAMP WITH TIME ZONE' },
      { name: 'subscription_tier', sql: 'subscription_tier TEXT NOT NULL DEFAULT \'ghost_mode\'' },
      { name: 'xp_points', sql: 'xp_points INTEGER NOT NULL DEFAULT 0' },
      { name: 'byte_balance', sql: 'byte_balance INTEGER NOT NULL DEFAULT 100' },
      { name: 'glow_up_level', sql: 'glow_up_level INTEGER NOT NULL DEFAULT 1' },
      { name: 'xp', sql: 'xp INTEGER NOT NULL DEFAULT 0' },
      { name: 'level', sql: 'level INTEGER NOT NULL DEFAULT 1' },
      { name: 'bytes', sql: 'bytes INTEGER NOT NULL DEFAULT 100' },
      { name: 'streak', sql: 'streak INTEGER NOT NULL DEFAULT 0' },
      { name: 'longest_streak', sql: 'longest_streak INTEGER NOT NULL DEFAULT 0' },
      { name: 'no_contact_days', sql: 'no_contact_days INTEGER NOT NULL DEFAULT 0' },
      { name: 'ux_stage', sql: 'ux_stage TEXT DEFAULT \'newcomer\'' },
      { name: 'ai_quota_used', sql: 'ai_quota_used INTEGER NOT NULL DEFAULT 0' },
      { name: 'ai_quota_reset_at', sql: 'ai_quota_reset_at TIMESTAMP WITH TIME ZONE' },
      { name: 'is_admin', sql: 'is_admin BOOLEAN NOT NULL DEFAULT false' },
      { name: 'is_banned', sql: 'is_banned BOOLEAN NOT NULL DEFAULT false' },
      { name: 'last_active_at', sql: 'last_active_at TIMESTAMP WITH TIME ZONE' },
      { name: 'created_at', sql: 'created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()' },
      { name: 'updated_at', sql: 'updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()' }
    ];
    
    const existingColumnNames = currentColumns.map(c => c.column_name);
    
    console.log('📋 Adding missing columns...');
    
    for (const column of columnsToAdd) {
      if (existingColumnNames.includes(column.name)) {
        console.log(`⚠️  Column '${column.name}' already exists, skipping...`);
        continue;
      }
      
      try {
        await sql`ALTER TABLE users ADD COLUMN ${sql.unsafe(column.sql)}`;
        console.log(`✅ Added column: ${column.name}`);
      } catch (error) {
        console.error(`❌ Failed to add column '${column.name}':`, error.message);
      }
    }
    
    // Update existing users with default values
    console.log('🔄 Setting initial values for existing users...');
    
    try {
      // Set admin status for admin email
      await sql`
        UPDATE users 
        SET is_admin = true, ux_stage = 'system_admin'
        WHERE email LIKE '%admin%' AND is_admin IS NOT NULL
      `;
      console.log('✅ Set admin status for admin users');
      
      // Set usernames for existing users without them
      await sql`
        UPDATE users 
        SET username = 'user_' || SUBSTRING(id, 1, 8)
        WHERE username IS NULL
      `;
      console.log('✅ Set usernames for existing users');
      
      // Set onboarding completed for existing users
      await sql`
        UPDATE users 
        SET onboarding_completed = true
        WHERE onboarding_completed = false OR onboarding_completed IS NULL
      `;
      console.log('✅ Set onboarding completed for existing users');
      
    } catch (error) {
      console.error('⚠️  Error updating user data:', error.message);
    }
    
    // Verify the migration
    console.log('📊 Verifying migration...');
    const finalColumns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `;
    
    console.log('📋 Final users table schema:');
    console.table(finalColumns);
    
    // Test a sample user query
    const testUsers = await sql`
      SELECT 
        id, email, username, xp, level, bytes, streak, 
        is_admin, onboarding_completed, ux_stage 
      FROM users 
      LIMIT 3
    `;
    
    console.log('📋 Sample user data:');
    console.table(testUsers);
    
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    process.exit();
  }
}

migrateDatabase();
