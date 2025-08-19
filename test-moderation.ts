const testModerationSystem = async () => {
  console.log('🧪 Testing content moderation system...');

  const testCases = [
    {
      name: 'Clean content',
      content: 'Today was a difficult day but I pushed through',
      expectedResult: 'allowed'
    },
    {
      name: 'Crisis content',
      content: 'I want to kill myself, there is no point anymore',
      expectedResult: 'blocked'
    },
    {
      name: 'Personal information',
      content: 'My name is John Smith, email me at john@example.com',
      expectedResult: 'flagged'
    },
    {
      name: 'Mild profanity',
      content: 'This damn situation is so frustrating',
      expectedResult: 'flagged'
    },
    {
      name: 'Strong profanity',
      content: 'This fucking world can go to hell',
      expectedResult: 'flagged_high'
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n📝 Testing: ${testCase.name}`);
      console.log(`Content: "${testCase.content}"`);
      
      const response = await fetch('http://localhost:3000/api/wall/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Note: This test would need proper authentication in real use
        },
        body: JSON.stringify({
          content: testCase.content,
          isAnonymous: true,
          category: 'system_error'
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Result: ALLOWED');
        console.log('Moderation:', result.moderation);
      } else {
        console.log('❌ Result: BLOCKED/FLAGGED');
        console.log('Reason:', result.error);
        console.log('Message:', result.message);
      }
      
    } catch (error) {
      console.log('⚠️ Test failed (likely auth required):', (error as Error).message);
    }
  }

  console.log('\n🎯 Moderation system test completed!');
  console.log('Note: Full testing requires authentication. This demonstrates the API structure.');
};

// Test only API availability since auth is required for full testing
const testAPIAvailability = async () => {
  console.log('\n🔍 Testing API endpoints availability...');
  
  const endpoints = [
    '/api/admin/moderation/stats',
    '/api/admin/moderation'
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`);
      console.log(`${endpoint}: ${response.status === 401 ? '✅ Available (Auth Required)' : `❓ Status ${response.status}`}`);
    } catch (error) {
      console.log(`${endpoint}: ❌ Unavailable`);
    }
  }
};

export { testModerationSystem, testAPIAvailability };

// If run directly
if (typeof window === 'undefined' && require.main === module) {
  testModerationSystem().then(() => testAPIAvailability());
}
