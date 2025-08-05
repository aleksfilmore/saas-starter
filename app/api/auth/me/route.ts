import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/minimal-schema';
import { eq } from 'drizzle-orm';

// Force Node.js runtime for database operations
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // First try Lucia session validation
    const { user, session } = await validateRequest();
    
    if (user && session) {
      // Determine role
      const adminEmails = ['system_admin@ctrlaltblock.com'];
      const role = adminEmails.includes(user.email.toLowerCase()) ? 'admin' : 'user';
      
      return NextResponse.json({
        id: user.id,
        email: user.email,
        role,
      });
    }

    // Fallback: check localStorage token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      // Extract user ID from token (format: auth-token-{userId}-{timestamp})
      const tokenParts = token.split('-');
      if (tokenParts.length >= 3 && tokenParts[0] === 'auth' && tokenParts[1] === 'token') {
        const userId = tokenParts.slice(2, -1).join('-'); // Rejoin in case user ID contains dashes
        
        // Validate user exists in database
        const userResult = await db
          .select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);
          
        if (userResult.length > 0) {
          const user = userResult[0];
          const adminEmails = ['system_admin@ctrlaltblock.com'];
          const role = adminEmails.includes(user.email.toLowerCase()) ? 'admin' : 'user';
          
          return NextResponse.json({
            id: user.id,
            email: user.email,
            role,
          });
        }
      }
    }

    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
