import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';
import bcrypt from 'bcryptjs';
import { users } from '../lib/db/minimal-schema';

// Load environment variables
config({ path: '.env.local' });
config({ path: '.env' });

async function createTestUser() {
  try {
    console.log('🚀 Creating test user...');
    
    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error('POSTGRES_URL environment variable is required');
    }

    const client = postgres(connectionString);
    const db = drizzle(client, { schema: { users } });

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const userId = 'user_' + Date.now();

    await db.insert(users).values({
      id: userId,
      email: 'admin@ctrlaltblock.com',
      hashedPassword,
      tier: 'paid_advanced',
      archetype: 'FIREWALL_BUILDER',
      xp: 1000,
      bytes: 500,
      level: 5,
      is_verified: true,
      subscription_status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    });

    console.log('✅ Test user created successfully!');
    console.log('📧 Email: admin@ctrlaltblock.com');
    console.log('🔒 Password: admin123');
    console.log('👑 Verified: true');
    console.log('🎯 Tier: paid_advanced');
    console.log('🛡️ Archetype: FIREWALL_BUILDER');

    await client.end();
    
  } catch (error) {
    console.error('❌ Failed to create test user:', error);
    process.exit(1);
  }
}

createTestUser();
