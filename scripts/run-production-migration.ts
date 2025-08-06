import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });
config({ path: '.env' });

async function runMigration() {
  try {
    console.log('🚀 Starting production database migration...');
    
    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error('POSTGRES_URL environment variable is required');
    }

    // Create connection
    const client = postgres(connectionString);
    const db = drizzle(client);

    // Read migration file
    const migrationPath = join(process.cwd(), 'migrations', 'add-user-profile-columns.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('📋 Running migration SQL...');
    
    // Execute migration
    await client.unsafe(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    console.log('📊 Added columns: tier, archetype, xp, bytes, level, streaks, timestamps');
    
    // Verify migration
    const result = await client`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `;
    
    console.log('🔍 Current users table structure:');
    result.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : ''} ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`);
    });

    await client.end();
    console.log('🎉 Migration complete! Database is ready for production.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runMigration();
}

export { runMigration };
