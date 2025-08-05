// Test authentication APIs on PRODUCTION
const baseUrl = 'https://ctrlaltblock.com';

async function testProductionLogin() {
  console.log('🔧 Testing PRODUCTION login API...');
  
  try {
    const response = await fetch(`${baseUrl}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@ctrlaltblock.com',
        password: 'TestPassword123!'
      })
    });
    
    const data = await response.json();
    console.log('📊 PRODUCTION Login Response Status:', response.status);
    console.log('📊 PRODUCTION Login Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ PRODUCTION Login test PASSED');
      return data.token;
    } else {
      console.log('❌ PRODUCTION Login test FAILED');
      return null;
    }
  } catch (error) {
    console.error('❌ PRODUCTION Login test ERROR:', error.message);
    return null;
  }
}

async function testProductionSignup() {
  console.log('\n🔧 Testing PRODUCTION signup API...');
  
  const randomEmail = `test-prod-${Date.now()}@ctrlaltblock.com`;
  
  try {
    const response = await fetch(`${baseUrl}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: randomEmail,
        password: 'TestPassword123!',
        quizResult: { archetype: 'secure' }
      })
    });
    
    const data = await response.json();
    console.log('📊 PRODUCTION Signup Response Status:', response.status);
    console.log('📊 PRODUCTION Signup Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ PRODUCTION Signup test PASSED');
      return data.data.userId;
    } else {
      console.log('❌ PRODUCTION Signup test FAILED');
      return null;
    }
  } catch (error) {
    console.error('❌ PRODUCTION Signup test ERROR:', error.message);
    return null;
  }
}

async function runProductionTests() {
  console.log('🌐 Starting PRODUCTION authentication API tests...\n');
  
  // Test login with existing user
  const loginToken = await testProductionLogin();
  
  // Test signup with new user  
  const signupUserId = await testProductionSignup();
  
  console.log('\n📋 PRODUCTION Test Summary:');
  console.log('- Login:', loginToken ? '✅ SUCCESS' : '❌ FAILED');
  console.log('- Signup:', signupUserId ? '✅ SUCCESS' : '❌ FAILED');
  
  if (loginToken && signupUserId) {
    console.log('\n🎉 All PRODUCTION authentication tests passed!');
    console.log('🚀 Your PRODUCTION auth system is working!');
  } else {
    console.log('\n⚠️  Some PRODUCTION tests failed. APIs may not be deployed correctly.');
  }
}

runProductionTests().catch(console.error);
