// Test script to verify signup API works
const testSignup = async () => {
  try {
    const testData = {
      email: 'test-' + Date.now() + '@example.com',
      password: 'testpassword123',
      username: 'testuser' + Date.now(),
      quizResult: {
        attachmentStyle: 'df'
      },
      source: 'test'
    };

    console.log('🧪 Testing signup with data:', {
      email: testData.email,
      username: testData.username,
      hasPassword: !!testData.password,
      quizResult: testData.quizResult
    });

    const response = await fetch('http://localhost:3001/api/signup-local', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    console.log('📊 Response status:', response.status);
    console.log('📋 Response data:', result);
    
    if (response.ok) {
      console.log('✅ Signup test PASSED');
    } else {
      console.log('❌ Signup test FAILED');
    }

  } catch (error) {
    console.error('💥 Test error:', error);
  }
};

testSignup();
