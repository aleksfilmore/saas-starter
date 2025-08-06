// Test the authentication flow
async function testAuth() {
  try {
    console.log('🧪 Testing authentication flow...');
    
    // Test login
    const loginResponse = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@ctrlaltblock.com',
        password: 'admin123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('🔐 Login response:', loginData);

    if (loginData.success) {
      console.log('✅ Login successful!');
      
      // Test auth/me endpoint
      const meResponse = await fetch('http://localhost:3001/api/auth/me', {
        method: 'GET',
        credentials: 'include' // Include cookies
      });

      const meData = await meResponse.json();
      console.log('👤 Me response:', meData);
      
    } else {
      console.log('❌ Login failed:', loginData.error);
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testAuth();
