// Quick database schema check and migration
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/lib/db/schema';

const postgresUrl = process.env.POSTGRES_URL!;

console.log('🔍 Checking database schema...');

const client = postgres(postgresUrl, {
  ssl: 'require',
  max: 1,
  prepare: false,
});

const db = drizzle(client, { schema });

async function checkAndFixSchema() {
  try {
    console.log('✅ Database connected');
    
    // Check if users table exists and what columns it has
    console.log('📋 Checking users table structure...');
    
    const tableInfo = await client`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `;
    
    console.log('Current users table columns:');
    tableInfo.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Check if username column exists
    const hasUsername = tableInfo.some(col => col.column_name === 'username');
    
    if (!hasUsername) {
      console.log('❌ username column missing! Adding it...');
      
      // Add username column
      await client`
        ALTER TABLE users 
        ADD COLUMN username text UNIQUE;
      `;
      
      console.log('✅ Added username column');
    } else {
      console.log('✅ username column exists');
    }
    
    // Check if the table has the expected structure
    const expectedColumns = [
      'id', 'email', 'password_hash', 'username', 'avatar', 
      'onboarding_completed', 'subscription_tier', 'xp_points', 
      'byte_balance', 'glow_up_level', 'is_admin', 'is_banned',
      'last_active_at', 'created_at', 'updated_at'
    ];
    
    const existingColumns = tableInfo.map(col => col.column_name);
    const missingColumns = expectedColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log('❌ Missing columns:', missingColumns);
      
      // Add missing columns one by one
      for (const column of missingColumns) {
        try {
          switch (column) {
            case 'avatar':
              await client`ALTER TABLE users ADD COLUMN avatar text;`;
              break;
            case 'onboarding_completed':
              await client`ALTER TABLE users ADD COLUMN onboarding_completed boolean NOT NULL DEFAULT false;`;
              break;
            case 'subscription_tier':
              await client`ALTER TABLE users ADD COLUMN subscription_tier text NOT NULL DEFAULT 'ghost_mode';`;
              break;
            case 'xp_points':
              await client`ALTER TABLE users ADD COLUMN xp_points integer NOT NULL DEFAULT 0;`;
              break;
            case 'byte_balance':
              await client`ALTER TABLE users ADD COLUMN byte_balance integer NOT NULL DEFAULT 100;`;
              break;
            case 'glow_up_level':
              await client`ALTER TABLE users ADD COLUMN glow_up_level integer NOT NULL DEFAULT 1;`;
              break;
            case 'is_admin':
              await client`ALTER TABLE users ADD COLUMN is_admin boolean NOT NULL DEFAULT false;`;
              break;
            case 'is_banned':
              await client`ALTER TABLE users ADD COLUMN is_banned boolean NOT NULL DEFAULT false;`;
              break;
            case 'last_active_at':
              await client`ALTER TABLE users ADD COLUMN last_active_at timestamp with time zone;`;
              break;
            case 'updated_at':
              await client`ALTER TABLE users ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT NOW();`;
              break;
          }
          console.log(`  ✅ Added ${column}`);
        } catch (error) {
          console.log(`  ❌ Failed to add ${column}:`, error instanceof Error ? error.message : 'Unknown error');
        }
      }
    } else {
      console.log('✅ All expected columns exist');
    }
    
    // Test a simple query
    console.log('🧪 Testing user query...');
    const userCount = await db.select().from(schema.users).limit(1);
    console.log(`✅ Found ${userCount.length} users in database`);
    
    console.log('🎉 Schema check complete!');
    
  } catch (error) {
    console.error('❌ Schema check failed:', error);
  } finally {
    await client.end();
  }
}

checkAndFixSchema();
