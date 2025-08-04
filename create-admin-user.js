// Script to create admin user in production database
import { db } from './lib/db/drizzle.js';
import { users } from './lib/db/minimal-schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function createAdminUser() {
  const adminEmail = 'admin@ctrlaltblock.com';
  const adminPassword = 'Admin123!@#';
  
  try {
    console.log('🔍 Checking if admin user already exists...');
    
    // Check if admin user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1);

    if (existingUser.length > 0) {
      console.log('✅ Admin user already exists!');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password:', adminPassword);
      return;
    }

    console.log('🔨 Creating admin user...');
    
    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
    
    // Generate user ID
    const userId = `admin-${Date.now()}`;
    
    // Insert admin user
    const result = await db
      .insert(users)
      .values({
        id: userId,
        email: adminEmail,
        hashedPassword: hashedPassword,
      })
      .returning();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('🆔 User ID:', result[0].id);
    console.log('');
    console.log('🚀 You can now login at: https://ctrlaltblock.com/sign-in');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    
    if (error.message.includes('duplicate key')) {
      console.log('ℹ️  Admin user might already exist. Try logging in with:');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password:', adminPassword);
    }
  } finally {
    // Close database connection
    process.exit(0);
  }
}

// Run the script
createAdminUser();
