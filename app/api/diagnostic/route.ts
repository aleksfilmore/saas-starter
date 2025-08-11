// Diagnostic endpoint to test auth and database step by step
export async function GET() {
  try {
    console.log('🔍 Starting production diagnostic...');
    
    // Step 1: Test environment variables
    const hasPostgresUrl = !!process.env.POSTGRES_URL;
    const hasAuthSecret = !!process.env.AUTH_SECRET;
    const nodeEnv = process.env.NODE_ENV;
    
    console.log('Step 1 - Environment:', { hasPostgresUrl, hasAuthSecret, nodeEnv });
    
    if (!hasPostgresUrl) {
      return Response.json({ error: 'POSTGRES_URL missing' }, { status: 500 });
    }
    
    if (!hasAuthSecret) {
      return Response.json({ error: 'AUTH_SECRET missing' }, { status: 500 });
    }
    
    // Step 2: Test database import
    console.log('Step 2 - Testing database import...');
    const postgres = require('postgres');
    
    const client = postgres(process.env.POSTGRES_URL, {
      ssl: 'require',
      max: 1,
      prepare: false,
      connect_timeout: 5,
    });
    
    console.log('Step 3 - Testing database query...');
    const result = await client`SELECT 1 as test, current_database() as db`;
    console.log('Database query result:', result[0]);
    
    await client.end();
    console.log('Step 4 - Database connection closed successfully');
    
    // Step 3: Test auth import (this might be where it fails)
    console.log('Step 5 - Testing auth import...');
    try {
      const { validateRequest } = require('@/lib/auth');
      console.log('✅ Auth import successful');
    } catch (authError) {
      const errorMessage = authError instanceof Error ? authError.message : String(authError);
      console.log('❌ Auth import failed:', errorMessage);
      return Response.json({ 
        error: 'Auth import failed', 
        details: errorMessage,
        step: 'auth_import'
      }, { status: 500 });
    }
    
    return Response.json({ 
      success: true,
      message: 'All diagnostic steps passed',
      environment: {
        hasPostgresUrl,
        hasAuthSecret,
        nodeEnv
      },
      database: result[0]
    });
    
  } catch (error) {
    console.error('Diagnostic failed:', error);
    return Response.json({ 
      error: 'Diagnostic failed',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack?.split('\n').slice(0, 5) : []
    }, { status: 500 });
  }
}
