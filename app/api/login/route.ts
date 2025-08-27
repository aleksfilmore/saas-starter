// Login API route - Production Lucia authentication
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
// Login is now handled by Auth0. This route redirects clients to the Auth0 Pages API login flow.
// We intentionally no longer create local Lucia sessions here.

// Force Node runtime (postgres-js + bcrypt need Node, not Edge) and disable static optimization
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export interface LoginResponse {
  error?: string | null;
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    tier: string;
    bytes: number;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Redirect POST login attempts to Auth0-hosted login page.
  // The frontend should follow the redirect and complete Auth0's flow.
  const redirectUrl = new URL('/api/auth/login', request.url);
  return NextResponse.redirect(redirectUrl, 303);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
