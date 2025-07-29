import { db } from './drizzle';
import { sql } from 'drizzle-orm';

async function fixDatabaseSchema() {
  try {
    console.log('Fixing database schema...');
    
    // First, check current schema
    console.log('Checking current users table structure...');
    const usersColumns = await db.execute(sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);
    
    console.log('Current users table:');
    console.table(usersColumns);
    
    // Check if password_hash column exists
    const hasPasswordHash = usersColumns.some(col => col.column_name === 'password_hash');
    const hasHashedPassword = usersColumns.some(col => col.column_name === 'hashed_password');
    
    console.log(`Has password_hash: ${hasPasswordHash}`);
    console.log(`Has hashed_password: ${hasHashedPassword}`);
    
    // If we have hashed_password but not password_hash, rename it
    if (hasHashedPassword && !hasPasswordHash) {
      console.log('Renaming hashed_password to password_hash...');
      await db.execute(sql`
        ALTER TABLE users RENAME COLUMN hashed_password TO password_hash;
      `);
      console.log('✅ Column renamed successfully');
    }
    
    // If we don't have a password column at all, add it
    if (!hasPasswordHash && !hasHashedPassword) {
      console.log('Adding password_hash column...');
      await db.execute(sql`
        ALTER TABLE users ADD COLUMN password_hash text NOT NULL DEFAULT '';
      `);
      console.log('✅ Password column added');
    }
    
    // Ensure sessions table exists with correct structure
    console.log('Ensuring sessions table exists...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id text PRIMARY KEY NOT NULL,
        user_id integer NOT NULL,
        expires_at timestamp with time zone NOT NULL
      );
    `);
    
    // Add foreign key constraint if it doesn't exist
    console.log('Adding sessions foreign key constraint...');
    await db.execute(sql`
      DO $$ BEGIN
        ALTER TABLE sessions ADD CONSTRAINT sessions_user_id_users_id_fk 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE no action ON UPDATE no action;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    console.log('✅ Database schema fixed successfully!');
    
  } catch (error) {
    console.error('❌ Database schema fix failed:', error);
  }
}

fixDatabaseSchema();
