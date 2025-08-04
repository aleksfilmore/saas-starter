#!/usr/bin/env node

/**
 * Simple validation script to test if all critical dependencies are available
 * This helps identify potential version issues before deployment
 */

console.log('🔍 Validating critical dependencies...\n');

const criticalPackages = [
  'lucia',
  'nanoid', 
  'bcryptjs',
  '@types/bcryptjs',
  '@radix-ui/react-checkbox',
  '@radix-ui/react-label',
  '@radix-ui/react-progress',
  'framer-motion',
  'openai'
];

let allValid = true;

for (const pkg of criticalPackages) {
  try {
    require.resolve(pkg);
    console.log(`✅ ${pkg} - Available`);
  } catch (e) {
    console.log(`❌ ${pkg} - NOT FOUND`);
    allValid = false;
  }
}

console.log('\n' + '='.repeat(50));

if (allValid) {
  console.log('🎉 All critical dependencies validated!');
  console.log('🚀 Ready for Netlify deployment');
} else {
  console.log('⚠️  Some dependencies are missing');
  console.log('💡 Run: npm install');
  process.exit(1);
}

console.log('\n📋 Next steps:');
console.log('1. Commit package.json changes');
console.log('2. Push to trigger Netlify build');
console.log('3. Platform will be live for beta testers! 🎯');
