// Simulate user actions to test badge earning

async function simulateBadgeEarning() {
  console.log('🎮 Simulating User Actions for Badge Earning...\n');
  
  const baseUrl = 'http://localhost:3001';
  const testUserId = 'GijPWH5DAaIf97aGNZGLF'; // From previous test
  
  try {
    // Test 1: Simulate ritual completion
    console.log('1. Simulating ritual completion...');
    
    const ritualResponse = await fetch(`${baseUrl}/api/badges/check-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: testUserId,
        eventType: 'ritual_completed',
        payload: {
          ritualId: 'morning_meditation',
          journalWordCount: 150,
          timeSpent: 300, // 5 minutes
          category: 'mindfulness'
        }
      })
    });
    
    if (ritualResponse.ok) {
      const ritualData = await ritualResponse.json();
      console.log('   ✓ Ritual completion processed:', ritualData);
    } else {
      console.log('   ❌ Ritual completion failed:', ritualResponse.status);
    }
    
    // Test 2: Simulate check-in with streak
    console.log('\n2. Simulating daily check-in...');
    
    const checkinResponse = await fetch(`${baseUrl}/api/badges/check-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: testUserId,
        eventType: 'check_in_completed',
        payload: {
          timestamp: new Date().toISOString(),
          streakCount: 8, // Should trigger G1_Lurker badge
          shieldUsed: false
        }
      })
    });
    
    if (checkinResponse.ok) {
      const checkinData = await checkinResponse.json();
      console.log('   ✓ Check-in processed:', checkinData);
      
      if (checkinData.badgesAwarded?.length > 0) {
        console.log('   🎉 BADGES EARNED:', checkinData.badgesAwarded);
      }
    } else {
      console.log('   ❌ Check-in failed:', checkinResponse.status);
    }
    
    // Test 3: Check badge collection
    console.log('\n3. Checking user badge collection...');
    
    const lockerResponse = await fetch(`${baseUrl}/api/badges/locker`, {
      headers: {
        'x-user-id': testUserId,
        'Content-Type': 'application/json'
      }
    });
    
    if (lockerResponse.ok) {
      const lockerData = await lockerResponse.json();
      console.log('   ✓ Badge collection loaded:', {
        totalBadges: lockerData.badges.length,
        totalAvailable: lockerData.totalAvailable,
        completionPercent: lockerData.completionPercent,
        userTier: lockerData.user.tier,
        userArchetype: lockerData.user.archetype
      });
      
      if (lockerData.badges.length > 0) {
        console.log('   🏆 Earned badges:');
        lockerData.badges.forEach((badge: any) => {
          console.log(`     - ${badge.badge.name} (${badge.badgeId}) earned via ${badge.sourceEvent}`);
        });
      } else {
        console.log('   📭 No badges earned yet');
      }
    } else {
      const errorText = await lockerResponse.text();
      console.log(`   ❌ Badge collection failed: ${lockerResponse.status} - ${errorText}`);
    }
    
    console.log('\n🎯 Badge Earning Test Complete!');
    
  } catch (error) {
    console.error('❌ Simulation failed:', error);
  }
}

// Run simulation
simulateBadgeEarning();
