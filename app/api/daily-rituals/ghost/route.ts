import { NextRequest, NextResponse } from 'next/server';
// Opt out of static rendering; this route reads auth cookies.
export const dynamic = 'force-dynamic';
import { getTodayGhostRitual } from '@/lib/rituals/ghost-daily-ritual-service';
import { validateRequest } from '@/lib/auth';

// Expect optional X-Timezone-Offset header (minutes east of UTC, align with frontend convention) else 0.
export async function GET(req: NextRequest) {
  try {
  const { user } = await validateRequest();
  if (!user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    const offsetHeader = req.headers.get('x-timezone-offset');
    let tzOffsetMinutes = 0;
    if (offsetHeader) {
      const parsed = parseInt(offsetHeader, 10);
      if (!Number.isNaN(parsed) && Math.abs(parsed) <= 14 * 60) tzOffsetMinutes = parsed;
    }
  const { ritual, date } = getTodayGhostRitual({ userId: user.id, tzOffsetMinutes });
    return NextResponse.json({ date, ritual });
  } catch (e: any) {
    console.error('Ghost ritual route error', e);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
