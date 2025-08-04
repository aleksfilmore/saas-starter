import { config } from 'dotenv';

// Load environment variables first
config({ path: '.env.local' });

console.log('Environment check:');
console.log('POSTGRES_URL exists:', !!process.env.POSTGRES_URL);
console.log('POSTGRES_URL preview:', process.env.POSTGRES_URL?.substring(0, 30) + '...');

import { db } from './lib/db/drizzle';
import { sql } from 'drizzle-orm';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log('✅ Database connection successful:', result);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

testConnection().then(() => process.exit(0)).catch(() => process.exit(1));
