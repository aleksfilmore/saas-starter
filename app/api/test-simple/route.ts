// Simple test API route to verify API routes are working
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('=== Simple Test API Called ===');
  
  return NextResponse.json({
    status: 'success',
    message: 'API routes are working',
    timestamp: new Date().toISOString()
  });
}

export async function POST() {
  console.log('=== Simple Test API POST Called ===');
  
  return NextResponse.json({
    status: 'success',
    message: 'POST API routes are working',
    timestamp: new Date().toISOString()
  });
}
