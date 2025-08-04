#!/usr/bin/env node

// Quick deployment readiness test
console.log('🔍 Testing deployment readiness...\n');

const requiredPackages = [
  'lucia',
  'nanoid',
  '@radix-ui/react-checkbox',
  '@radix-ui/react-label', 
  '@radix-ui/react-progress',
  '@types/bcryptjs',
  'framer-motion',
  'openai'
];

let allGood = true;

for (const pkg of requiredPackages) {
  try {
    require.resolve(pkg);
    console.log(`✅ ${pkg} - found`);
  } catch (e) {
    console.log(`❌ ${pkg} - MISSING`);
    allGood = false;
  }
}

console.log('\n' + (allGood ? '🎉 All dependencies resolved!' : '⚠️  Missing dependencies detected'));

if (!allGood) {
  console.log('\n💡 Run: npm install');
  process.exit(1);
}

console.log('\n🚀 Ready for deployment!');
