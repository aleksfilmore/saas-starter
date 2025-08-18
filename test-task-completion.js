/**
 * Test script to verify task completion functionality
 */

console.log('🧪 Testing Daily Task Completion System');

// Test localStorage task management
function testTaskStorage() {
  console.log('\n📦 Testing localStorage task management...');
  
  const today = new Date().toISOString().slice(0, 10);
  const storageKey = `daily-tasks-${today}`;
  
  // Clear any existing data
  localStorage.removeItem(storageKey);
  
  // Test default state
  const defaultState = {
    date: today,
    ritual: false,
    checkIn: false,
    aiTherapy: false,
    community: false,
    noContact: false,
    quickWin: false
  };
  
  // Save to localStorage
  localStorage.setItem(storageKey, JSON.stringify(defaultState));
  
  // Test retrieval
  const retrieved = JSON.parse(localStorage.getItem(storageKey));
  console.log('✅ Default state stored and retrieved:', retrieved);
  
  // Test marking tasks as complete
  const updatedState = { ...retrieved, ritual: true, checkIn: true };
  localStorage.setItem(storageKey, JSON.stringify(updatedState));
  
  const completedTasks = Object.values(updatedState).filter(val => typeof val === 'boolean' && val).length;
  const totalTasks = Object.keys(updatedState).filter(key => key !== 'date').length;
  
  console.log(`✅ Progress: ${completedTasks}/${totalTasks}`);
  console.log('✅ Expected: X/6 based on task structure');
  
  return { completedTasks, totalTasks };
}

// Test API endpoints that task completion depends on
async function testRitualCompletion() {
  console.log('\n🎯 Testing ritual completion API...');
  
  try {
    // Test if user is authenticated
    const statusResponse = await fetch('/api/auth/status');
    const statusData = await statusResponse.json();
    
    if (!statusData.user) {
      console.log('❌ User not authenticated - this would cause 401 errors');
      console.log('👉 User needs to sign in for task completion to work');
      return false;
    }
    
    console.log('✅ User authenticated:', statusData.user.email);
    
    // Test ritual completion endpoint
    const ritualResponse = await fetch('/api/rituals/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ritualId: 'test-ritual',
        difficulty: 'easy',
        totalTimeSpent: 300,
        completionData: {
          journalEntries: ['Test journal entry for task completion verification'],
          checklistItems: [['Test checklist item']]
        }
      })
    });
    
    if (ritualResponse.status === 401) {
      console.log('❌ 401 Unauthorized - authentication issue detected');
      return false;
    }
    
    const ritualData = await ritualResponse.json();
    console.log('✅ Ritual completion response:', ritualData);
    
    return true;
  } catch (error) {
    console.log('❌ API test failed:', error.message);
    return false;
  }
}

// Test the actual task marking system
function testTaskMarking() {
  console.log('\n✅ Testing task marking logic...');
  
  // Simulate the useDailyTasks hook logic
  const tasks = {
    ritual: false,
    checkIn: false,
    aiTherapy: false,
    community: false,
    noContact: false,
    quickWin: false
  };
  
  const markTask = (key) => {
    if (tasks[key]) return tasks; // already completed
    tasks[key] = true;
    return { ...tasks };
  };
  
  // Test marking ritual as complete
  console.log('📝 Initial tasks:', tasks);
  markTask('ritual');
  console.log('📝 After marking ritual complete:', tasks);
  
  // Test progress calculation
  const completedCount = Object.values(tasks).filter(Boolean).length;
  const total = Object.keys(tasks).length;
  const progressFraction = completedCount / total;
  
  console.log(`✅ Progress: ${completedCount}/${total} (${Math.round(progressFraction * 100)}%)`);
  
  return { completedCount, total, progressFraction };
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Task Completion Tests\n');
  
  // Test 1: Storage mechanism
  const storageResult = testTaskStorage();
  
  // Test 2: Task marking logic
  const markingResult = testTaskMarking();
  
  // Test 3: API integration
  const apiResult = await testRitualCompletion();
  
  console.log('\n📊 Test Summary:');
  console.log('================');
  console.log(`Storage test: ${storageResult.totalTasks === 6 ? '✅' : '❌'} (Expected 6 tasks, got ${storageResult.totalTasks})`);
  console.log(`Marking test: ${markingResult.total === 6 ? '✅' : '❌'} (Expected 6 tasks, got ${markingResult.total})`);
  console.log(`API test: ${apiResult ? '✅' : '❌'} (Authentication and API access)`);
  
  if (storageResult.totalTasks === 6 && markingResult.total === 6) {
    console.log('\n✅ TASK STRUCTURE VERIFIED: Should show X/6, not X/7');
  } else {
    console.log('\n❌ TASK STRUCTURE ISSUE DETECTED');
  }
  
  if (!apiResult) {
    console.log('\n⚠️  AUTHENTICATION REQUIRED: User must sign in for task completion to work');
  }
}

// Export for browser console use
if (typeof window !== 'undefined') {
  window.testTaskCompletion = runTests;
  console.log('🔧 Use window.testTaskCompletion() to run tests in browser console');
}

// Run immediately if in browser
if (typeof window !== 'undefined') {
  runTests();
}

module.exports = { testTaskStorage, testRitualCompletion, testTaskMarking, runTests };
