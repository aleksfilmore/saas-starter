async function testProductionBadges() {
  console.log('🚀 Testing badge system in production mode...');
  
  try {
    const userId = 'GijPWH5DAaIf97aGNZGLF';
    
    // Test badge collection API in production
    console.log('1. Testing badge collection API...');
    const response = await fetch('http://localhost:3000/api/badges/locker', {
      headers: {
        'x-user-id': userId
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Production badge collection successful!');
      console.log(`User has ${data.badges?.length || 0} badges`);
      console.log(`Completion: ${data.completionPercent}%`);
      
      if (data.badges && data.badges.length > 0) {
        console.log('Badges:');
        data.badges.forEach((badge: any) => {
          console.log(`  - ${badge.badgeId}: ${badge.badge.name} (${badge.badge.discountPercent}% discount)`);
        });
      }
    } else {
      console.log('❌ Badge collection failed:', response.status);
    }
    
    // Test badge earning in production
    console.log('\n2. Testing badge earning API...');
    const earnResponse = await fetch('http://localhost:3000/api/badges/check-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        eventType: 'ritual_completed',
        payload: {
          ritualId: 'production_test',
          journalWordCount: 100,
          timeSpent: 600,
          category: 'test'
        }
      })
    });
    
    if (earnResponse.ok) {
      const earnData = await earnResponse.json();
      console.log('✅ Production badge earning API working!');
      console.log('Result:', earnData);
    } else {
      console.log('❌ Badge earning failed:', earnResponse.status);
    }
    
  } catch (error) {
    console.error('💥 Production test failed:', error);
  }
}

testProductionBadges().then(() => {
  console.log('\n🎉 Production badge test complete!');
});
