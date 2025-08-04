import { testProductionEmail } from '../lib/test-email';
import { setupProductionDatabase } from '../lib/setup-production-db';

async function runProductionTests() {
  console.log('🎯 Starting production environment tests...\n');
  
  try {
    // Test 1: Database connectivity
    console.log('1️⃣ Testing database...');
    await setupProductionDatabase();
    console.log('✅ Database test passed\n');
    
    // Test 2: Email service configuration
    console.log('2️⃣ Testing email service...');
    await testProductionEmail();
    console.log('✅ Email service configured\n');
    
    // Test 3: Environment variables
    console.log('3️⃣ Testing environment variables...');
    const requiredEnvs = [
      'POSTGRES_URL',
      'AUTH_SECRET', 
      'EMAIL_API_KEY',
      'EMAIL_FROM',
      'NEXTAUTH_URL'
    ];
    
    const missing = requiredEnvs.filter(env => !process.env[env]);
    if (missing.length > 0) {
      throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    }
    console.log('✅ All environment variables present\n');
    
    console.log('🎉 All production tests passed!');
    console.log('🚀 Your platform is ready for live deployment!');
    
  } catch (error) {
    console.error('❌ Production test failed:', error);
    process.exit(1);
  }
}

runProductionTests();
