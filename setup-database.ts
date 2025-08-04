import { config } from 'dotenv';
import { db } from './lib/db/drizzle';
import { sql } from 'drizzle-orm';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
config({ path: '.env.local' });

const execAsync = promisify(exec);

async function runSqlFile(filePath: string) {
  try {
    const sqlContent = fs.readFileSync(filePath, 'utf-8');
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📄 Running ${path.basename(filePath)}...`);
    
    for (const statement of statements) {
      try {
        await db.execute(sql.raw(statement));
      } catch (error) {
        // Ignore table already exists errors
        if (!(error instanceof Error && error.message.includes('already exists'))) {
          console.error(`❌ SQL Error in ${filePath}:`, error instanceof Error ? error.message : 'Unknown error');
          throw error;
        }
      }
    }
    
    console.log(`✅ ${path.basename(filePath)} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to run ${filePath}:`, error);
    return false;
  }
}

async function runSeeder(modulePath: string, functionName: string) {
  try {
    console.log(`🌱 Running seeder: ${functionName}...`);
    const seederModule = await import(modulePath);
    const seederFunction = seederModule[functionName];
    
    if (typeof seederFunction !== 'function') {
      throw new Error(`Function ${functionName} not found in ${modulePath}`);
    }
    
    const result = await seederFunction();
    if (result) {
      console.log(`✅ ${functionName} completed successfully`);
    } else {
      console.log(`⚠️ ${functionName} completed with warnings`);
    }
    
    return result;
  } catch (error) {
    console.error(`❌ Failed to run ${functionName}:`, error);
    return false;
  }
}

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');
  
  let success = true;
  
  try {
    // 1. Run ritual schema migration
    console.log('📊 Setting up ritual system...');
    const ritualSchemaSuccess = await runSqlFile('./lib/db/ritual-schema.sql');
    if (!ritualSchemaSuccess) success = false;
    
    // 2. Run no-contact schema migration  
    console.log('\n🛡️ Setting up no-contact tracker...');
    const noContactSchemaSuccess = await runSqlFile('./lib/db/no-contact-schema.sql');
    if (!noContactSchemaSuccess) success = false;
    
    // 3. Seed ritual content
    console.log('\n🎯 Seeding ritual content...');
    const ritualSeedSuccess = await runSeeder('./lib/db/seed-rituals', 'seedRituals');
    if (!ritualSeedSuccess) success = false;
    
    // 4. Seed no-contact messages
    console.log('\n💬 Seeding no-contact messages...');
    const messagesSeedSuccess = await runSeeder('./lib/db/seed-no-contact', 'seedNoContactMessages');
    if (!messagesSeedSuccess) success = false;
    
    // 5. Verify setup
    console.log('\n🔍 Verifying database setup...');
    
    const ritualCount = await db.execute(sql`SELECT COUNT(*) as count FROM rituals`);
    const messageCount = await db.execute(sql`SELECT COUNT(*) as count FROM no_contact_messages`);
    
    console.log(`📈 Database status:`);
    console.log(`  • Rituals: ${ritualCount[0]?.count || 0} entries`);
    console.log(`  • No-contact messages: ${messageCount[0]?.count || 0} entries`);
    
    if (success) {
      console.log('\n🎉 Database setup completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('  1. Test ritual API: GET /api/rituals/today');
      console.log('  2. Test no-contact API: GET /api/no-contact/today');
      console.log('  3. Implement frontend components');
      console.log('  4. Deploy updated schemas to production');
    } else {
      console.log('\n⚠️ Database setup completed with errors. Check logs above.');
    }
    
    return success;
    
  } catch (error) {
    console.error('\n💥 Database setup failed:', error);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  setupDatabase()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

export { setupDatabase };
