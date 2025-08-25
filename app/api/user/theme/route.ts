import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';

export async function GET(){
  const { user } = await validateRequest();
  if(!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const rows = await db.select({ theme: users.avatarStyle }).from(users).where(eq(users.id, user.id)).limit(1); // repurpose avatarStyle as theme placeholder
  return NextResponse.json({ theme: rows[0]?.theme || null });
}

export async function PATCH(req: NextRequest){
  const { user } = await validateRequest();
  if(!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json().catch(()=>({}));
    const theme = (body.theme === 'light' || body.theme === 'dark') ? body.theme : null; // null = follow system
  await db.update(users).set({ avatarStyle: theme }).where(eq(users.id, user.id));
    return NextResponse.json({ success:true, theme });
  } catch(e){
    console.error('theme update error', e);
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
  }
}