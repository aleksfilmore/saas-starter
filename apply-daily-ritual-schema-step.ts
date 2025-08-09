/**
 * Apply Daily Ritual Database Schema - One table at a time
 * Run with: npx tsx apply-daily-ritual-schema-step.ts
 */

import { db, client } from '@/lib/db';

async function applySchemaStepByStep() {
  try {
    console.log('🔄 Applying daily ritual database schema step by step...');
    
    // Step 1: Daily Ritual Assignments Table
    console.log('📝 Creating daily_ritual_assignments table...');
    await client`
      CREATE TABLE IF NOT EXISTS daily_ritual_assignments (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          assigned_date DATE NOT NULL,
          ritual_1_id VARCHAR(100) NOT NULL,
          ritual_2_id VARCHAR(100) NOT NULL,
          allocation_mode VARCHAR(20) DEFAULT 'guided' CHECK (allocation_mode IN ('guided', 'random')),
          user_weeks_at_assignment INTEGER DEFAULT 0,
          has_rerolled BOOLEAN DEFAULT FALSE,
          reroll_used_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          
          UNIQUE(user_id, assigned_date)
      );
    `;
    console.log('✅ daily_ritual_assignments created');
    
    // Step 2: Daily Ritual Completions Table
    console.log('📝 Creating daily_ritual_completions table...');
    await client`
      CREATE TABLE IF NOT EXISTS daily_ritual_completions (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          assignment_id INTEGER NOT NULL REFERENCES daily_ritual_assignments(id) ON DELETE CASCADE,
          ritual_id VARCHAR(100) NOT NULL,
          journal_text TEXT NOT NULL,
          mood_rating INTEGER CHECK (mood_rating BETWEEN 1 AND 7),
          dwell_time_seconds INTEGER DEFAULT 0,
          word_count INTEGER DEFAULT 0,
          xp_earned INTEGER DEFAULT 0,
          bytes_earned INTEGER DEFAULT 0,
          completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          
          UNIQUE(user_id, assignment_id, ritual_id)
      );
    `;
    console.log('✅ daily_ritual_completions created');
    
    // Step 3: User Daily State Table
    console.log('📝 Creating user_daily_state table...');
    await client`
      CREATE TABLE IF NOT EXISTS user_daily_state (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          state_date DATE NOT NULL,
          rituals_completed_today INTEGER DEFAULT 0,
          daily_cap_reached BOOLEAN DEFAULT FALSE,
          has_rerolled_today BOOLEAN DEFAULT FALSE,
          streak_days INTEGER DEFAULT 0,
          last_completion_date DATE,
          timezone VARCHAR(50) DEFAULT 'UTC',
          total_weeks_active INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          
          UNIQUE(user_id, state_date)
      );
    `;
    console.log('✅ user_daily_state created');
    
    // Step 4: User Ritual History Table
    console.log('📝 Creating user_ritual_history table...');
    await client`
      CREATE TABLE IF NOT EXISTS user_ritual_history (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          ritual_id VARCHAR(100) NOT NULL,
          last_assigned_date DATE NOT NULL,
          completion_count INTEGER DEFAULT 0,
          
          UNIQUE(user_id, ritual_id)
      );
    `;
    console.log('✅ user_ritual_history created');
    
    // Step 5: Daily Ritual Events Table
    console.log('📝 Creating daily_ritual_events table...');
    await client`
      CREATE TABLE IF NOT EXISTS daily_ritual_events (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          event_type VARCHAR(50) NOT NULL,
          event_data JSONB NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    console.log('✅ daily_ritual_events created');
    
    // Step 6: Create Indexes
    console.log('📝 Creating indexes...');
    await client`CREATE INDEX IF NOT EXISTS idx_daily_ritual_assignments_user_date ON daily_ritual_assignments(user_id, assigned_date);`;
    await client`CREATE INDEX IF NOT EXISTS idx_daily_ritual_completions_user_date ON daily_ritual_completions(user_id, completed_at);`;
    await client`CREATE INDEX IF NOT EXISTS idx_daily_ritual_completions_assignment ON daily_ritual_completions(assignment_id);`;
    await client`CREATE INDEX IF NOT EXISTS idx_user_daily_state_user_date ON user_daily_state(user_id, state_date);`;
    await client`CREATE INDEX IF NOT EXISTS idx_user_ritual_history_user ON user_ritual_history(user_id);`;
    await client`CREATE INDEX IF NOT EXISTS idx_daily_ritual_events_user_type ON daily_ritual_events(user_id, event_type);`;
    console.log('✅ Indexes created');
    
    console.log('✅ Daily ritual schema applied successfully!');
    
    // Verify tables were created
    console.log('🔍 Verifying table creation...');
    const tables = await client`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%ritual%'
      ORDER BY table_name;
    `;
    
    console.log('📊 Created ritual tables:');
    tables.forEach((row: any) => {
      console.log(`  ✓ ${row.table_name}`);
    });
    
    // Test basic functionality
    console.log('🧪 Testing basic table operations...');
    
    const assignmentsCount = await client`SELECT COUNT(*) as count FROM daily_ritual_assignments`;
    const completionsCount = await client`SELECT COUNT(*) as count FROM daily_ritual_completions`;
    const userStateCount = await client`SELECT COUNT(*) as count FROM user_daily_state`;
    const historyCount = await client`SELECT COUNT(*) as count FROM user_ritual_history`;
    
    console.log(`  📋 Assignments: ${assignmentsCount[0].count} records`);
    console.log(`  ✅ Completions: ${completionsCount[0].count} records`);
    console.log(`  👤 User States: ${userStateCount[0].count} records`);
    console.log(`  📚 History: ${historyCount[0].count} records`);
    
  } catch (error) {
    console.error('❌ Error applying schema:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the migration
applySchemaStepByStep()
  .then(() => {
    console.log('🎉 Daily ritual system is ready!');
    console.log('📌 Next steps:');
    console.log('  1. Start the dev server: npm run dev');
    console.log('  2. Visit /daily-rituals to test the system');
    console.log('  3. Check that ritual assignments are generated automatically');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });
