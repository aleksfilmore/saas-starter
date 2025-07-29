const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
require('dotenv').config();

async function setupDatabase() {
  const client = postgres(process.env.POSTGRES_URL);
  const db = drizzle(client);
  
  try {
    // Create the new tables manually
    await client`
      CREATE TABLE IF NOT EXISTS daily_check_ins (
        id text PRIMARY KEY,
        user_id integer NOT NULL REFERENCES users(id),
        period_id text NOT NULL REFERENCES no_contact_periods(id),
        check_in_date timestamp with time zone NOT NULL,
        did_text_trash boolean DEFAULT false NOT NULL,
        mood integer NOT NULL,
        had_intrusive_thoughts boolean DEFAULT false NOT NULL,
        notes text,
        created_at timestamp with time zone DEFAULT now() NOT NULL
      );
    `;
    
    await client`
      CREATE TABLE IF NOT EXISTS anonymous_posts (
        id text PRIMARY KEY,
        user_id integer REFERENCES users(id),
        content text NOT NULL,
        category text DEFAULT 'general' NOT NULL,
        hearts integer DEFAULT 0 NOT NULL,
        is_active boolean DEFAULT true NOT NULL,
        created_at timestamp with time zone DEFAULT now() NOT NULL
      );
    `;
    
    await client`
      CREATE TABLE IF NOT EXISTS anonymous_post_hearts (
        id text PRIMARY KEY,
        post_id text NOT NULL REFERENCES anonymous_posts(id),
        user_id integer NOT NULL REFERENCES users(id),
        created_at timestamp with time zone DEFAULT now() NOT NULL
      );
    `;
    
    await client`
      CREATE TABLE IF NOT EXISTS ai_letters (
        id text PRIMARY KEY,
        user_id integer NOT NULL REFERENCES users(id),
        letter_type text NOT NULL,
        recipient text NOT NULL,
        emotion text NOT NULL,
        scenario text NOT NULL,
        generated_content text NOT NULL,
        is_private boolean DEFAULT true NOT NULL,
        was_sent boolean DEFAULT false NOT NULL,
        created_at timestamp with time zone DEFAULT now() NOT NULL
      );
    `;
    
    // Add new columns to existing table
    await client`
      ALTER TABLE no_contact_periods 
      ADD COLUMN IF NOT EXISTS streak_shields_used integer DEFAULT 0 NOT NULL,
      ADD COLUMN IF NOT EXISTS max_streak_shields_per_week integer DEFAULT 1 NOT NULL;
    `;
    
    console.log('✅ Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    await client.end();
  }
}

setupDatabase();
