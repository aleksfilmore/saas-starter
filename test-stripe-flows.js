#!/usr/bin/env node

/**
 * Comprehensive Stripe Flow Testing Script
 * Tests all Stripe integrations in the SaaS application
 */

const BASE_URL = 'http://localhost:3001';

async function testStripeEndpoints() {
  console.log('🔥 Testing Stripe Integration Endpoints...\n');

  const tests = [
    {
      name: 'Subscription Creation',
      endpoint: '/api/stripe/subscription',
      method: 'POST',
      requiresAuth: true,
      data: {
        priceId: process.env.STRIPE_FIREWALL_PRICE_ID,
        tier: 'firewall'
      }
    },
    {
      name: 'Voice Therapy Purchase',
      endpoint: '/api/stripe/voice-therapy',
      method: 'POST',
      requiresAuth: true,
      data: {}
    },
    {
      name: 'Customer Portal',
      endpoint: '/api/stripe/portal',
      method: 'POST',
      requiresAuth: true,
      data: {}
    },
    {
      name: 'Checkout Session',
      endpoint: '/api/stripe/checkout',
      method: 'POST',
      requiresAuth: false,
      data: {
        tier: 'firewall'
      }
    }
  ];

  for (const test of tests) {
    console.log(`Testing: ${test.name}`);
    console.log(`Endpoint: ${test.endpoint}`);
    
    try {
      const headers = {
        'Content-Type': 'application/json'
      };

      if (test.requiresAuth) {
        // Mock auth token - in real testing you'd get this from login
        headers['Authorization'] = 'Bearer mock-token';
      }

      const response = await fetch(`${BASE_URL}${test.endpoint}`, {
        method: test.method,
        headers,
        body: test.data ? JSON.stringify(test.data) : undefined
      });

      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Success');
        if (data.url) {
          console.log(`Redirect URL: ${data.url}`);
        }
      } else {
        const error = await response.text();
        console.log('❌ Failed');
        console.log(`Error: ${error}`);
      }
    } catch (error) {
      console.log('❌ Network Error');
      console.log(`Error: ${error.message}`);
    }
    
    console.log('---\n');
  }
}

async function testWebhookEndpoint() {
  console.log('🎣 Testing Webhook Endpoint...\n');
  
  try {
    const response = await fetch(`${BASE_URL}/api/stripe/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'mock-signature'
      },
      body: JSON.stringify({
        type: 'customer.subscription.created',
        data: {
          object: {
            id: 'sub_test',
            customer: 'cus_test',
            metadata: { userId: 'user_test' },
            status: 'active'
          }
        }
      })
    });

    console.log(`Webhook Status: ${response.status}`);
    
    if (response.ok) {
      console.log('✅ Webhook endpoint accessible');
    } else {
      console.log('❌ Webhook failed (expected for mock signature)');
    }
  } catch (error) {
    console.log('❌ Webhook Network Error');
    console.log(`Error: ${error.message}`);
  }
  
  console.log('---\n');
}

async function testStripeConfig() {
  console.log('⚙️ Testing Stripe Configuration...\n');
  
  const requiredEnvVars = [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_FIREWALL_PRICE_ID',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
  ];

  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar];
    if (value) {
      console.log(`✅ ${envVar}: ${value.substring(0, 10)}...`);
    } else {
      console.log(`❌ ${envVar}: Missing`);
    }
  }
  
  console.log('---\n');
}

async function main() {
  console.log('🚀 Stripe Flow Testing Started\n');
  
  await testStripeConfig();
  await testWebhookEndpoint();
  await testStripeEndpoints();
  
  console.log('✨ Testing Complete!');
  console.log('\n📋 Summary:');
  console.log('- Check server logs for detailed error information');
  console.log('- Ensure Stripe webhook endpoint is configured in Stripe dashboard');
  console.log('- Test actual payments with Stripe test cards');
  console.log('- Verify database updates after successful webhooks');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testStripeEndpoints, testWebhookEndpoint, testStripeConfig };
