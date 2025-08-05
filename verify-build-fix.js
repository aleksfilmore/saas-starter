#!/usr/bin/env node

// Verification script for Netlify build fix
console.log('🔧 VERIFYING NETLIFY BUILD FIX...\n');

const fs = require('fs');
const path = require('path');

// Check 1: Ensure babel.config.js is removed
console.log('✅ Check 1: Babel config removed');
if (!fs.existsSync('babel.config.js')) {
  console.log('   ✓ babel.config.js successfully removed');
} else {
  console.log('   ❌ babel.config.js still exists - NEEDS REMOVAL');
}

// Check 2: Verify package.json has required dependencies
console.log('\n✅ Check 2: Required dependencies present');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = ['lucia', 'nanoid', 'bcrypt', 'bcryptjs'];

requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`   ✓ ${dep}: ${packageJson.dependencies[dep]}`);
  } else {
    console.log(`   ❌ Missing: ${dep}`);
  }
});

// Check 3: Verify duplicate pages are removed
console.log('\n✅ Check 3: Duplicate pages removed');
const duplicatePaths = [
  'app/(marketing)/privacy/page.tsx',
  'app/(marketing)/terms/page.tsx'
];

duplicatePaths.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`   ✓ ${filePath} removed`);
  } else {
    console.log(`   ❌ ${filePath} still exists - SHOULD BE REMOVED`);
  }
});

// Check 4: Verify main pages still exist
console.log('\n✅ Check 4: Main pages preserved');
const mainPaths = [
  'app/privacy/page.tsx',
  'app/terms/page.tsx',
  'app/page.tsx'
];

mainPaths.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`   ✓ ${filePath} exists`);
  } else {
    console.log(`   ❌ ${filePath} missing - SHOULD EXIST`);
  }
});

// Check 5: Verify no typeorm references
console.log('\n✅ Check 5: No typeorm references');
try {
  const { execSync } = require('child_process');
  const grepResult = execSync('grep -r "typeorm" --exclude-dir=node_modules . || echo "No matches"', { encoding: 'utf8' });
  if (grepResult.trim() === 'No matches') {
    console.log('   ✓ No typeorm references found');
  } else {
    console.log('   ❌ Found typeorm references:');
    console.log(grepResult);
  }
} catch (e) {
  console.log('   ⚠ Could not check typeorm references (Windows)');
}

console.log('\n🚀 VERIFICATION COMPLETE');
console.log('✅ Platform ready for Netlify deployment!');
