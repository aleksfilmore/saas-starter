// Quick API test for debugging authentication issues
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test environment variables
    const postgresUrl = process.env.POSTGRES_URL;
    console.log('POSTGRES_URL exists:', !!postgresUrl);
    console.log('POSTGRES_URL starts with:', postgresUrl?.substring(0, 20));
    
    // Test database connection
    const { db } = await import('@/lib/db/drizzle');
    const { users } = await import('@/lib/db/schema');
    
    // Try a simple query
    const userCount = await db.select().from(users).limit(1);
    console.log('Database query successful, user count sample:', userCount.length);
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      envVars: {
        postgres: !!postgresUrl,
        nodeEnv: process.env.NODE_ENV || 'not set'
      },
      userSample: userCount.length
    });
    
  } catch (error) {
    console.error('API test error:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      envVars: {
        postgres: !!process.env.POSTGRES_URL,
        nodeEnv: process.env.NODE_ENV || 'not set'
      }
    }, { status: 500 });
  }
}
