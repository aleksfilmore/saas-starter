/**
 * Script to create the system admin user
 */
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/minimal-schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { generateId } from 'lucia';

const ADMIN_EMAIL = 'system_admin@ctrlaltblock.com';
const ADMIN_PASSWORD = 'SecureAdmin2024!';

async function createSystemAdmin() {
  try {
    console.log('🔧 Creating system admin user...');

    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, ADMIN_EMAIL))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log('✅ System admin already exists:', ADMIN_EMAIL);
      return existingAdmin[0];
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // Create admin user
    const adminId = generateId(15);
    await db.insert(users).values({
      id: adminId,
      email: ADMIN_EMAIL,
      hashedPassword,
      username: 'system_admin',
      tier: 'premium', // Give admin premium access
      subscriptionTier: 'premium', // Use correct field name
      level: 99,
      xp: 999999,
      bytes: 999999,
      isAdmin: true // Mark as admin in the schema
    });

    console.log('✅ System admin created successfully');
    console.log('📧 Email:', ADMIN_EMAIL);
    console.log('🔑 Password:', ADMIN_PASSWORD);
    console.log('🆔 User ID:', adminId);

    return { id: adminId, email: ADMIN_EMAIL };

  } catch (error) {
    console.error('❌ Failed to create system admin:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  createSystemAdmin().then(() => {
    console.log('🎉 Admin creation complete');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Admin creation failed:', error);
    process.exit(1);
  });
}

export { createSystemAdmin };
