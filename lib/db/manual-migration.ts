import { db } from './drizzle';
import { sql } from 'drizzle-orm';

async function runMigration() {
  try {
    console.log('Creating user_daily_prescriptions table...');
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_daily_prescriptions (
        id text PRIMARY KEY NOT NULL,
        user_id integer NOT NULL,
        prescribed_date timestamp with time zone NOT NULL,
        ritual_key text NOT NULL,
        shuffles_used integer DEFAULT 0 NOT NULL,
        is_completed boolean DEFAULT false NOT NULL,
        completed_at timestamp with time zone,
        completion_notes text,
        completion_mood integer,
        created_at timestamp with time zone DEFAULT now() NOT NULL
      );
    `);

    console.log('Adding foreign key constraint...');
    await db.execute(sql`
      ALTER TABLE user_daily_prescriptions 
      ADD CONSTRAINT IF NOT EXISTS user_daily_prescriptions_user_id_users_id_fk 
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE no action ON UPDATE no action;
    `);

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigration();
