import { NextResponse } from 'next/server';
import { freeRitualBank } from '@/lib/data/free-ritual-bank';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      total: freeRitualBank.length,
      categories: [...new Set(freeRitualBank.map(r => r.category))],
      sampleRituals: freeRitualBank.slice(0, 3).map(r => ({ 
        id: r.id, 
        title: r.title, 
        category: r.category 
      }))
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
