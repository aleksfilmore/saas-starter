#!/usr/bin/env tsx

import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';

async function checkUsersSchema() {
  console.log('🔍 Checking current users table schema...');
  
  try {
    // Get current users table structure
    const columns = await db.execute(sql`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Current users table columns:');
    columns.forEach((col: any) => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    // Check for badge-related columns
    const requiredColumns = ['tier', 'archetype', 'profile_badge_id'];
    const existingColumns = columns.map((col: any) => col.column_name);
    
    console.log('\n🎯 Badge system column check:');
    requiredColumns.forEach(col => {
      const exists = existingColumns.includes(col);
      console.log(`  ${exists ? '✅' : '❌'} ${col}: ${exists ? 'EXISTS' : 'MISSING'}`);
    });
    
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log('\n⚠️  Missing columns needed for badge system:');
      missingColumns.forEach(col => console.log(`  - ${col}`));
      console.log('\n💡 Run migrate-users-schema.ts to add these columns');
    } else {
      console.log('\n✅ All required badge system columns are present!');
    }
    
  } catch (error) {
    console.error('❌ Error checking schema:', error);
  }
}

checkUsersSchema().then(() => process.exit(0));
