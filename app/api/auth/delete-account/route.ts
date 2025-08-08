import { NextRequest, NextResponse } from 'next/server';
import { validateRequest, lucia } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(request: NextRequest) {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In production, you might want additional confirmation like password verification
    // For now, we'll proceed with GDPR-compliant deletion
    
    try {
      // Delete user data from database
      await db.delete(users).where(eq(users.id, user.id));
      
      // Invalidate all sessions for this user
      await lucia.invalidateUserSessions(user.id);
      
      console.log(`Account deleted for user: ${user.id}`);
      
      return NextResponse.json({ 
        success: true,
        message: 'Account has been permanently deleted' 
      });
      
    } catch (dbError) {
      console.error('Database deletion error:', dbError);
      return NextResponse.json({ 
        error: 'Failed to delete account data' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete account' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    // For now, we'll just return an error since account deletion is sensitive
    // In production, you'd verify the password and delete the user account
    
    return NextResponse.json({ 
      error: 'Account deletion is not yet implemented in production mode' 
    }, { status: 400 });

  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete account' 
    }, { status: 500 });
  }
}
