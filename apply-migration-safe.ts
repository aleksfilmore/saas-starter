import { db } from './lib/db';
import { sql } from 'drizzle-orm';

async function applyMigration() {
  try {
    console.log('Applying missing columns to users table...');
    
    const alterStatements = [
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_token" text',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_token_expiry" timestamp with time zone',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "tier" text DEFAULT \'freemium\' NOT NULL',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "status" text DEFAULT \'active\' NOT NULL',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "current_protocol" text',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "protocol_day" integer DEFAULT 0 NOT NULL',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "dashboard_type" text DEFAULT \'freemium\' NOT NULL',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "emotional_archetype" text',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "codename" text',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatar_style" text',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "xp" integer DEFAULT 0 NOT NULL',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "bytes" integer DEFAULT 100 NOT NULL',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "level" integer DEFAULT 1 NOT NULL',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "streak" integer DEFAULT 0 NOT NULL',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "streak_days" integer DEFAULT 0 NOT NULL',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "longest_streak" integer DEFAULT 0 NOT NULL',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "no_contact_days" integer DEFAULT 0 NOT NULL',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "ux_stage" text DEFAULT \'newcomer\'',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "ai_quota_used" integer DEFAULT 0 NOT NULL',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "ai_quota_reset_at" timestamp with time zone',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "ritual_history" text DEFAULT \'[]\'',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "therapy_history" text DEFAULT \'[]\'',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "shop_inventory" text DEFAULT \'[]\'',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "badges" text DEFAULT \'[]\'',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_ritual_completed" timestamp with time zone',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_login" timestamp with time zone'
    ];

    for (const statement of alterStatements) {
      try {
        console.log('Executing:', statement);
        await db.execute(sql.raw(statement));
        console.log('✓ Success');
      } catch (error: any) {
        if (error.code === '42701') {
          console.log('✓ Column already exists, skipping');
        } else {
          console.log('✗ Error:', error.message);
        }
      }
    }

    console.log('Migration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

applyMigration();
