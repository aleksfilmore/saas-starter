import { db } from './drizzle';
import { sql } from 'drizzle-orm';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function runRitualMigration() {
  try {
    console.log('🔄 Running ritual system migration...');
    
    // Read and execute the schema SQL
    const schemaSQL = readFileSync(join(process.cwd(), 'lib/db/ritual-schema.sql'), 'utf-8');
    
    // Split by semicolon and execute each statement
    const statements = schemaSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    for (const statement of statements) {
      try {
        await db.execute(sql.raw(statement));
        console.log('✅ Executed statement');
      } catch (error) {
        console.log(`⚠️ Statement might already exist: ${error instanceof Error ? error.message.substring(0, 100) : 'Unknown error'}...`);
      }
    }
    
    console.log('🎉 Ritual system migration completed!');
    return true;
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  runRitualMigration()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
