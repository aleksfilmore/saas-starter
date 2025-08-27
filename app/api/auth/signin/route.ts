import { NextRequest, NextResponse } from 'next/server';
// lucia shim removed from this route; auth flows now use Auth0 hosted pages and `validateRequest` where needed
import { db } from '@/lib/db/drizzle';
// Use the same users table source as auth (actual-schema) to match field names
import { users } from '@/lib/db/actual-schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// Force Node.js runtime for database operations
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  // Delegate sign-in to Auth0 hosted login flow. Clients (browser) should follow the redirect and complete auth.
  const redirectUrl = new URL('/api/auth/login', request.url);
  return NextResponse.redirect(redirectUrl, 303);
}
