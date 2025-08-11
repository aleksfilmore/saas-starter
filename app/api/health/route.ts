// Minimal health check without database
export async function GET() {
  try {
    return Response.json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      hasPostgres: !!process.env.POSTGRES_URL
    });
  } catch (error) {
    return Response.json({ 
      error: 'Health check failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
