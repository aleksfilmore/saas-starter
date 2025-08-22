// Check for undefined environment variables that could cause JSON parsing errors
console.log('🔍 Checking critical environment variables...');

const criticalEnvVars = [
  'NEXT_PUBLIC_APP_URL',
  'EMAIL_API_KEY',
  'EMAIL_FROM',
  'NEXTAUTH_URL',
  'NODE_ENV'
];

let hasIssues = false;

criticalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value === 'undefined') {
    console.log(`❌ ${varName}: ${value || 'NOT SET'}`);
    hasIssues = true;
  } else {
    console.log(`✅ ${varName}: ${value.length > 50 ? value.substring(0, 50) + '...' : value}`);
  }
});

if (hasIssues) {
  console.log('\n⚠️ Some environment variables are missing or undefined');
  console.log('This could cause JSON parsing errors during build');
} else {
  console.log('\n🎉 All critical environment variables are set');
}

// Check if we're in build phase
console.log('\n📋 Build context:');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`RUNTIME_PHASE: ${process.env.RUNTIME_PHASE || 'NOT SET'}`);
console.log(`Building: ${process.env.NEXT_PHASE === 'phase-production-build' ? 'YES' : 'NO'}`);
