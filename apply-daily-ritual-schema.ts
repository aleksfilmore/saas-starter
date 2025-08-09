/**
 * Apply Daily Ritual Database Schema
 * Run with: npx tsx apply-daily-ritual-schema.ts
 */

import { db, client } from '@/lib/db';
import { readFileSync } from 'fs';
import { join } from 'path';

async function applySchema() {
  try {
    console.log('🔄 Applying daily ritual database schema...');
    
    // Read the schema file
    const schemaPath = join(process.cwd(), 'lib', 'rituals', 'daily-rituals-schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    console.log('📝 Executing SQL commands...');
    await client.unsafe(schema);
    
    console.log('✅ Daily ritual schema applied successfully!');
    
    // Verify tables were created
    console.log('🔍 Verifying table creation...');
    const tables = await client`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%ritual%'
      ORDER BY table_name;
    `;
    
    console.log('📊 Created ritual tables:');
    tables.forEach((row: any) => {
      console.log(`  ✓ ${row.table_name}`);
    });
    
    // Test basic functionality
    console.log('🧪 Testing basic table operations...');
    
    // Check if we can query the tables (they should be empty initially)
    const assignmentsCount = await client`SELECT COUNT(*) as count FROM daily_ritual_assignments`;
    const completionsCount = await client`SELECT COUNT(*) as count FROM daily_ritual_completions`;
    const userStateCount = await client`SELECT COUNT(*) as count FROM user_daily_state`;
    const historyCount = await client`SELECT COUNT(*) as count FROM user_ritual_history`;
    
    console.log(`  📋 Assignments: ${assignmentsCount[0].count} records`);
    console.log(`  ✅ Completions: ${completionsCount[0].count} records`);
    console.log(`  👤 User States: ${userStateCount[0].count} records`);
    console.log(`  📚 History: ${historyCount[0].count} records`);
    
  } catch (error) {
    console.error('❌ Error applying schema:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the migration
applySchema()
  .then(() => {
    console.log('🎉 Daily ritual system is ready!');
    console.log('📌 Next steps:');
    console.log('  1. Start the dev server: npm run dev');
    console.log('  2. Visit /daily-rituals to test the system');
    console.log('  3. Check that ritual assignments are generated automatically');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });
