const { drizzle } = require('drizzle-orm/neon-http');
const { neon } = require('@neondatabase/serverless');

async function runMigration() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);
    
    console.log('Adding email_notifications column to users table...');
    
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN NOT NULL DEFAULT true`;
    
    console.log('✅ Email notifications column added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
