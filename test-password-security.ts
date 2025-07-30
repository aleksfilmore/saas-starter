// Test script for secure password hashing
import { hashPassword, verifyPassword, validatePasswordStrength } from './lib/crypto/password';

async function testPasswordSecurity() {
  console.log('🔐 Testing secure password hashing...\n');

  // Test password validation
  console.log('📋 Testing password validation:');
  const weakPassword = 'weak';
  const strongPassword = 'MySecureP@ssw0rd123';
  
  const weakValidation = validatePasswordStrength(weakPassword);
  const strongValidation = validatePasswordStrength(strongPassword);
  
  console.log(`Weak password "${weakPassword}":`, weakValidation);
  console.log(`Strong password "${strongPassword}":`, strongValidation);
  console.log('');

  // Test password hashing and verification
  console.log('🔒 Testing password hashing and verification:');
  const testPassword = 'TestP@ssw0rd123!';
  
  try {
    console.log('Hashing password...');
    const hash = await hashPassword(testPassword);
    console.log('Hash generated successfully:', hash.substring(0, 20) + '...');
    
    console.log('Verifying correct password...');
    const correctVerification = await verifyPassword(testPassword, hash);
    console.log('Correct password verification:', correctVerification);
    
    console.log('Verifying incorrect password...');
    const incorrectVerification = await verifyPassword('WrongPassword', hash);
    console.log('Incorrect password verification:', incorrectVerification);
    
    console.log('\n✅ All password security tests passed!');
  } catch (error) {
    console.error('❌ Password security test failed:', error);
  }
}

testPasswordSecurity();
