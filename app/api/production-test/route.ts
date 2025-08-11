// Simple production test - API route without drizzle import
export async function GET() {
  try {
    console.log('🚨 Production test - checking environment');
    
    // Check basic environment
    const hasPostgresUrl = !!process.env.POSTGRES_URL;
    const nodeEnv = process.env.NODE_ENV;
    
    console.log('Environment check:', { hasPostgresUrl, nodeEnv });
    
    if (!hasPostgresUrl) {
      return Response.json({ 
        error: 'Missing POSTGRES_URL', 
        env: nodeEnv 
      }, { status: 500 });
    }
    
    // Don't import drizzle/postgres to avoid schema issues for now
    return Response.json({ 
      success: true, 
      message: 'Environment OK - database import skipped for safety',
      env: nodeEnv,
      hasDb: hasPostgresUrl
    });
    
  } catch (error) {
    console.error('Production test error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack?.split('\n').slice(0, 5) : [];
    
    return Response.json({ 
      error: errorMessage,
      stack: errorStack,
      env: process.env.NODE_ENV
    }, { status: 500 });
  }
}
