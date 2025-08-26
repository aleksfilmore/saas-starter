import { readFileSync } from 'fs';
import { join } from 'path';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

async function addUsernameUniqueConstraint() {
  try {
    console.log('🔧 Starting username unique constraint migration...');
    
    // Read the migration SQL file
    const migrationPath = join(process.cwd(), 'migrations', 'add-username-unique-constraint.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`🔧 Executing statement ${i + 1}/${statements.length}...`);
      console.log(`📝 SQL: ${statement.substring(0, 100)}${statement.length > 100 ? '...' : ''}`);
      
      try {
        await db.execute(sql.raw(statement));
        console.log('✅ Statement executed successfully');
      } catch (error) {
        console.error(`❌ Error executing statement ${i + 1}:`, error);
        
        // If constraint already exists, continue
        if (error instanceof Error && error.message?.includes('already exists')) {
          console.log('ℹ️  Constraint already exists, continuing...');
          continue;
        }
        
        throw error;
      }
    }
    
    console.log('✅ Username unique constraint migration completed successfully!');
    
    // Test the constraint
    console.log('🧪 Testing constraint...');
    const testResult = await db.execute(sql`
      SELECT constraint_name, constraint_type 
      FROM information_schema.table_constraints 
      WHERE table_name = 'users' AND constraint_name = 'users_username_unique'
    `);
    
    if (testResult.length > 0) {
      console.log('✅ Unique constraint verified in database');
    } else {
      console.log('⚠️  Could not verify constraint (may still be working)');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run the migration
if (import.meta.url === `file://${process.argv[1]}`) {
  addUsernameUniqueConstraint()
    .then(() => {
      console.log('🎉 Migration completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

export { addUsernameUniqueConstraint };
