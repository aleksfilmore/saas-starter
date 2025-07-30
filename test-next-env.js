// Test with Next.js environment loading
import { loadEnvConfig } from '@next/env';
import { join } from 'path';

// Load Next.js environment variables
const projectDir = process.cwd();
loadEnvConfig(projectDir);

console.log('Environment check:');
console.log('- POSTGRES_URL exists:', !!process.env.POSTGRES_URL);
console.log('- AUTH_SECRET exists:', !!process.env.AUTH_SECRET);
console.log('- NODE_ENV:', process.env.NODE_ENV);

async function testWithNextEnv() {
  try {
    // Now try postgres connection
    const postgres = (await import('postgres')).default;
    
    const sql = postgres(process.env.POSTGRES_URL, {
      ssl: 'require',
      max: 1,
      connect_timeout: 10,
      prepare: false,
    });
    
    console.log('Testing connection...');
    const result = await sql`SELECT 1 as test, 'connection working' as message`;
    console.log('✅ Success:', result[0]);
    
    await sql.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testWithNextEnv();
