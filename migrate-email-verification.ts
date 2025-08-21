import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

async function addEmailVerificationFields() {
  console.log('🔧 Adding email verification fields to users table...');
  
  try {
    // Add email_verified column (defaults to false)
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE
    `);
    console.log('✅ Added email_verified column');

    // Add email_verification_token column
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS email_verification_token TEXT
    `);
    console.log('✅ Added email_verification_token column');

    // Add email_verification_sent_at column
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS email_verification_sent_at TIMESTAMPTZ
    `);
    console.log('✅ Added email_verification_sent_at column');

    console.log('✅ Email verification fields migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run the migration
addEmailVerificationFields()
  .then(() => {
    console.log('🎉 Migration completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });
