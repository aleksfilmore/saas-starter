// Script to update admin email in production database
import { db } from './lib/db/drizzle.js';
import { users } from './lib/db/minimal-schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function updateAdminEmail() {
  // Professional Zoho email addresses
  const newAdminEmail = 'system_admin@ctrlaltblock.com';
  const adminPassword = 'Admin123!@#';
  const oldAdminEmail = 'admin@ctrlaltblock.com';
  
  try {
    console.log('🔍 Looking for admin user with old email...');
    
    // Check if old admin user exists
    const oldUser = await db
      .select()
      .from(users)
      .where(eq(users.email, oldAdminEmail))
      .limit(1);

    if (oldUser.length > 0) {
      console.log('📧 Updating admin email from', oldAdminEmail, 'to', newAdminEmail);
      
      // Update the email
      await db
        .update(users)
        .set({ email: newAdminEmail })
        .where(eq(users.id, oldUser[0].id));
        
      console.log('✅ Admin email updated successfully!');
    } else {
      console.log('🔨 Creating new admin user with your email...');
      
      // Hash the password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
      
      // Generate user ID
      const userId = `admin-${Date.now()}`;
      
      // Insert admin user
      await db
        .insert(users)
        .values({
          id: userId,
          email: newAdminEmail,
          hashedPassword: hashedPassword,
        });

      console.log('✅ New admin user created!');
    }

    console.log('');
    console.log('🚀 Admin credentials:');
    console.log('📧 Email:', newAdminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('');
    console.log('🌐 Login at: https://ctrlaltblock.com/sign-in');
    
  } catch (error) {
    console.error('❌ Error updating admin email:', error);
  } finally {
    process.exit(0);
  }
}

// Run the script
updateAdminEmail();
