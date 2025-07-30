// Force create the users table with minimal required columns
import { db } from './lib/db/drizzle';

async function createUsersTable() {
  try {
    console.log('Creating users table...');
    
    // Drop and recreate users table
    await db.execute(`
      DROP TABLE IF EXISTS user_sessions CASCADE;
      DROP TABLE IF EXISTS sessions CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    
    // Create users table with only essential columns
    await db.execute(`
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
        subscription_tier TEXT NOT NULL DEFAULT 'ghost_mode',
        xp_points INTEGER NOT NULL DEFAULT 0,
        byte_balance INTEGER NOT NULL DEFAULT 100,
        glow_up_level INTEGER NOT NULL DEFAULT 1,
        is_admin BOOLEAN NOT NULL DEFAULT FALSE,
        is_banned BOOLEAN NOT NULL DEFAULT FALSE,
        last_active_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    
    // Create sessions table
    await db.execute(`
      CREATE TABLE sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMPTZ NOT NULL
      );
    `);
    
    console.log('✅ Tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
}

createUsersTable();
