/**
 * Quick script to check the admin user status
 */
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';

const ADMIN_EMAIL = 'system_admin@ctrlaltblock.com';

async function checkAdminUser() {
  try {
    console.log('🔍 Checking admin user in database...');

    const adminUser = await db
      .select()
      .from(users)
      .where(eq(users.email, ADMIN_EMAIL))
      .limit(1);

    if (adminUser.length === 0) {
      console.log('❌ Admin user not found!');
      return;
    }

    const admin = adminUser[0];
    console.log('✅ Admin user found:');
    console.log('  ID:', admin.id);
    console.log('  Email:', admin.email);
    console.log('  Username:', admin.username);
    console.log('  isAdmin:', admin.isAdmin);
    console.log('  Tier:', admin.tier);
    console.log('  Level:', admin.level);
    console.log('  Created:', admin.created_at);

    if (!admin.isAdmin) {
      console.log('⚠️  WARNING: Admin user exists but isAdmin flag is false!');
    }

  } catch (error) {
    console.error('❌ Failed to check admin user:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  checkAdminUser().then(() => {
    console.log('🎉 Admin check complete');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Admin check failed:', error);
    process.exit(1);
  });
}

export { checkAdminUser };
