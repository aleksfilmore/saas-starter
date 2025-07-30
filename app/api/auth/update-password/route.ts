import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword, validatePasswordStrength } from '@/lib/crypto/password';

// Force Node.js runtime for database operations
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmPassword } = await request.json();

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'New passwords do not match' }, { status: 400 });
    }

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: 'New password does not meet security requirements', details: passwordValidation.errors },
        { status: 400 }
      );
    }

    // Get user's current password hash
    const dbUser = await db
      .select({ hashedPassword: users.hashedPassword })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (dbUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const validPassword = await verifyPassword(currentPassword, dbUser[0].hashedPassword);
    if (!validPassword) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // Hash new password
    const newHashedPassword = await hashPassword(newPassword);

    // Update password in database
    await db
      .update(users)
      .set({ 
        hashedPassword: newHashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({ 
      success: true, 
      message: 'Password updated successfully' 
    });

  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json({ 
      error: 'Failed to update password' 
    }, { status: 500 });
  }
}
