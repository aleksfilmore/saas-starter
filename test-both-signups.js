// Test script to verify both signup endpoints work
const testQuizSignup = async () => {
  try {
    const testData = {
      email: 'quiz-test-' + Date.now() + '@example.com',
      password: 'testpassword123',
      username: 'quizuser' + Date.now(),
      quizResult: {
        attachmentStyle: 'df'
      },
      source: 'quiz-test'
    };

    console.log('🧪 Testing QUIZ signup with data:', {
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
    
    console.log('📊 Quiz signup response status:', response.status);
    console.log('📋 Quiz signup response data:', result);
    
    if (response.ok) {
      console.log('✅ Quiz signup test PASSED');
    } else {
      console.log('❌ Quiz signup test FAILED');
    }

  } catch (error) {
    console.error('💥 Quiz test error:', error);
  }
};

const testDirectSignup = async () => {
  try {
    const testData = {
      email: 'direct-test-' + Date.now() + '@example.com',
      password: 'testpassword123',
      wantsNewsletter: true,
      subscriptionTier: 'FREE',
      scanAnswers: null
    };

    console.log('🧪 Testing DIRECT signup with data:', {
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
    } else {
      console.log('❌ Direct signup test FAILED');
    }

  } catch (error) {
    console.error('💥 Direct test error:', error);
  }
};

// Run both tests
console.log('🚀 Starting signup endpoint tests...\n');

testQuizSignup().then(() => {
  console.log('\n---\n');
  return testDirectSignup();
}).then(() => {
  console.log('\n🏁 Tests complete!');
});
