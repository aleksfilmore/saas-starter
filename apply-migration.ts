import { db } from './lib/db';
import { sql } from 'drizzle-orm';
import fs from 'fs';

async function applyMigration() {
  try {
    console.log('Reading migration file...');
    const migrationSQL = fs.readFileSync('./lib/db/migrations/0006_solid_bedlam.sql', 'utf8');
    
    console.log('Applying migration...');
    
    // Split the migration into individual statements
    const statements = migrationSQL
      .split('--> statement-breakpoint')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.substring(0, 100) + '...');
        await db.execute(sql.raw(statement));
      }
    }

    console.log('Migration applied successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

applyMigration();
