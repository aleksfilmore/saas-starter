// Quick database diagnostic script
require('dotenv').config({ path: '.env.local' });
const postgres = require('postgres');

async function diagnose() {
  console.log('🔍 Diagnosing database connection issue...');
  
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    console.error('❌ POSTGRES_URL not found');
    return;
  }
  
  console.log('✅ POSTGRES_URL found');
  console.log('🔗 Connection string starts with:', connectionString.substring(0, 30) + '...');
  
  try {
    const client = postgres(connectionString, {
      ssl: 'require',
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      onnotice: () => {},
      debug: false,
      prepare: false,
    });
    
    console.log('⏳ Testing basic connection...');
    const result = await client`SELECT 1 as test, NOW() as timestamp`;
    console.log('✅ Database connection successful');
    console.log('📅 Server timestamp:', result[0].timestamp);
    
    console.log('⏳ Checking critical tables...');
    const tables = await client`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'sessions')
      ORDER BY table_name
    `;
    
    console.log('📋 Critical tables found:', tables.map(t => t.table_name));
    
    if (tables.find(t => t.table_name === 'users')) {
      console.log('⏳ Testing users table...');
      const userCount = await client`SELECT COUNT(*) as count FROM users`;
      console.log('👥 User count:', userCount[0].count);
    } else {
      console.log('❌ Users table missing!');
    }
    
    if (tables.find(t => t.table_name === 'sessions')) {
      console.log('⏳ Testing sessions table...');
      const sessionCount = await client`SELECT COUNT(*) as count FROM sessions`;
      console.log('🔑 Session count:', sessionCount[0].count);
    } else {
      console.log('❌ Sessions table missing! This could cause auth failures.');
    }
    
    await client.end();
    console.log('✅ Diagnostic complete');
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('🔍 Error type:', error.constructor.name);
    
    if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      console.log('🚨 Connection timeout detected - possible database overload or network issue');
    }
    if (error.message.includes('too many connections')) {
      console.log('🚨 Too many connections - connection pool exhausted');
    }
    if (error.message.includes('does not exist')) {
      console.log('🚨 Table/column missing - schema issue');
    }
  }
}

diagnose().then(() => process.exit(0)).catch(err => {
  console.error('💥 Diagnostic script failed:', err);
  process.exit(1);
});
