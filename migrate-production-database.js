// Migration script to add missing columns to production database
const { neon } = require('@neondatabase/serverless');

require('dotenv').config({ path: '.env.local' });

async function migrateDatabase() {
  try {
    console.log('🔧 Starting database migration...');
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Add all missing columns to users table
    console.log('📋 Adding missing columns to users table...');
    
    const addColumns = [
      // Identity & Onboarding
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT false',
      
      // Password Reset
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token TEXT',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP WITH TIME ZONE',
      
      // Subscription & Gamification
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT \'ghost_mode\'',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS xp_points INTEGER NOT NULL DEFAULT 0',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS byte_balance INTEGER NOT NULL DEFAULT 100',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS glow_up_level INTEGER NOT NULL DEFAULT 1',
      
      // Dashboard 2.0 fields
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS xp INTEGER NOT NULL DEFAULT 0',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS level INTEGER NOT NULL DEFAULT 1',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS bytes INTEGER NOT NULL DEFAULT 100',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS streak INTEGER NOT NULL DEFAULT 0',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS longest_streak INTEGER NOT NULL DEFAULT 0',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS no_contact_days INTEGER NOT NULL DEFAULT 0',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS ux_stage TEXT DEFAULT \'newcomer\'',
      
      // AI Therapy quota system
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_quota_used INTEGER NOT NULL DEFAULT 0',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_quota_reset_at TIMESTAMP WITH TIME ZONE',
      
      // Admin & Status
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN NOT NULL DEFAULT false',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE',
      
      // Timestamps
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()'
    ];
    
    for (let i = 0; i < addColumns.length; i++) {
      const query = addColumns[i];
      console.log(`🔧 Executing migration ${i + 1}/${addColumns.length}...`);
      try {
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS ${sql.unsafe(query.split('IF NOT EXISTS ')[1])}`;
        const columnName = query.match(/ADD COLUMN IF NOT EXISTS (\w+)/)?.[1] || 'unknown';
        console.log(`✅ Added column: ${columnName}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️  Column already exists, skipping...`);
        } else {
          console.error(`❌ Error adding column: ${error.message}`);
        }
      }
    }
    
    console.log('✅ Database migration completed successfully!');
    
    // Verify the migration by checking current schema
    console.log('📊 Verifying migration...');
    
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `;
    
    console.log('📋 Current users table schema:');
    console.table(columns);
    
    console.log('🎉 Migration verification completed!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    process.exit();
  }
}

migrateDatabase();
