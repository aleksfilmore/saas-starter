#!/usr/bin/env tsx

import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';

async function migrateUsersSchema() {
  console.log('🔧 Adding missing badge system columns to users table...');
  
  try {
    // Add missing badge system columns
    console.log('Adding profile_badge_id column...');
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS profile_badge_id TEXT REFERENCES badges(id)
    `);
    console.log('✅ Added profile_badge_id column');
    
    console.log('Adding email_opt_in column...');
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS email_opt_in BOOLEAN NOT NULL DEFAULT true
    `);
    console.log('✅ Added email_opt_in column');
    
    console.log('Adding timezone column...');
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC'
    `);
    console.log('✅ Added timezone column');
    
    // Verify the changes
    console.log('\n🔍 Verifying schema changes...');
    const columns = await db.execute(sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name IN ('tier', 'archetype', 'profile_badge_id', 'email_opt_in', 'timezone')
      ORDER BY column_name
    `);
    
    console.log('Badge system columns in users table:');
    columns.forEach((col: any) => {
      console.log(`  ✅ ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    console.log('\n🎉 Users table migration completed successfully!');
    console.log('💡 Badge system should now work without schema errors');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateUsersSchema().then(() => process.exit(0));
