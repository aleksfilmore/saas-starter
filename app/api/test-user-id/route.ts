import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { getUserId } from '@/lib/utils';

export async function GET() {
  try {
    console.log('=== User ID Test Endpoint ===');
    
    // Test getUserId function with different inputs
    const testCases = [
      { input: { id: '1' }, description: 'String "1"' },
      { input: { id: '123' }, description: 'String "123"' },
      { input: { id: 'abc123' }, description: 'String "abc123"' },
      { input: { id: 'c70b1a88-8dfb-4537-9a34-91d4cb08324c' }, description: 'UUID string' },
      { input: { id: '' }, description: 'Empty string' },
    ];

    const results = [];

    for (const testCase of testCases) {
      try {
        const result = getUserId(testCase.input as any);
        results.push({
          input: testCase.input.id,
          description: testCase.description,
          success: true,
          result: result,
          type: typeof result
        });
      } catch (error) {
        results.push({
          input: testCase.input.id,
          description: testCase.description,
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    console.log('Test results:', results);

    // Now try to get the actual user
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ 
        message: 'Test completed - User not authenticated',
        testResults: results
      });
    }

    console.log('Real user object:', user);
    console.log('Real user ID:', user.id, 'Type:', typeof user.id);

    try {
      const userId = getUserId(user);
      console.log('Real user - Successfully got user ID:', userId);
      
      return NextResponse.json({ 
        message: 'Test completed - User authenticated',
        testResults: results,
        realUser: {
          rawUserId: user.id,
          rawUserIdType: typeof user.id,
          userId: userId,
          userIdType: typeof userId,
          success: true
        }
      });
    } catch (getUserIdError) {
      console.error('Real user - getUserId error:', getUserIdError);
      return NextResponse.json({ 
        message: 'Test completed - User authenticated but getUserId failed',
        testResults: results,
        realUser: {
          rawUserId: user.id,
          rawUserIdType: typeof user.id,
          success: false,
          error: getUserIdError instanceof Error ? getUserIdError.message : String(getUserIdError)
        }
      });
    }

  } catch (error) {
    console.error('Test API - General error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
