// Direct database connection test - bypasses all application layers
import postgres from 'postgres';

async function testDirectConnection() {
  // SECURITY: Only use environment variables - NEVER hardcode credentials!
  const postgresUrl = process.env.POSTGRES_URL;
  
  if (!postgresUrl) {
    console.error('❌ POSTGRES_URL environment variable not set!');
    return;
  }
  
  console.log('🔍 Testing direct database connection...');
  console.log('Database URL starts with:', postgresUrl.substring(0, 30) + '...');
  
  const sql = postgres(postgresUrl, {
    ssl: 'require',
    max: 1,
    idle_timeout: 20,
    connect_timeout: 15,
    debug: false,
    prepare: false,
  });
  
  try {
    console.log('Attempting connection...');
    
    // Test basic connection
    const result = await sql`SELECT 1 as test, NOW() as timestamp`;
    console.log('✅ Connection successful!');
    console.log('Result:', result[0]);
    
    // Test if users table exists
    const tableCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'users'
    `;
    
    if (tableCheck.length > 0) {
      console.log('✅ Users table exists');
      
      // Try to count users
      const userCount = await sql`SELECT COUNT(*) as count FROM users`;
      console.log('✅ Users table accessible, count:', userCount[0].count);
    } else {
      console.log('⚠️ Users table does not exist');
    }
    
    await sql.end();
    console.log('✅ Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error details:', error);
  }
}

testDirectConnection();
