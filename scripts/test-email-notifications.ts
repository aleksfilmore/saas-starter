#!/usr/bin/env tsx

/**
 * Test Email Notifications Script
 * 
 * Simple script to test the email notification system
 */

import { EmailNotificationService } from '@/lib/email/notifications';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function testEmailNotifications() {
  console.log('🧪 Testing Email Notifications...\n');

  try {
    // Get a test user (first user with email notifications enabled)
    const testUsers = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        emailNotifications: users.emailNotifications
      })
      .from(users)
      .where(eq(users.emailNotifications, true))
      .limit(3);

    if (testUsers.length === 0) {
      console.log('❌ No users found with email notifications enabled');
      console.log('💡 Enable email notifications for a user first');
      return;
    }

    console.log(`📧 Found ${testUsers.length} user(s) with email notifications enabled:`);
    testUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.username || 'Unknown'} (${user.email})`);
    });
    console.log('');

    // Test sending to the first user
    const testUser = testUsers[0];
    console.log(`🚀 Sending test email to: ${testUser.username || 'Unknown'} (${testUser.email})`);
    
    const success = await EmailNotificationService.sendDailyReminder(testUser.id);

    if (success) {
      console.log('✅ Email sent successfully!');
      console.log('📬 Check the email inbox for the daily reminder');
    } else {
      console.log('❌ Failed to send email');
      console.log('🔍 Check the email notification service configuration');
    }

    console.log('');
    console.log('📊 Email notification test completed');

  } catch (error) {
    console.error('❌ Error testing email notifications:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('RESEND_API_KEY')) {
        console.log('💡 Make sure RESEND_API_KEY is set in your environment variables');
      }
    }
  }
}

async function testBulkNotifications() {
  console.log('\n🚀 Testing Bulk Daily Reminders...\n');

  try {
    const result = await EmailNotificationService.sendBulkDailyReminders();
    
    console.log(`📊 Bulk notification results:`);
    console.log(`  ✅ Sent: ${result.sent}`);
    console.log(`  ❌ Failed: ${result.failed}`);
    console.log(`  📧 Total attempted: ${result.sent + result.failed}`);

    if (result.sent > 0) {
      console.log('🎉 Bulk notifications sent successfully!');
    } else {
      console.log('⚠️  No notifications were sent');
    }

  } catch (error) {
    console.error('❌ Error testing bulk notifications:', error);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const testType = args[0] || 'single';

  if (testType === 'bulk') {
    await testBulkNotifications();
  } else {
    await testEmailNotifications();
  }

  process.exit(0);
}

if (require.main === module) {
  main().catch(console.error);
}
