import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';
import bcrypt from 'bcryptjs';
import { users } from '../lib/db/minimal-schema';
import { eq } from 'drizzle-orm';

// Load environment variables
config({ path: '.env.local' });
config({ path: '.env' });

async function resetUserPassword() {
  try {
    console.log('🚀 Checking existing users and resetting password...');
    
    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error('POSTGRES_URL environment variable is required');
    }

    const client = postgres(connectionString);
    const db = drizzle(client, { schema: { users } });

    // First, let's see what users exist
    const existingUsers = await db.select({
      email: users.email,
      tier: users.tier,
      archetype: users.archetype
    }).from(users);

    console.log('📋 Existing users:');
    existingUsers.forEach(user => {
      console.log(`  ${user.email} - tier: ${user.tier} - archetype: ${user.archetype}`);
    });

    // Reset admin password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await db.update(users)
      .set({ 
        hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.email, 'admin@ctrlaltblock.com'));

    console.log('✅ Password reset successfully!');
    console.log('📧 Email: admin@ctrlaltblock.com');
    console.log('🔒 New Password: admin123');

    await client.end();
    
  } catch (error) {
    console.error('❌ Failed to reset password:', error);
    process.exit(1);
  }
}

resetUserPassword();
