#!/usr/bin/env node

/**
 * Premium Dashboard Functionality Test Script
 * This script tests all premium features to ensure they work correctly
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
const TEST_USER = {
  email: 'premium@test.com',
  password: 'password123'
};

let sessionCookie = '';

async function testSignIn() {
  console.log('🔐 Testing Sign In...');
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/signin`, TEST_USER);
    
    if (response.status === 200) {
      // Extract session cookie
      const cookies = response.headers['set-cookie'];
      if (cookies) {
        sessionCookie = cookies.find(cookie => cookie.includes('auth_session'));
        console.log('✅ Sign in successful');
        return true;
      }
    }
    console.log('❌ Sign in failed');
    return false;
  } catch (error) {
    console.log('❌ Sign in error:', error.response?.data || error.message);
    return false;
  }
}

async function testDashboardAPI() {
  console.log('📊 Testing Dashboard API...');
  try {
    const response = await axios.get(`${BASE_URL}/api/dashboard`, {
      headers: {
        'Cookie': sessionCookie || ''
      }
    });
    
    if (response.status === 200 && response.data) {
      console.log('✅ Dashboard API working');
      console.log('📈 User Stage:', response.data.ux_stage);
      console.log('🎯 Ritual Available:', !!response.data.ritual);
      console.log('💎 Bytes:', response.data.bytes);
      console.log('⚡ XP:', response.data.xp);
      return true;
    }
    return false;
  } catch (error) {
    console.log('❌ Dashboard API error:', error.response?.status, error.response?.data);
    return false;
  }
}

async function testAITherapyQuota() {
  console.log('🧠 Testing AI Therapy Quota...');
  try {
    const response = await axios.get(`${BASE_URL}/api/ai-therapy/quota`, {
      headers: {
        'Cookie': sessionCookie || ''
      }
    });
    
    if (response.status === 200) {
      console.log('✅ AI Therapy quota accessible');
      console.log('💬 Messages remaining:', response.data.remaining);
      return true;
    }
    return false;
  } catch (error) {
    console.log('❌ AI Therapy quota error:', error.response?.status, error.response?.data);
    return false;
  }
}

async function testWallAPI() {
  console.log('🧱 Testing Wall API...');
  try {
    const response = await axios.get(`${BASE_URL}/api/wall/feed`, {
      headers: {
        'Cookie': sessionCookie || ''
      }
    });
    
    if (response.status === 200) {
      console.log('✅ Wall feed accessible');
      console.log('📝 Posts available:', response.data.posts?.length || 0);
      return true;
    }
    return false;
  } catch (error) {
    console.log('❌ Wall API error:', error.response?.status, error.response?.data);
    return false;
  }
}

async function testRitualCompletion() {
  console.log('🎯 Testing Ritual Completion...');
  try {
    const response = await axios.post(`${BASE_URL}/api/rituals/complete`, {
      ritualId: 'test-ritual-001',
      difficulty: 'medium',
      notes: 'Test completion'
    }, {
      headers: {
        'Cookie': sessionCookie || '',
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 200) {
      console.log('✅ Ritual completion API working');
      console.log('🎁 Rewards:', response.data.rewards);
      return true;
    }
    return false;
  } catch (error) {
    console.log('❌ Ritual completion error:', error.response?.status, error.response?.data);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Premium Dashboard Tests...\n');
  
  const results = {
    signIn: await testSignIn(),
    dashboard: false,
    aiTherapy: false,
    wall: false,
    rituals: false
  };
  
  if (results.signIn) {
    results.dashboard = await testDashboardAPI();
    results.aiTherapy = await testAITherapyQuota();
    results.wall = await testWallAPI();
    results.rituals = await testRitualCompletion();
  }
  
  console.log('\n📋 Test Results Summary:');
  console.log('=========================');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test.toUpperCase()}: ${passed ? 'PASS' : 'FAIL'}`);
  });
  
  const totalPassed = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${totalPassed}/${totalTests} tests passed`);
  
  if (totalPassed === totalTests) {
    console.log('🎉 All premium features working correctly!');
  } else {
    console.log('⚠️  Some features need attention');
  }
}

runAllTests().catch(console.error);
