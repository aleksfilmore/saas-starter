import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';

async function testBadgeFlow() {
  console.log('🎯 Testing badge system with existing schema...');

  try {
    // 1. Find a test user
    console.log('1. Finding test user...');
    const users = await db.execute(sql`SELECT id, email, tier, archetype FROM users LIMIT 1`);
    if (users.length === 0) {
      console.log('❌ No users found');
      return;
    }
    
    const user = users[0];
    console.log(`✅ Found user: ${user.email} (tier: ${user.tier || 'none'}, archetype: ${user.archetype || 'none'})`);

    // 2. Test badge API directly
    console.log('\n2. Testing badge check-in API...');
    
    const response = await fetch('http://localhost:3001/api/badges/check-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        eventType: 'ritual_completed',
        payload: {
          ritualType: 'daily_reflection',
          completedAt: new Date().toISOString(),
          streakCount: 5
        }
      })
    });

    console.log(`API Response: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Badge check-in successful:', result);
    } else {
      const error = await response.text();
      console.log('❌ Badge check-in failed:', error);
    }

    // 3. Test badge collection API
    console.log('\n3. Testing badge collection API...');
    
    const collectionResponse = await fetch('http://localhost:3001/api/badges/locker', {
      method: 'GET',
      headers: {
        'x-user-id': user.id as string
      }
    });

    console.log(`Collection API Response: ${collectionResponse.status} ${collectionResponse.statusText}`);
    
    if (collectionResponse.ok) {
      const badges = await collectionResponse.json();
      console.log('✅ Badge collection successful:', JSON.stringify(badges, null, 2));
    } else {
      const error = await collectionResponse.text();
      console.log('❌ Badge collection failed:', error);
    }

  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

// Start development server if not running
async function startDevServer() {
  console.log('🚀 Starting development server...');
  
  // Check if server is already running
  try {
    const healthCheck = await fetch('http://localhost:3001/api/health');
    if (healthCheck.ok) {
      console.log('✅ Server already running');
      return;
    }
  } catch (error) {
    // Server not running, start it
    console.log('Starting server...');
    const { spawn } = require('child_process');
    const server = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true,
      detached: true
    });
    
    // Wait a few seconds for server to start
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

async function main() {
  await startDevServer();
  await testBadgeFlow();
  process.exit(0);
}

main().catch(console.error);
