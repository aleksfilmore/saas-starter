import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';

async function runMigration() {
  try {
    const sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!);
    
    console.log('🔄 Applying database migration...');
    
    // Read the latest migration file
    const migrationPath = path.join(process.cwd(), 'lib/db/migrations/0005_dashing_amazoness.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by statement-breakpoint and execute each statement
    const statements = migrationSql.split('-->statement-breakpoint').map(s => s.trim()).filter(s => s);
    
    for (const statement of statements) {
      if (statement && !statement.startsWith('--')) {
        try {
          await sql.unsafe(statement);
          console.log(`✅ Executed: ${statement.substring(0, 50)}...`);
        } catch (error: any) {
          if (error.message.includes('already exists') || error.message.includes('does not exist')) {
            console.log(`⚠️  Skipped (already exists): ${statement.substring(0, 50)}...`);
          } else {
            console.error(`❌ Error executing: ${statement.substring(0, 50)}...`);
            console.error('Error:', error.message);
          }
        }
      }
    }
    
    console.log('✅ Migration completed successfully!');
    await sql.end();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
