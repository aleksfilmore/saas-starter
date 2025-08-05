// Test production dashboard API
const baseUrl = 'https://ctrlaltblock.com';

async function testProductionDashboard() {
  console.log('🔧 Testing PRODUCTION dashboard API...');
  
  try {
    // First login to get token
    console.log('🔑 Logging in first...');
    const loginResponse = await fetch(`${baseUrl}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@ctrlaltblock.com',
        password: 'TestPassword123!'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (!loginData.success) {
      console.error('❌ Login failed:', loginData);
      return;
    }
    
    console.log('✅ Login successful, testing dashboard...');
    
    // Test dashboard API
    const dashboardResponse = await fetch(`${baseUrl}/api/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user-email': 'admin@ctrlaltblock.com',
        'Authorization': `Bearer ${loginData.token}`
      }
    });
    
    const dashboardData = await dashboardResponse.json();
    console.log('📊 PRODUCTION Dashboard Response Status:', dashboardResponse.status);
    console.log('📊 PRODUCTION Dashboard Response:', JSON.stringify(dashboardData, null, 2));
    
    if (dashboardResponse.ok && dashboardData.success) {
      console.log('✅ PRODUCTION Dashboard test PASSED');
      console.log('🎉 Dashboard API is working with complete schema!');
    } else {
      console.log('❌ PRODUCTION Dashboard test FAILED');
      console.log('Error:', dashboardData.error || 'Unknown error');
    }
    
  } catch (error) {
    console.error('❌ PRODUCTION Dashboard test ERROR:', error.message);
  }
}

testProductionDashboard().catch(console.error);
