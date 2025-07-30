// Test with alternative Neon connection methods
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

console.log('Testing different connection approaches...');

// Alternative connection strings to try:
const connections = [
  {
    name: 'Current Pooler',
    url: process.env.POSTGRES_URL
  },
  {
    name: 'Direct Connection (without pooler)',
    url: process.env.POSTGRES_URL?.replace('-pooler', '')
  },
  {
    name: 'Alternative Port',
    url: process.env.POSTGRES_URL?.replace('5432', '5433')
  }
];

async function testConnections() {
  const postgres = (await import('postgres')).default;
  
  for (const conn of connections) {
    if (!conn.url) continue;
    
    console.log(`\n🔍 Testing: ${conn.name}`);
    console.log(`URL: ${conn.url.substring(0, 50)}...`);
    
    try {
      const sql = postgres(conn.url, {
        ssl: 'require',
        max: 1,
        connect_timeout: 5, // Shorter timeout for testing
        prepare: false,
      });
      
      const result = await Promise.race([
        sql`SELECT 1 as test`,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      
      console.log(`✅ ${conn.name}: SUCCESS`);
      await sql.end();
      return conn; // Return first successful connection
      
    } catch (error) {
      console.log(`❌ ${conn.name}: ${error.message}`);
    }
  }
  
  console.log('\n❌ All connection methods failed');
  return null;
}

testConnections().then(result => {
  if (result) {
    console.log(`\n🎉 Working connection found: ${result.name}`);
  } else {
    console.log('\n💡 Try these solutions:');
    console.log('1. Check your internet connection');
    console.log('2. Verify Neon database is running');
    console.log('3. Check firewall settings');
    console.log('4. Try connecting from Neon dashboard');
  }
});
