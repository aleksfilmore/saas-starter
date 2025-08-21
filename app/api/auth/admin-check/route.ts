import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';

export async function GET() {
  try {
    const { user } = await validateRequest();
    
    const isAdmin = user?.email === 'system_admin@ctrlaltblock.com';
    
    return NextResponse.json({ 
      isAdmin,
      user: isAdmin ? user : null 
    });
  } catch (error) {
    return NextResponse.json({ isAdmin: false, user: null }, { status: 401 });
  }
}
