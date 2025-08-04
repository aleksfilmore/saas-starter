#!/usr/bin/env node

/**
 * Route verification script - checks for duplicate pages
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying route structure...\n');

// Check for duplicate routes
const routes = [
  { main: 'app/privacy/page.tsx', marketing: 'app/(marketing)/privacy/page.tsx' },
  { main: 'app/terms/page.tsx', marketing: 'app/(marketing)/terms/page.tsx' }
];

let allClean = true;

routes.forEach(({ main, marketing }) => {
  const mainExists = fs.existsSync(path.join(process.cwd(), main));
  const marketingExists = fs.existsSync(path.join(process.cwd(), marketing));
  
  console.log(`📄 ${main}: ${mainExists ? '✅ EXISTS' : '❌ MISSING'}`);
  console.log(`📄 ${marketing}: ${marketingExists ? '⚠️  DUPLICATE!' : '✅ REMOVED'}`);
  
  if (mainExists && marketingExists) {
    console.log(`❌ ERROR: Duplicate routes for ${main.split('/').pop().replace('.tsx', '')}`);
    allClean = false;
  }
});

// Check for Babel config
const babelExists = fs.existsSync(path.join(process.cwd(), 'babel.config.js'));
console.log(`\n🔧 babel.config.js: ${babelExists ? '⚠️  STILL EXISTS (should be removed)' : '✅ REMOVED'}`);

if (babelExists) {
  allClean = false;
}

console.log('\n' + '='.repeat(50));

if (allClean) {
  console.log('🎉 Route structure is clean!');
  console.log('🚀 Ready for Netlify deployment');
} else {
  console.log('⚠️  Issues found that need fixing');
  process.exit(1);
}

console.log('\n📋 Next steps:');
console.log('1. Commit all changes');
console.log('2. Push to trigger Netlify build');
console.log('3. Deployment should succeed! 🎯');
