import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { upsertAuth0User } from '@/lib/auth/auth0-sync';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  try {
    const session = await getSession(req, res);
    const payload = req.body?.user || null;
    const user = await upsertAuth0User(payload, session);
    return res.status(200).json({ ok: true, user });
  } catch (err) {
    console.error('auth sync error', String(err));
    return res.status(500).json({ error: 'sync_failed', detail: String(err) });
  }
}
