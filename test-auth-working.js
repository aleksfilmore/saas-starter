// Test authentication APIs directly
const baseUrl = 'http://localhost:3001';

async function testLogin() {
  console.log('🔧 Testing login API...');
  
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
    console.log('📊 Login Response Status:', response.status);
    console.log('📊 Login Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Login test PASSED');
      return data.token;
    } else {
      console.log('❌ Login test FAILED');
      return null;
    }
  } catch (error) {
    console.error('❌ Login test ERROR:', error.message);
    return null;
  }
}

async function testSignup() {
  console.log('\n🔧 Testing signup API...');
  
  const randomEmail = `test-${Date.now()}@ctrlaltblock.com`;
  
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
    console.log('📊 Signup Response Status:', response.status);
    console.log('📊 Signup Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Signup test PASSED');
      return data.data.userId;
    } else {
      console.log('❌ Signup test FAILED');
      return null;
    }
  } catch (error) {
    console.error('❌ Signup test ERROR:', error.message);
    return null;
  }
}

async function testForgotPassword() {
  console.log('\n🔧 Testing forgot password API...');
  
  try {
    const response = await fetch(`${baseUrl}/api/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@ctrlaltblock.com'
      })
    });
    
    const data = await response.json();
    console.log('📊 Forgot Password Response Status:', response.status);
    console.log('📊 Forgot Password Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Forgot password test PASSED');
    } else {
      console.log('❌ Forgot password test FAILED');
    }
  } catch (error) {
    console.error('❌ Forgot password test ERROR:', error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Starting authentication API tests...\n');
  
  // Test login with existing user
  const loginToken = await testLogin();
  
  // Test signup with new user
  const signupUserId = await testSignup();
  
  // Test forgot password
  await testForgotPassword();
  
  console.log('\n📋 Test Summary:');
  console.log('- Login:', loginToken ? '✅ SUCCESS' : '❌ FAILED');
  console.log('- Signup:', signupUserId ? '✅ SUCCESS' : '❌ FAILED');
  console.log('- Forgot Password: Check logs above');
  
  if (loginToken && signupUserId) {
    console.log('\n🎉 All core authentication tests passed!');
    console.log('🚀 Your auth system is working!');
  } else {
    console.log('\n⚠️  Some tests failed. Check the logs above.');
  }
}

// Check if server is running first
async function checkServer() {
  try {
    const response = await fetch(`${baseUrl}/api/health`, { method: 'GET' });
    return response.status === 200 || response.status === 404; // 404 is fine, means server is up
  } catch (error) {
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server not running on http://localhost:3001');
    console.log('🔧 Please start the development server with: npm run dev');
    process.exit(1);
  }
  
  await runAllTests();
}

main().catch(console.error);
