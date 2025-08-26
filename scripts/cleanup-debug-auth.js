#!/usr/bin/env node

/**
 * Cleanup script to remove debug endpoints and rotate DEBUG_KEY after successful login
 * Run this after confirming production auth is working
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`✅ Removed: ${dirPath}`);
  } else {
    console.log(`ℹ️  Not found: ${dirPath}`);
  }
}

function generateNewDebugKey() {
  return crypto.randomBytes(16).toString('hex');
}

function updateEnvFile(filePath, newDebugKey) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Env file not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const debugKeyRegex = /^DEBUG_KEY=.+$/m;
  
  if (debugKeyRegex.test(content)) {
    content = content.replace(debugKeyRegex, `DEBUG_KEY=${newDebugKey}`);
  } else {
    content += `\nDEBUG_KEY=${newDebugKey}\n`;
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Updated DEBUG_KEY in: ${filePath}`);
}

console.log('🧹 Starting auth debug cleanup...\n');

// Remove debug endpoints
const debugEndpoints = [
  'app/api/debug/simple-login',
  'app/api/debug/seed-admin', 
  'app/api/debug/auth-user',
  'app/api/debug/users-sample',
  'app/api/debug/db-health',
  'app/api/debug/raw-user'
];

debugEndpoints.forEach(endpoint => {
  removeDirectory(endpoint);
});

// Generate new DEBUG_KEY
const newDebugKey = generateNewDebugKey();
console.log(`\n🔑 Generated new DEBUG_KEY: ${newDebugKey}`);

// Update .env files
updateEnvFile('.env', newDebugKey);
updateEnvFile('.env.local', newDebugKey);

console.log('\n✨ Cleanup complete!');
console.log('\n📋 Next steps:');
console.log('1. Update production environment with new DEBUG_KEY');
console.log('2. Commit and deploy these changes');
console.log('3. Verify normal login works at /api/login');
console.log('4. Remove this cleanup script');

console.log('\n🔒 Security notes:');
console.log('- Old DEBUG_KEY is now invalid');
console.log('- All debug endpoints removed from codebase');
console.log('- Production auth should work normally');
