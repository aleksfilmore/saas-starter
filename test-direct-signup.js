// Test script for direct signup with proper username generation
const testDirectSignup = async () => {
  try {
    const testData = {
      email: 'direct-user-' + Date.now() + '@example.com',
      password: 'testpassword123',
      subscriptionTier: 'ghost_mode'
    };

    console.log('🧪 Testing DIRECT signup with username generation:', {
      email: testData.email,
      hasPassword: !!testData.password,
      subscriptionTier: testData.subscriptionTier
    });

    const response = await fetch('http://localhost:3001/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    console.log('📊 Direct signup response status:', response.status);
    console.log('📋 Direct signup response data:', result);
    
    if (response.ok) {
      console.log('✅ Direct signup test PASSED');
      console.log(`🎯 Generated username: ${result.data?.username || 'N/A'}`);
    } else {
      console.log('❌ Direct signup test FAILED');
      console.log('Error:', result.error);
    }

  } catch (error) {
    console.error('💥 Direct signup test error:', error);
  }
};

testDirectSignup();
