// Test badge API endpoints

async function testBadgeAPIs() {
  console.log('🧪 Testing badge API endpoints...\n');
  
  const baseUrl = 'http://localhost:3001';
  
  try {
    // Test 1: Check-in endpoint
    console.log('1. Testing check-in API...');
    const checkinResponse = await fetch(`${baseUrl}/api/badges/check-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'test-user-123',
        eventType: 'daily_ritual_completed',
        metadata: { ritual_type: 'morning_meditation' }
      })
    });
    
    const checkinResult = await checkinResponse.json();
    console.log('  Status:', checkinResponse.status);
    console.log('  Response:', JSON.stringify(checkinResult, null, 2));
    console.log('');
    
    // Test 2: Locker endpoint
    console.log('2. Testing locker API...');
    const lockerResponse = await fetch(`${baseUrl}/api/badges/locker?userId=test-user-123`, {
      method: 'GET',
    });
    
    const lockerResult = await lockerResponse.json();
    console.log('  Status:', lockerResponse.status);
    console.log('  Response:', JSON.stringify(lockerResult, null, 2));
    console.log('');
    
    // Test 3: List all badges
    console.log('3. Testing available badges...');
    const badgesResponse = await fetch(`${baseUrl}/api/badges/locker?listAll=true`, {
      method: 'GET',
    });
    
    const badgesResult = await badgesResponse.json();
    console.log('  Status:', badgesResponse.status);
    console.log('  Available badges:', badgesResult.availableBadges?.length || 0);
    console.log('  First few badges:');
    if (badgesResult.availableBadges) {
      badgesResult.availableBadges.slice(0, 3).forEach((badge: any) => {
        console.log(`    - ${badge.id}: ${badge.name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testBadgeAPIs();
