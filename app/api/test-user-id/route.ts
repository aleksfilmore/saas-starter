import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { parseUserId } from '@/lib/utils';

export async function GET() {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    console.log('Test API - Raw user object:', user);
    console.log('Test API - User ID:', user.id, 'Type:', typeof user.id);

    try {
      const parsedId = parseUserId(user);
      console.log('Test API - Successfully parsed user ID:', parsedId);
      
      return NextResponse.json({ 
        success: true,
        rawUserId: user.id,
        rawUserIdType: typeof user.id,
        parsedUserId: parsedId,
        parsedUserIdType: typeof parsedId,
        message: 'User ID parsing successful'
      });
    } catch (parseError) {
      console.error('Test API - Parse error:', parseError);
      return NextResponse.json({ 
        error: 'Failed to parse user ID',
        rawUserId: user.id,
        rawUserIdType: typeof user.id,
        parseError: parseError instanceof Error ? parseError.message : String(parseError)
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Test API - General error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
