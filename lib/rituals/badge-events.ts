
interface RitualBadgePayload {
  ritualId: string;
  category?: string;
  mode: 'ghost' | 'firewall';
  journalWordCount?: number;
  dwellTimeSeconds?: number;
}

export async function triggerRitualBadgeEvent(userId: string, payload: RitualBadgePayload) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  try {
    await fetch(`${baseUrl}/api/badges/check-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        eventType: 'ritual_completed',
        payload
      })
    });
  } catch (e) {
    console.warn('Badge event failed (non-blocking)', e);
  }
}