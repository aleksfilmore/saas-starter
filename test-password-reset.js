// Test script to verify password reset functionality
// Run with: node test-password-reset.js

const crypto = require('crypto');

async function testPasswordReset() {
  const baseUrl = 'http://localhost:3001'; // Change to your domain for production
  const testEmail = 'test@example.com'; // Use a real email for testing
  
  console.log('🔧 Testing Password Reset Flow...\n');
  
  try {
    // Step 1: Request password reset
    console.log('1. Requesting password reset for:', testEmail);
    const resetResponse = await fetch(`${baseUrl}/api/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail
      }),
    });
    
    const resetData = await resetResponse.json();
    console.log('   Response:', resetData);
    
    if (!resetData.success) {
      console.log('❌ Password reset request failed');
      return;
    }
    
    console.log('✅ Password reset email should be sent (check your email)');
    console.log('\n2. To test the reset process:');
    console.log('   - Check your email for the reset link');
    console.log('   - Click the link or copy the token from the URL');
    console.log('   - Use the token to reset your password');
    
    console.log('\n📝 Manual test steps:');
    console.log('   1. Go to /forgot-password');
    console.log('   2. Enter your email');
    console.log('   3. Check email for reset link');
    console.log('   4. Click link and set new password');
    console.log('   5. Try signing in with new password');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testPasswordReset();
