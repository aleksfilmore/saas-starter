// Test authentication APIs directly
async function testAuthenticationAPIs() {
  console.log('🔬 Testing Authentication APIs...\n');
  
  try {
    // Test 1: Create a user via signup API
    console.log('1️⃣ Testing Signup API...');
    const signupData = new FormData();
    signupData.append('email', `test-${Date.now()}@example.com`);
    signupData.append('password', 'Test123456');
    signupData.append('acceptTerms', 'on');
    signupData.append('acceptPrivacy', 'on');

    const signupResponse = await fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      body: signupData
    });
    
    console.log('Signup Status:', signupResponse.status);
    const signupResult = await signupResponse.json();
    console.log('Signup Result:', signupResult);
    
    if (signupResult.success) {
      console.log('✅ Signup API: WORKING\n');
      
      // Test 2: Login with the created user
      console.log('2️⃣ Testing Login API...');
      const loginData = new FormData();
      loginData.append('email', signupData.get('email'));
      loginData.append('password', 'Test123456');

      const loginResponse = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        body: loginData
      });
      
      console.log('Login Status:', loginResponse.status);
      const loginResult = await loginResponse.json();
      console.log('Login Result:', loginResult);
      
      if (loginResult.success) {
        console.log('✅ Login API: WORKING\n');
        console.log('🎉 AUTHENTICATION SYSTEM: FULLY FUNCTIONAL!');
      } else {
        console.log('❌ Login API: FAILED');
      }
    } else {
      console.log('❌ Signup API: FAILED');
    }
    
  } catch (error) {
    console.error('🚨 Test Error:', error);
  }
}

testAuthenticationAPIs();
