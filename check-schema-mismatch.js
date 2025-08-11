// Check schema mismatch between expected and actual tables
require('dotenv').config({ path: '.env.local' });
const postgres = require('postgres');

async function checkSchemaMismatch() {
  console.log('🔍 Checking for schema mismatch...');
  
  const connectionString = process.env.POSTGRES_URL;
  const client = postgres(connectionString, {
    ssl: 'require',
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    onnotice: () => {},
    debug: false,
    prepare: false,
  });
  
  try {
    // Get all actual tables in the database
    const actualTables = await client`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('📋 Actual tables in database:');
    actualTables.forEach(t => console.log(`   - ${t.table_name}`));
    
    // Tables expected by unified-schema.ts
    const expectedTables = [
      'users',
      'sessions', 
      'daily_ritual_assignments',
      'daily_ritual_completions',
      'user_daily_state',
      'user_ritual_history',
      'daily_ritual_events',
      'notifications',
      'push_subscriptions',
      'notification_schedules',
      'analytics_events',
      'ai_sessions'
    ];
    
    console.log('\n📊 Expected tables by unified-schema:');
    expectedTables.forEach(t => console.log(`   - ${t}`));
    
    const actualTableNames = actualTables.map(t => t.table_name);
    const missingTables = expectedTables.filter(t => !actualTableNames.includes(t));
    const extraTables = actualTableNames.filter(t => !expectedTables.includes(t));
    
    if (missingTables.length > 0) {
      console.log('\n❌ Missing tables (expected by schema but not in DB):');
      missingTables.forEach(t => console.log(`   - ${t}`));
    }
    
    if (extraTables.length > 0) {
      console.log('\n⚠️  Extra tables (in DB but not in schema):');
      extraTables.forEach(t => console.log(`   - ${t}`));
    }
    
    if (missingTables.length === 0 && extraTables.length === 0) {
      console.log('\n✅ Schema matches database perfectly!');
    } else {
      console.log('\n🚨 SCHEMA MISMATCH DETECTED!');
      console.log('This could cause Drizzle to fail when trying to reference missing tables.');
    }
    
    await client.end();
    
  } catch (error) {
    console.error('❌ Schema check failed:', error.message);
  }
}

checkSchemaMismatch().then(() => process.exit(0)).catch(err => {
  console.error('💥 Schema check script failed:', err);
  process.exit(1);
});
