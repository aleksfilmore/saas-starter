#!/usr/bin/env node

console.log('🔍 Build Environment Check\n');

// Check Node.js version
console.log(`Node.js version: ${process.version}`);
console.log(`NPM version: ${process.env.npm_version || 'not available'}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);

// Check for critical packages
const criticalPackages = [
  'next',
  'react',
  'typescript',
  'tailwindcss',
  'postcss',
  '@babel/core',
  'lucia',
  'bcryptjs'
];

console.log('\n📦 Critical Package Check:');
let allGood = true;

for (const pkg of criticalPackages) {
  try {
    const version = require(`${pkg}/package.json`).version;
    console.log(`✅ ${pkg}: ${version}`);
  } catch (e) {
    console.log(`❌ ${pkg}: MISSING`);
    allGood = false;
  }
}

console.log(`\n${allGood ? '🎉 All critical packages found!' : '⚠️  Missing packages detected'}`);

if (process.env.NODE_ENV === 'production') {
  console.log('\n🚨 PRODUCTION MODE: devDependencies will NOT be installed');
} else {
  console.log('\n🔧 DEVELOPMENT MODE: All dependencies available');
}

console.log('\n🚀 Ready for build!');
