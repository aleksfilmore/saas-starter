// Force create the users table with only essential columns
import { db } from './lib/db/drizzle';

async function createUsersTable() {
  try {
    console.log('Creating minimal users table...');
    
    // Drop and recreate users table with only essential columns
    await db.execute(`
      DROP TABLE IF EXISTS sessions CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    
    // Create users table with only essential columns
    await db.execute(`
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL
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
    
    console.log('✅ Minimal tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
}

createUsersTable();
