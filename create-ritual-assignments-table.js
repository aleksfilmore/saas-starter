const { db } = require('./lib/db/drizzle.ts');
const { sql } = require('drizzle-orm');

async function createRitualAssignmentTable() {
  try {
    console.log('🔧 Creating user_ritual_assignments table...');
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_ritual_assignments (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        ritual_key VARCHAR(255) NOT NULL,
        assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        completed_at TIMESTAMP WITH TIME ZONE,
        rerolled BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    console.log('✅ user_ritual_assignments table created successfully');
    
    // Create index for faster queries
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_user_ritual_assignments_user_date 
      ON user_ritual_assignments(user_id, assigned_at, rerolled)
    `);
    
    console.log('✅ Index created successfully');
    
  } catch (error) {
    console.error('❌ Error creating table:', error);
  }
  process.exit(0);
}

createRitualAssignmentTable();
