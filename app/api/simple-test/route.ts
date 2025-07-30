// Ultra-simple test API to check if API routes work at all
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('=== Simple test GET called ===');
  return NextResponse.json({ 
    status: 'working', 
    message: 'API routes are functioning',
    timestamp: new Date().toISOString()
  });
}

export async function POST() {
  console.log('=== Simple test POST called ===');
  return NextResponse.json({ 
    status: 'working', 
    message: 'POST API routes are functioning',
    timestamp: new Date().toISOString()
  });
}
