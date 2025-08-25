/** Central analytics emit helper (server + client safe) */
export async function emitAnalytics(event: string, data?: { userId?: string; properties?: Record<string,any> }) {
  try {
    await fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || '/api/events', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ event, ...(data?.userId? { userId: data.userId }:{}), properties: data?.properties })
    });
  } catch (e) {
    // swallow errors silently to not break UX
  }
}
