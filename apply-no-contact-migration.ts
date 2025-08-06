import { db } from './lib/db';
import { sql } from 'drizzle-orm';

async function applyNoContactMigration() {
  try {
    console.log('Applying no-contact check-in migration...');
    
    const statements = [
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_no_contact_checkin" timestamp with time zone',
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "no_contact_streak_threatened" boolean DEFAULT false NOT NULL'
    ];

    for (const statement of statements) {
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

    console.log('No-contact migration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

applyNoContactMigration();
