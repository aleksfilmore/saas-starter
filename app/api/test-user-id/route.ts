import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { parseUserId } from '@/lib/utils';

export async function GET() {
  try {
    console.log('=== User ID Test Endpoint ===');
    
    // Test parseUserId function with different inputs
    const testCases = [
      { input: { id: '1' }, description: 'String "1"' },
      { input: { id: '123' }, description: 'String "123"' },
      { input: { id: '0' }, description: 'String "0"' },
      { input: { id: '-1' }, description: 'String "-1"' },
      { input: { id: 'abc' }, description: 'String "abc"' },
      { input: { id: '1.5' }, description: 'String "1.5"' },
      { input: { id: '' }, description: 'Empty string' },
    ];

    const results = [];

    for (const testCase of testCases) {
      try {
        const result = parseUserId(testCase.input as any);
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
      const parsedId = parseUserId(user);
      console.log('Real user - Successfully parsed user ID:', parsedId);
      
      return NextResponse.json({ 
        message: 'Test completed - User authenticated',
        testResults: results,
        realUser: {
          rawUserId: user.id,
          rawUserIdType: typeof user.id,
          parsedUserId: parsedId,
          parsedUserIdType: typeof parsedId,
          parseSuccess: true
        }
      });
    } catch (parseError) {
      console.error('Real user - Parse error:', parseError);
      return NextResponse.json({ 
        message: 'Test completed - User authenticated but parse failed',
        testResults: results,
        realUser: {
          rawUserId: user.id,
          rawUserIdType: typeof user.id,
          parseSuccess: false,
          parseError: parseError instanceof Error ? parseError.message : String(parseError)
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
