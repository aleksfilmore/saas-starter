import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';

async function createBadgeSystemTables() {
  console.log('🔨 Creating complete badge system tables...');

  try {
    // 1. Add missing columns to users table
    console.log('1. Adding missing columns to users table...');
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS profile_badge_id TEXT REFERENCES badges(id),
      ADD COLUMN IF NOT EXISTS tier TEXT NOT NULL DEFAULT 'ghost',
      ADD COLUMN IF NOT EXISTS archetype TEXT
    `);

    // 2. Create badges table if not exists
    console.log('2. Creating badges table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS badges (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        tier_scope TEXT NOT NULL,
        archetype_scope TEXT,
        art_url TEXT NOT NULL,
        share_template_id TEXT,
        discount_percent INTEGER,
        discount_cap INTEGER,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `);

    // 3. Create user_badges table if not exists
    console.log('3. Creating user_badges table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_badges (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        badge_id TEXT NOT NULL REFERENCES badges(id),
        earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        applied_as_profile BOOLEAN NOT NULL DEFAULT false,
        source_event TEXT NOT NULL,
        discount_code_id TEXT
      )
    `);

    // 4. Create badge_events table if not exists
    console.log('4. Creating badge_events table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS badge_events (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        event_type TEXT NOT NULL,
        payload_json JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `);

    // 5. Create discount_codes table if not exists
    console.log('5. Creating discount_codes table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS discount_codes (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        percent INTEGER NOT NULL,
        cap_value INTEGER,
        user_id TEXT NOT NULL REFERENCES users(id),
        badge_id TEXT NOT NULL REFERENCES badges(id),
        redeemed_at TIMESTAMP WITH TIME ZONE,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `);

    // 6. Create badge_settings table if not exists
    console.log('6. Creating badge_settings table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS badge_settings (
        key TEXT PRIMARY KEY,
        value_json JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `);

    console.log('✅ All badge system tables created successfully!');

    // 7. Verify table structures
    console.log('\n🔍 Verifying table structures...');
    
    const tables = ['users', 'badges', 'user_badges', 'badge_events', 'discount_codes', 'badge_settings'];
    
    for (const tableName of tables) {
      const columns = await db.execute(sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = ${tableName}
        ORDER BY ordinal_position
      `);
      console.log(`\n${tableName}:`, columns.map(c => `${c.column_name}(${c.data_type})`).join(', '));
    }

  } catch (error) {
    console.error('❌ Error creating badge system tables:', error);
    throw error;
  }
}

createBadgeSystemTables()
  .then(() => {
    console.log('\n🎉 Badge system tables setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });
