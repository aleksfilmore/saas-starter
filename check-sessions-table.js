const { db } = require('./lib/db/drizzle.js');
const { sql } = require('drizzle-orm');

(async () => {
  try {
    console.log('🔍 Checking for sessions table...');
    const result = await db.execute(sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions'`);
    console.log('📋 Sessions table exists:', result.length > 0);
    
    if (result.length === 0) {
      console.log('⚠️ Sessions table missing - this explains the session creation failures');
      console.log('🔧 Need to create sessions table for Lucia auth');
    } else {
      console.log('✅ Sessions table found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  process.exit(0);
})();
