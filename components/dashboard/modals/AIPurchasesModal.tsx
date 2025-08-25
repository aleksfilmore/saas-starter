"use client";
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PurchaseRow { id:string; granted:number; used:number; expiresAt:string; }
interface HistoryPoint { day:string; used:number }
interface QuotaResp { used:number; remaining:number; cap:number|null; unlimited:boolean; tier:string; softCap?:number; purchases?:PurchaseRow[]; history?:HistoryPoint[] }

export function AIPurchasesModal({ open, onClose }: { open:boolean; onClose:()=>void }) {
  const [data,setData] = React.useState<QuotaResp|null>(null);
  const [loading,setLoading] = React.useState(false);
  React.useEffect(()=>{ if(!open) return; let active = true; (async()=>{ setLoading(true); try { const r = await fetch('/api/ai-therapy/usage?history=1'); if(r.ok){ const j = await r.json(); if(active) setData(j); if(!j.unlimited){ const ph = await fetch('/api/ai-therapy/purchases'); if(ph.ok){ const pj = await ph.json(); if(active) setData(d=> d? {...d, purchases: pj.purchases} : d); } } } } finally { if(active) setLoading(false);} })(); return ()=>{ active=false; }; },[open]);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>AI Therapy Message Usage</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {loading && <p className="text-sm text-slate-400">Loading…</p>}
          {data && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">Tier: <span className="font-medium">{data.tier}</span>{data.unlimited && data.softCap && <span> • Soft cap {data.softCap}/day</span>}</p>
              <p className="text-xs text-slate-300">Used: {data.used}{data.cap!==null && <> / {data.cap}</>}{data.unlimited && data.softCap && <> ({Math.round(data.used/Math.max(1,data.softCap)*100)}%)</>}</p>
              {data.history && data.history.length>0 && (
                <div className="border border-slate-700 rounded-md bg-slate-800/40">
                  <div className="px-3 py-2 text-[11px] uppercase tracking-wide text-slate-400">Last 7 Days Usage</div>
                  <div className="max-h-32 overflow-y-auto divide-y divide-slate-700">
                    {data.history.map(h=> (
                      <div key={h.day} className="px-3 py-1 text-[11px] flex justify-between">
                        <span>{h.day}</span>
                        <span className="text-slate-400">{h.used}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!data.unlimited && data.purchases && (
                <div className="border border-slate-700 rounded-md divide-y divide-slate-700 bg-slate-800/40">
                  <div className="px-3 py-2 text-[11px] uppercase tracking-wide text-slate-400">Active Purchases</div>
                  {data.purchases.length === 0 && <div className="px-3 py-3 text-xs text-slate-500">No active purchases.</div>}
                  {data.purchases.map(p=>{ const rem = p.granted - p.used; return (
                    <div key={p.id} className="px-3 py-2 text-xs flex items-center justify-between">
                      <span className="text-slate-300">{rem} / {p.granted} left</span>
                      <span className="text-slate-500">exp {new Date(p.expiresAt).toLocaleDateString()}</span>
                    </div>
                  ); })}
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={onClose} className="border-slate-600">Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
