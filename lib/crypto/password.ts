// Secure password hashing utilities using Node.js crypto
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

// Configuration for password hashing
const SALT_LENGTH = 32; // 256 bits
const KEY_LENGTH = 64;  // 512 bits

/**
 * Hash a password using scrypt with a random salt
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    // Generate a random salt
    const salt = randomBytes(SALT_LENGTH);
    
    // Hash the password with scrypt
    const derivedKey = await scryptAsync(
      password, 
      salt, 
      KEY_LENGTH
    ) as Buffer;
    
    // Combine salt and hash, then encode as base64
    const combined = Buffer.concat([salt, derivedKey]);
    return combined.toString('base64');
  } catch (error) {
    throw new Error(`Password hashing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    // Decode the combined salt+hash
    const combined = Buffer.from(hash, 'base64');
    
    // Extract salt and stored hash
    const salt = combined.subarray(0, SALT_LENGTH);
    const storedHash = combined.subarray(SALT_LENGTH);
    
    // Hash the input password with the same salt
    const derivedKey = await scryptAsync(
      password, 
      salt, 
      KEY_LENGTH
    ) as Buffer;
    
    // Compare hashes using constant-time comparison
    return timingSafeEqual(storedHash, derivedKey);
  } catch (error) {
    // Log error but don't reveal details to prevent information leakage
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Constant-time buffer comparison to prevent timing attacks
 */
function timingSafeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  
  return result === 0;
}

/**
 * Generate a cryptographically secure random string
 */
export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString('base64url');
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters long');
  }
  
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check for common weak passwords
  const commonPasswords = [
    'password', 'password123', '123456', '123456789', 'qwerty', 
    'abc123', 'admin', 'letmein', 'welcome', 'monkey'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
