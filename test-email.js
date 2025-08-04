// Test email functionality with Resend
import { emailService } from './lib/email/index.js';

async function testEmail() {
  console.log('🧪 Testing email service with Resend...\n');
  
  try {
    // Test basic email functionality
    console.log('📧 Sending test email...');
    const result = await emailService.sendEmail({
      to: 'test@example.com', // Change this to your email to actually receive the test
      subject: 'CTRL+ALT+BLOCK Email Test',
      html: `
        <h1>Email Service Test</h1>
        <p>This is a test email from CTRL+ALT+BLOCK.</p>
        <p>If you're receiving this, the email service is working correctly!</p>
        <p>Time: ${new Date().toISOString()}</p>
      `
    });
    
    if (result.success) {
      console.log('✅ Basic email test PASSED');
      console.log('📬 Message ID:', result.messageId);
    } else {
      console.log('❌ Basic email test FAILED');
      console.log('📝 Error:', result.error);
    }
    
    // Test password reset email template
    console.log('\n📧 Testing password reset email template...');
    const resetResult = await emailService.sendPasswordResetEmail(
      'test@example.com', // Change this to your email to actually receive the test
      'test-token-123'
    );
    
    if (resetResult.success) {
      console.log('✅ Password reset email test PASSED');
      console.log('📬 Message ID:', resetResult.messageId);
      console.log('🎨 Email template rendered successfully');
    } else {
      console.log('❌ Password reset email test FAILED');
      console.log('📝 Error:', resetResult.error);
    }
    
  } catch (error) {
    console.error('🚨 Email test failed with error:', error);
  }
}

testEmail();
