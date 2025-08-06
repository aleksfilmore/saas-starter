import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.POSTGRES_URL!);

async function fixDatabase() {
  console.log('🔧 Fixing database schema...');
  
  try {
    // First, let's add the missing tier column to users table
    console.log('📊 Adding tier column to users table...');
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS tier text DEFAULT 'freemium';
    `;
    
    // Add tier-related columns
    console.log('📊 Adding tier-related columns...');
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS tier_start_date timestamp DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS auto_tier_upgrade boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS bytes integer DEFAULT 0,
      ADD COLUMN IF NOT EXISTS level integer DEFAULT 1,
      ADD COLUMN IF NOT EXISTS xp integer DEFAULT 0;
    `;
    
    // Add no-contact columns
    console.log('🛡️ Adding no-contact tracking columns...');
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS last_no_contact_checkin timestamp,
      ADD COLUMN IF NOT EXISTS no_contact_streak_threatened boolean DEFAULT false;
    `;
    
    // Create or update rituals table
    console.log('📜 Creating rituals table...');
    await sql`
      CREATE TABLE IF NOT EXISTS rituals (
        id text PRIMARY KEY,
        user_id text REFERENCES users(id) ON DELETE CASCADE,
        title text NOT NULL,
        description text,
        category text,
        duration_minutes integer,
        archetype text[],
        tags text[],
        user_tier text DEFAULT 'freemium',
        content text,
        assigned_at timestamp DEFAULT CURRENT_TIMESTAMP,
        completed_at timestamp,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Create no_contact_messages table
    console.log('💬 Creating no_contact_messages table...');
    await sql`
      CREATE TABLE IF NOT EXISTS no_contact_messages (
        id serial PRIMARY KEY,
        day integer NOT NULL UNIQUE,
        title text NOT NULL,
        message text NOT NULL,
        milestone_bytes integer DEFAULT 0,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    console.log('✅ Database schema fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing database:', error);
    throw error;
  }
}

fixDatabase().catch(console.error);
