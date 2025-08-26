// Client-side helper to broadcast byte balance changes so disparate UI elements
// (header wallet, badges, etc.) can stay in sync without prop drilling.
// Safe no-op on server (window undefined)
export interface BytesUpdateDetail { bytes?: number; delta?: number; source?: string; }
export function emitBytesUpdate(detail: BytesUpdateDetail){
  if (typeof window === 'undefined') return;
  try { window.dispatchEvent(new CustomEvent('bytes:update',{ detail })); } catch {}
  // Fire lightweight analytics event (sampled to reduce noise)
  try {
    if(Math.random() < 0.15){ // 15% sampling
      import('../analytics/client').then(m=>{
        const { AnalyticsEvents } = require('../analytics/events');
        m.trackEvent(AnalyticsEvents.BYTES_BALANCE_UPDATED, { source: detail.source, delta: detail.delta, bytes: detail.bytes });
      }).catch(()=>{});
    }
  } catch {}
}
