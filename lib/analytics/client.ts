// Lightweight browser analytics client
export interface ClientAnalyticsOptions {
  endpoint?: string;
}

const DEFAULT_ENDPOINT = '/api/analytics/track';

export class AnalyticsClient {
  private endpoint: string;

  constructor(opts: ClientAnalyticsOptions = {}) {
    this.endpoint = opts.endpoint || DEFAULT_ENDPOINT;
  }

  async track(event: string, properties?: Record<string, any>) {
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, properties })
      });
    } catch (e) {
      // Swallow errors
      console.warn('analytics track failed', e);
    }
  }
}

export const analytics = new AnalyticsClient();
