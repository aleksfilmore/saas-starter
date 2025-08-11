const { db } = require('./lib/db/drizzle');
const { sql } = require('drizzle-orm');
const fs = require('fs');
const path = require('path');

async function runRitualMigration() {
  try {
    console.log('🔄 Running ritual system migration...');
    
    // Read and execute the schema SQL
    const schemaSQL = fs.readFileSync(path.join(process.cwd(), 'lib/db/ritual-schema.sql'), 'utf-8');
    
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
        console.log(`⚠️ Statement might already exist: ${error.message.substring(0, 100)}...`);
      }
    }
    
    console.log('🎉 Ritual system migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runRitualMigration();
