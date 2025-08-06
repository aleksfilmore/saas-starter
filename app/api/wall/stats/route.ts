import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Calculate stats from global storage
    const totalPosts = global.wallPosts?.size || 0;
    const totalReactions = Array.from(global.wallReactions?.values() || []).length;
    
    // Mock stats with some real data mixed in
    const stats = {
      activeHealers: 1247 + Math.floor(totalPosts / 10), // Base + posts factor
      heartsGiven: 89423 + totalReactions * 3, // Base + reactions factor  
      supportMessages: 12891 + totalPosts * 5, // Base + posts factor
      totalPosts: totalPosts + 156, // Real posts + mock posts
      categoryCounts: {
        system_error: 45,
        loop_detected: 32,
        memory_leak: 28,
        buffer_overflow: 41,
        syntax_error: 23,
        access_denied: 19,
        null_pointer: 15,
        stack_overflow: 22
      }
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Wall stats error:', error);
    return NextResponse.json(
      { error: 'Failed to load stats' },
      { status: 500 }
    );
  }
}
