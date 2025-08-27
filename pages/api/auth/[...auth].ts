import { handleAuth, handleCallback, getSession } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';
import { upsertAuth0User } from '@/lib/auth/auth0-sync';

async function callbackHandler(req: NextApiRequest, res: NextApiResponse) {
	// Let the SDK handle the callback/session creation first
	await handleCallback(req, res, { afterCallback: async (req2, res2, session) => {
		try {
			// Upsert the authenticated user to local DB
			await upsertAuth0User(null, session);
		} catch (err) {
			// don't block the login flow on DB errors; just log
			console.error('auth callback upsert failed', String(err));
		}
		return session;
	}});
}

export default handleAuth({ callback: callbackHandler });
