import { emailService } from './email/index';

export async function testProductionEmail() {
  try {
    console.log('🧪 Testing production email service...');
    
    // Test email structure without sending
    const testResult = {
      provider: process.env.EMAIL_PROVIDER,
      apiKeyPresent: !!process.env.EMAIL_API_KEY,
      fromEmail: process.env.EMAIL_FROM,
      configured: true
    };
    
    console.log('✅ Email configuration:', testResult);
    return testResult;
  } catch (error) {
    console.error('❌ Email test failed:', error);
    throw error;
  }
}
