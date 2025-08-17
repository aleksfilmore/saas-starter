"use client";
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, MessageSquare, Brain, Calendar, BarChart3, Lock } from 'lucide-react';
import { getNoContactMessage } from '@/lib/no-contact-messages';
import { analytics } from '@/lib/analytics/client';
// Removed TileSkeleton, TileError (unused)

export interface DashboardTilesProps {
  mode: 'free' | 'premium';
  user: { noContactDays: number; wallPosts: number; streak?: number; level?: number; bytes?: number; subscriptionTier?: 'free'|'premium' };
  featureGates: { noContactTracker: boolean; aiTherapy: boolean; wallRead: boolean };
  aiQuota?: { msgsLeft: number; totalQuota: number };
}

interface TileDef {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  href?: string;
  locked?: boolean;
  lockReason?: string;
  cta?: string;
  gradient: string;
  badge?: string;
  body?: React.ReactNode;
  priority: number; // for sorting
}

export const DashboardTiles: React.FC<DashboardTilesProps> = ({ mode, user, featureGates, aiQuota }) => {
  // Derive streak prioritizing provided streak, then noContactDays (previous ordering caused zero override)
  const noContact = (user.streak !== undefined ? user.streak : user.noContactDays) ?? 0;

  const baseTiles: TileDef[] = [
    {
      id: 'streak',
      title: 'Streak Tracker',
      icon: <Shield className="w-6 h-6 text-white" />,
      description: 'Keep ghosts out of your DMs',
      href: '/no-contact',
      locked: !featureGates.noContactTracker,
      lockReason: 'Complete ritual to unlock',
      gradient: 'from-indigo-500 to-blue-500',
      priority: 40,
      body: (
        <div>
          <div className="text-center mb-3">
            <div className="text-3xl font-bold text-indigo-300 mb-1">{noContact}</div>
            <p className="text-xs text-gray-300">days</p>
          </div>
          {noContact > 0 ? (
            <div className="bg-zinc-800/50 rounded-lg p-2">
              <p className="text-[11px] text-gray-300 leading-relaxed">"{getNoContactMessage(noContact)}"</p>
            </div>
          ) : (
            <div className="bg-gray-800/50 rounded-lg p-2 text-center">
              <p className="text-[11px] text-gray-400">Tap ✔️ tomorrow to start your streak.</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'daily-guidance',
      title: 'Daily Guidance',
      icon: <Calendar className="w-6 h-6 text-white" />,
      description: '30-day structured arc',
      href: '/daily-rituals', // fix broken link (no /ritual root page)
      locked: mode==='free',
      lockReason: 'Premium feature',
      gradient: 'from-amber-500 to-orange-500',
      priority: 30,
      body: <p className="text-[11px] text-amber-200">🎯 Archetype-tailored micro plan.</p>
    },
    {
      id: 'ai-text',
      title: 'AI Therapy',
      icon: <Brain className="w-6 h-6 text-white" />,
      description: featureGates.aiTherapy ? 'Instant co-pilot support' : 'Complete ritual to unlock',
      href: '/ai-therapy',
      locked: !featureGates.aiTherapy,
      gradient: 'from-violet-500 to-purple-500',
      priority: 20,
      body: featureGates.aiTherapy ? (
        <div className="text-[11px] space-y-1 text-violet-200">
          {mode==='premium' ? <p>∞ Unlimited messaging</p> : <p>{aiQuota?.msgsLeft ?? 0} msgs left of 300</p>}
          <p>💬 24/7 structured guidance</p>
          <p>🎙 Voice mode coming soon (inside)</p>
        </div>
      ) : <p className="text-[11px] text-violet-200">Unlock AI-powered break-up coping.</p>
    },
    {
      id: 'progress',
      title: 'Progress Insights',
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      description: mode==='free' ? 'Basic metrics tracking' : 'Live metrics & analytics',
      href: '/dashboard/progress',
      locked: false,
      gradient: 'from-emerald-500 to-teal-500',
      badge: mode==='free' ? 'FREE' : 'LIVE',
      priority: 10,
      body: (
        <div className="space-y-2 text-emerald-200 text-xs">
          {mode==='free' ? <p>📊 Weekly summaries & streak stats</p> : <p>📊 Consistency, trends & CTR</p>}
        </div>
      )
    },
  ];

  // Only include wall tile for free users (avoid duplication with right-side feed on premium)
  if (mode === 'free') {
    baseTiles.push({
      id: 'wall',
      title: 'Community Wall',
      icon: <MessageSquare className="w-6 h-6 text-white" />,
      description: 'Anonymous confessions',
      href: '/wall',
      locked: false,
      gradient: 'from-indigo-500 to-purple-500',
      badge: user.wallPosts>0? `${user.wallPosts} shared` : 'READ',
      priority: 15,
      body: (<p className="text-xs text-indigo-200">Read & react. Premium can post.</p>)
    });
  }

  const tiles: TileDef[] = baseTiles;

  // Rising Post special tile (placeholder dynamic fetch)
  const [risingPost, setRisingPost] = React.useState<{ id:string; content:string; reactions:number }|null>(null);
  const [risingLoading, setRisingLoading] = React.useState(false);
  const [risingError, setRisingError] = React.useState<string|null>(null);
  React.useEffect(()=>{
    let active = true;
    (async ()=>{
      try {
        setRisingLoading(true); setRisingError(null);
        const res = await fetch('/api/wall/preview?limit=25', { cache:'no-store' });
        if(!res.ok) throw new Error('Failed');
        const data = await res.json();
        const pick = (data.posts||[])
          .filter((p:any)=> (p.reactionsCount||0) >= 3)
          .sort((a:any,b:any)=> b.reactionsCount - a.reactionsCount)[0];
        if(active && pick){
          setRisingPost({ id: pick.id, content: pick.content, reactions: pick.reactionsCount });
        }
      } catch(e:any){ if(active) setRisingError(e.message); }
      finally { if(active) setRisingLoading(false); }
    })();
    return ()=> { active = false };
  }, []);

  if(risingPost){
    tiles.push({
      id: 'rising',
      title: 'Rising Post',
      icon: <MessageSquare className="w-6 h-6 text-white" />,
      description: 'Trending in the last wave',
      href: `/wall#${risingPost.id}`,
      locked: false,
      gradient: 'from-pink-500 to-rose-500',
      badge: `❤️ ${risingPost.reactions}`,
      priority: 25,
      body: (
        <div className="text-[11px] text-pink-100 line-clamp-4">“{risingPost.content}”</div>
      )
    });
  }

  // Behavior-based weighting adjustments (simple heuristic)
  // Increase priority if user recently engaged in related area (placeholder heuristics using counts)
  tiles.forEach(t => {
    if(t.id==='wall' && user.wallPosts>3){ t.priority += 5; }
    if(t.id==='streak' && noContact>=7){ t.priority += 3; }
    if(t.id==='progress' && (user.level??0) > 5){ t.priority += 2; }
  });

  const sorted = tiles.sort((a,b)=> b.priority - a.priority);

  // intersection-based impressions
  const impressionSent = useRef<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement|null>(null);
  useEffect(()=>{
    analytics.track('dashboard_viewed', { mode, tileCount: sorted.length });
    const els = containerRef.current?.querySelectorAll('[data-tile-id]');
    if(!els || !('IntersectionObserver' in window)){
      // fallback to immediate
      sorted.forEach(t=>{
        if(!impressionSent.current.has(t.id)){
          impressionSent.current.add(t.id);
          analytics.track('dashboard_tile_impression', { id: t.id, locked: !!t.locked, mode, method:'fallback' });
        }
      });
      return;
    }
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const id = (entry.target as HTMLElement).dataset.tileId;
          if(id && !impressionSent.current.has(id)){
            impressionSent.current.add(id);
            const tile = sorted.find(t=> t.id===id);
            analytics.track('dashboard_tile_impression', { id, locked: !!tile?.locked, mode, method:'observer' });
          }
        }
      });
    }, { threshold: 0.4 });
    els.forEach(el=> observer.observe(el));
    return ()=> observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, sorted.map(t=>t.id).join(',')]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" ref={containerRef}>
      {sorted.map(tile => (
        <Link key={tile.id} data-tile-id={tile.id} href={tile.href || '#'} className="block h-full group" onClick={()=> analytics.track('dashboard_tile_click', { id: tile.id, locked: !!tile.locked, mode })}>
          <Card className={`dashboard-card p-5 h-full bg-gradient-to-r ${tile.gradient} relative overflow-hidden ${tile.locked?'opacity-60':''}`}>
            <CardContent className="p-0 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-lg bg-black/20 flex items-center justify-center">
                  {tile.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-white text-sm tracking-wide">{tile.title}</h3>
                    {tile.badge && (<Badge variant="secondary" className="bg-white/10 text-white/90 text-[10px]">{tile.badge}</Badge>)}
                    {tile.locked && <Lock className="w-4 h-4 text-white/60" />}
                  </div>
                  <p className="text-[11px] text-white/70">{tile.description}</p>
                </div>
              </div>
              <div className="flex-1 mb-3">
                {tile.body}
              </div>
              <div>
                {tile.locked ? (
                  <div className="bg-black/30 text-white/70 py-2 px-3 rounded-md text-xs text-center border border-white/10">
                    {tile.lockReason}
                  </div>
                ) : (
                  <Button className="w-full bg-black/30 hover:bg-black/40 border border-white/10 text-white text-xs">Open</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
