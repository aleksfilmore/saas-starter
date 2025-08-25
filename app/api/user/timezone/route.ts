import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

export async function PATCH(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { timezone } = await req.json();
    if (!timezone || typeof timezone !== 'string') {
      return NextResponse.json({ error: 'Invalid timezone' }, { status: 400 });
    }
    // Basic whitelist pattern (IANA like 'America/New_York')
    if (!/^[A-Za-z_]+\/[A-Za-z_]+$/.test(timezone)) {
      return NextResponse.json({ error: 'Timezone must be IANA format Region/City' }, { status: 400 });
    }
    await db.execute(sql`UPDATE users SET timezone = ${timezone} WHERE id = ${user.id}`);
    return NextResponse.json({ success: true, timezone });
  } catch (e) {
    console.error('Timezone update error', e);
    return NextResponse.json({ error: 'Failed to update timezone' }, { status: 500 });
  }
}