// Local SQLite database for testing when Neon is unreachable
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Create SQLite database for local testing
const sqlite = new Database('./local-test.db');

export const localDb = drizzle(sqlite, { schema });

// Create tables if they don't exist
export async function initLocalDb() {
  try {
    // Create users table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        hashed_password TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        email_verified BOOLEAN DEFAULT FALSE,
        xp INTEGER DEFAULT 0,
        bytes INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        ritual_streak INTEGER DEFAULT 0,
        last_ritual_date TEXT,
        total_confessions INTEGER DEFAULT 0,
        total_wall_bytes INTEGER DEFAULT 0
      )
    `);

    // Create sessions table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log('✅ Local SQLite database initialized');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize local database:', error);
    return false;
  }
}
