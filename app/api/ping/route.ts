// Ultra-minimal test - no imports, no database
export async function GET() {
  return Response.json({ 
    status: 'alive',
    timestamp: new Date().toISOString(),
    message: 'Basic API working'
  });
}
