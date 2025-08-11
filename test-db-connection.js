const postgres = require('postgres');

async function testDatabase() {
  const connectionString = 'postgresql://neondb_owner:npg_CWvq0p7hPLOS@ep-cool-leaf-aef6j3r5-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
  
  console.log('🔍 Testing database connection...');
  
  const client = postgres(connectionString, {
    ssl: 'require',
    max: 1,
    prepare: false,
    connect_timeout: 10,
  });
  
  try {
    const result = await client`SELECT 1 as test, current_database() as db, version() as pg_version`;
    console.log('✅ Database connection successful:');
    console.log('  Database:', result[0].db);
    console.log('  Test query:', result[0].test);
    console.log('  PostgreSQL version:', result[0].pg_version.split(' ')[0]);
    
    // Test if our expected tables exist
    const tables = await client`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    console.log('\n📋 Existing tables in database:');
    tables.forEach(table => console.log('  -', table.table_name));
    
    // Check specifically for users and sessions tables
    const hasUsers = tables.some(t => t.table_name === 'users');
    const hasSessions = tables.some(t => t.table_name === 'sessions');
    
    console.log('\n🔍 Required tables check:');
    console.log('  users table:', hasUsers ? '✅ EXISTS' : '❌ MISSING');
    console.log('  sessions table:', hasSessions ? '✅ EXISTS' : '❌ MISSING');
    
    await client.end();
    return true;
    
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    await client.end();
    return false;
  }
}

testDatabase();