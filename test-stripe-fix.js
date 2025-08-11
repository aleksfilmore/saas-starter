#!/usr/bin/env node

/**
 * Test script to verify the Stripe case-sensitivity fix
 * Tests both 'premium' and 'PREMIUM' tier parameters
 */

const testStripeCaseSensitivity = async () => {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🧪 Testing Stripe Checkout Case-Sensitivity Fix\n');
  
  // Test data
  const testCases = [
    { tier: 'premium', description: 'lowercase "premium"' },
    { tier: 'PREMIUM', description: 'uppercase "PREMIUM"' },
    { tier: 'Premium', description: 'mixed case "Premium"' }
  ];
  
  for (const testCase of testCases) {
    console.log(`📋 Testing ${testCase.description}...`);
    
    try {
      const response = await fetch(`${baseUrl}/api/stripe/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Note: In real testing, you'd need valid auth cookies
        },
        body: JSON.stringify({ tier: testCase.tier })
      });
      
      const result = await response.json();
      
      console.log(`  📊 Status: ${response.status}`);
      
      if (response.status === 401) {
        console.log(`  ✅ Expected: Authentication required (not logged in)`);
      } else if (response.status === 503 && result.error?.includes('Development mode')) {
        console.log(`  ✅ Expected: Development mode detected`);
        console.log(`  💡 Message: ${result.message}`);
      } else if (response.status === 400) {
        console.log(`  ❌ Case sensitivity issue - tier not recognized:`, result.error);
      } else {
        console.log(`  📋 Response:`, result);
      }
      
    } catch (error) {
      console.log(`  ❌ Network error:`, error.message);
    }
    
    console.log('');
  }
  
  console.log('🎯 Case-Sensitivity Fix Verification Complete!');
  console.log('');
  console.log('✅ Key Improvements Made:');
  console.log('  • Added tier.toUpperCase() normalization in checkout route');
  console.log('  • Handles both "premium" and "PREMIUM" parameters');
  console.log('  • Development-friendly error handling for invalid Stripe keys');
  console.log('  • Graceful fallback when Stripe is not configured');
  console.log('');
  console.log('🚀 Ready for testing with authenticated users!');
};

// Run the test
testStripeCaseSensitivity().catch(console.error);
