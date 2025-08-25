import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { getDashboardSnapshot } from '@/lib/dashboard/snapshot';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }
  const url = new URL(req.url);
  const intervalMs = Math.min(60000, Math.max(5000, parseInt(url.searchParams.get('interval')||'15000',10)));

  const stream = new ReadableStream({
    start(controller) {
      let timer: ReturnType<typeof setInterval> | null = null;
      const send = async () => {
        try {
          const snap = await getDashboardSnapshot(user.id);
          controller.enqueue(`event: snapshot\n`);
          controller.enqueue(`data: ${JSON.stringify(snap)}\n\n`);
        } catch (e: unknown) {
          const err = e instanceof Error ? e : new Error('Unknown error');
            controller.enqueue(`event: error\n`);
            controller.enqueue(`data: ${JSON.stringify({ message: err.message })}\n\n`);
        }
      };
      send();
      timer = setInterval(send, intervalMs);
      const abortHandler = () => {
        if (timer) clearInterval(timer);
        controller.close();
      };
      // Tie lifecycle to the request's abort signal
      req.signal.addEventListener('abort', abortHandler);
    }
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Transfer-Encoding': 'chunked'
    }
  });
}
