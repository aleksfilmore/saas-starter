import { config } from 'dotenv';
import { db } from './lib/db/drizzle';
import { sql } from 'drizzle-orm';

// Load environment variables
config({ path: '.env.local' });

async function executeSQL(sqlStatement: string, description: string) {
  try {
    console.log(`🔧 ${description}...`);
    await db.execute(sql.raw(sqlStatement));
    console.log(`✅ ${description} - SUCCESS`);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      console.log(`⚠️ ${description} - ALREADY EXISTS`);
      return true;
    } else {
      console.error(`❌ ${description} - FAILED:`, error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }
}

async function setupDatabase() {
  console.log('🚀 Starting simplified database setup...\n');
  
  let success = true;
  
  // 1. Create rituals table
  const createRitualsTable = `
    CREATE TABLE IF NOT EXISTS rituals (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT,
      steps JSONB NOT NULL,
      archetype TEXT[] NOT NULL,
      difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5) NOT NULL DEFAULT 1,
      media_refs JSONB DEFAULT '{}',
      tags TEXT[] DEFAULT ARRAY[]::TEXT[],
      category TEXT NOT NULL,
      emotional_tone TEXT CHECK (emotional_tone IN ('rage', 'softness', 'grief', 'spite', 'neutral')) DEFAULT 'neutral',
      action_type TEXT CHECK (action_type IN ('reflect', 'destroy', 'create', 'share', 'digital')) DEFAULT 'reflect',
      tier TEXT CHECK (tier IN ('ghost', 'firewall', 'deep-reset')) DEFAULT 'ghost',
      estimated_time TEXT DEFAULT '10 minutes',
      xp_reward INTEGER DEFAULT 15,
      byte_reward INTEGER DEFAULT 25,
      is_milestone BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  if (!await executeSQL(createRitualsTable, 'Creating rituals table')) success = false;
  
  // 2. Create user_rituals table
  const createUserRitualsTable = `
    CREATE TABLE IF NOT EXISTS user_rituals (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      ritual_id UUID NOT NULL REFERENCES rituals(id) ON DELETE CASCADE,
      completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      xp_earned INTEGER DEFAULT 0,
      bytes_earned INTEGER DEFAULT 0,
      completion_data JSONB DEFAULT '{}',
      UNIQUE(user_id, ritual_id)
    )
  `;
  
  if (!await executeSQL(createUserRitualsTable, 'Creating user_rituals table')) success = false;
  
  // 3. Create ritual_assignments table
  const createRitualAssignmentsTable = `
    CREATE TABLE IF NOT EXISTS ritual_assignments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      ritual_id UUID NOT NULL REFERENCES rituals(id) ON DELETE CASCADE,
      assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
      reroll_count INTEGER DEFAULT 0,
      rerolled_at TIMESTAMP WITH TIME ZONE,
      is_active BOOLEAN DEFAULT true,
      UNIQUE(user_id, assigned_date)
    )
  `;
  
  if (!await executeSQL(createRitualAssignmentsTable, 'Creating ritual_assignments table')) success = false;
  
  // 4. Create no_contact_messages table
  const createNoContactMessagesTable = `
    CREATE TABLE IF NOT EXISTS no_contact_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      day INTEGER UNIQUE NOT NULL CHECK (day >= 1 AND day <= 90),
      body TEXT NOT NULL,
      is_milestone BOOLEAN DEFAULT false,
      bytes_reward INTEGER DEFAULT 10,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  if (!await executeSQL(createNoContactMessagesTable, 'Creating no_contact_messages table')) success = false;
  
  // 5. Create no_contact_streaks table
  const createNoContactStreaksTable = `
    CREATE TABLE IF NOT EXISTS no_contact_streaks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      start_date DATE NOT NULL DEFAULT CURRENT_DATE,
      current_day INTEGER DEFAULT 1 CHECK (current_day >= 0 AND current_day <= 90),
      last_check_date DATE,
      total_shields_used INTEGER DEFAULT 0,
      last_shield_used DATE,
      is_active BOOLEAN DEFAULT true,
      completed_90_days BOOLEAN DEFAULT false,
      completed_at TIMESTAMP WITH TIME ZONE,
      total_bytes_earned INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, start_date)
    )
  `;
  
  if (!await executeSQL(createNoContactStreaksTable, 'Creating no_contact_streaks table')) success = false;
  
  // 6. Create indexes
  const createIndexes = [
    'CREATE INDEX IF NOT EXISTS idx_user_rituals_user_id ON user_rituals(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_user_rituals_completed_at ON user_rituals(completed_at)',
    'CREATE INDEX IF NOT EXISTS idx_ritual_assignments_user_date ON ritual_assignments(user_id, assigned_date)',
    'CREATE INDEX IF NOT EXISTS idx_rituals_archetype ON rituals USING GIN(archetype)',
    'CREATE INDEX IF NOT EXISTS idx_rituals_category ON rituals(category)',
    'CREATE INDEX IF NOT EXISTS idx_no_contact_streaks_user_active ON no_contact_streaks(user_id, is_active)'
  ];
  
  for (const indexSQL of createIndexes) {
    await executeSQL(indexSQL, `Creating index`);
  }
  
  if (success) {
    console.log('\n🎉 Database schema setup completed successfully!');
    console.log('📊 Tables created:');
    console.log('  • rituals - Master ritual library');
    console.log('  • user_rituals - User completion tracking');
    console.log('  • ritual_assignments - Daily assignments');
    console.log('  • no_contact_messages - 90-day message bank');
    console.log('  • no_contact_streaks - User streak tracking');
    console.log('  • All necessary indexes');
    return true;
  } else {
    console.log('\n⚠️ Schema setup completed with some errors');
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  setupDatabase()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

export { setupDatabase };
