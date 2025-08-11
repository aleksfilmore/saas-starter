import { db } from './lib/db/drizzle';
import { sql } from 'drizzle-orm';

(async () => {
  try {
    console.log('🔧 Creating sessions table for Lucia auth...');
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    
    console.log('✅ Sessions table created successfully');
    
    // Verify it was created
    const result = await db.execute(sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions'`);
    console.log('📋 Sessions table exists:', result.length > 0);
    
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error');
  }
  process.exit(0);
})();
