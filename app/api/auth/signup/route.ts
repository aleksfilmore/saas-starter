import { NextRequest, NextResponse } from 'next/server';
// lucia shim removed from this route; signup now delegates to Auth0 hosted signup flow
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/unified-schema'; // FIXED: Use main schema consistently
import { generateId } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { hashPassword, validatePasswordStrength } from '@/lib/crypto/password';

// Force Node.js runtime for database operations
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  // Delegate signup to Auth0 hosted signup flow. Clients should follow the redirect to complete the flow.
  const redirectUrl = new URL('/api/auth/signup', request.url);
  return NextResponse.redirect(redirectUrl, 303);
}
