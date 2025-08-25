"use client";
import React from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { User } from '@/lib/db/unified-schema';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmailVerificationPrompt } from '@/components/dashboard/EmailVerificationPrompt';
import { Flame, Heart, Shield, MessageCircle, Brain, Crown, Clock, Activity, Sparkles, Check as CheckIcon, MessageSquareHeart, Zap as ZapIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { BytesSparkline } from './BytesSparkline';
import { BadgeToken } from '@/components/badges/BadgeToken';

interface Props { user: User; }

interface HubAPI {
  streaks: { rituals: number; noContact: number; noContactThreat?: boolean; noContactShieldAvailable?: boolean };
  user: { bytes: number; streak: number; totalRituals: number; totalCheckIns: number; totalNoContacts: number; tier?: string; profileBadgeId?: string | null };
  todayActions: { checkIn: boolean; noContact: boolean; ritual: boolean; wallInteract?: boolean; aiChat?: boolean; wallPost?: boolean };
  todaysRituals?: Array<{ id: string; title: string; difficulty?: string; completed?: boolean; duration?: string; category?: string }>;
  ritualMeta?: { canReroll: boolean; mode: 'ghost' | 'firewall'; assignmentId?: number };
  wallPosts?: Array<{ id: string; content: string; reactions?: number; timeAgo?: string }>;
  bytesEconomy?: { today: number; last7d: number; last30d: number; balance: number; series30d: Array<{date:string; earned:number}> };
  badges?: Array<{ id: string; name: string; icon: string; unlocked: boolean; rarity?: string; kind?: string; isProfile?: boolean }>;
  streakHistory?: Array<{ date: string; completed: boolean }>;
  moodToday?: { mood: number; notes?: string | null } | null;
  moodTrends?: { avg7: number | null; avg30: number | null; series30: Array<{date: string; mood: number | null}> };
}

// Ritual endpoint actually returns { ritual: { ... } }
interface RitualShape { id: string; title: string; difficulty?: string; estimatedTime?: number | string; isCompleted?: boolean; completedAt?: string | null; description?: string; }
interface RitualAPI { ritual?: RitualShape }
interface BadgesAPI { badges: Array<{ id: string; name: string; icon: string; unlocked: boolean; rarity?: string; kind?: string; isProfile?: boolean; upgradeLocked?: boolean; hidden?: boolean; progress?: { current:number; target:number; percent:number; hint:string } }>; meta: { total: number; unlocked: number; visible?: number; gated?: number; progressAttached?: boolean; upgradeGated?: boolean; } }
// Progress (optional) is added dynamically by server for locked badges.
interface BadgeWithProgress { id: string; name: string; icon: string; unlocked: boolean; rarity?: string; kind?: string; isProfile?: boolean; progress?: { current:number; target:number; percent:number; hint:string }; upgradeLocked?: boolean; hidden?: boolean; }
interface WallAPI { posts: Array<{ id: string; content: string; glitchCategory?: string; glitchTitle?: string; reactions?: number; createdAt?: string }>; nextCursor?: string | null }

const fetcher = (url: string) => fetch(url).then(r => { if(!r.ok) throw new Error('fetch failed'); return r.json(); });

function useDashboardData() {
  const hub = useSWR<HubAPI>('/api/dashboard/hub', fetcher, { dedupingInterval: 15000 });
  const badgesData = useSWR<BadgesAPI>('/api/dashboard/badges', fetcher, { dedupingInterval: 30000 });
  const wallData = useSWR<WallAPI>('/api/dashboard/wall?limit=6', fetcher, { dedupingInterval: 12000 });
  // AI Therapy usage (message counts)
  const aiUsage = useSWR<{ remaining:number; used:number; cap:number; renewsAt?:string; voiceMinutesUsed?:number; voiceMinutesCap?:number }>(
    '/api/ai-therapy/usage', fetcher, { dedupingInterval: 20000 }
  );
  // Voice credits (active minutes remaining)
  const voiceCredits = useSWR<{ remainingMinutes?:number; minutesRemaining?:number; expiresAt?:string }>(
    '/api/voice-therapy/credits', fetcher, { dedupingInterval: 25000 }
  );
  return { hub, badgesData, wallData, aiUsage, voiceCredits };
}

function timeAgo(iso?: string){
  if(!iso) return '';
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now-then);
  const mins = Math.floor(diff/60000);
  if(mins < 60) return mins+ 'm';
  const hrs = Math.floor(mins/60);
  if(hrs < 24) return hrs+'h';
  const d = Math.floor(hrs/24);
  return d+'d';
}

function metric(label: string, value: number | string, icon: React.ReactNode, extra?: React.ReactNode) {
  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-medium text-slate-400 flex items-center gap-1">{icon}{label}</CardTitle>
      </CardHeader>
      <CardContent>
  <div className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">{value}{extra}</div>
      </CardContent>
    </Card>
  );
}

export function DashboardV2({ user }: Props) {
  const { hub, badgesData, wallData, aiUsage, voiceCredits } = useDashboardData();
  const AITherapyModal = React.useMemo(()=> dynamic(()=>import('./modals/AITherapyModal'), { ssr:false }), []);
  const [aiModalOpen, setAiModalOpen] = React.useState(false);
  const [aiPersona, setAiPersona] = React.useState<string>('supportive-guide');
  const PurchasesModal = React.useMemo(()=> dynamic(()=>import('./modals/AIPurchasesModal').then(m=> m.AIPurchasesModal), { ssr:false }), []);
  const [managePurchasesOpen, setManagePurchasesOpen] = React.useState(false);
  const isLoading = hub.isLoading;
  const ritualList = hub.data?.todaysRituals || [];
  const ritualMeta = (hub.data as any)?.ritualMeta as HubAPI['ritualMeta'];
  const loading = isLoading && !hub.data;

  const difficultyClass = (d?: string) => {
    switch(d){
      case 'easy': return 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30';
      case 'medium': return 'bg-amber-600/20 text-amber-300 border border-amber-500/30';
      case 'hard': return 'bg-rose-600/20 text-rose-300 border border-rose-500/30';
      default: return 'bg-slate-700/40 text-slate-300 border border-slate-600/40';
    }
  };
  const streak = hub.data?.streaks;
  const bytes = hub.data?.bytesEconomy; // will hide box per new spec
  const badges = (badgesData.data?.badges as BadgeWithProgress[]) || [];
  const badgeMeta = (hub.data as any)?.badgeMeta; // legacy meta (now lazy)
  const badgesLoading = badgesData.isLoading && !badgesData.data;
  const badgesMeta = badgesData.data?.meta;
  const streakHistory = hub.data?.streakHistory || [];
  const moodToday = hub.data?.moodToday;
  const moodTrends = (hub.data as any)?.moodTrends as HubAPI['moodTrends'];
  // ritualSwaps removed from UI (spec: remove Swaps box)
  const [checkInModal, setCheckInModal] = React.useState(false);
  const [mood, setMood] = React.useState<number>(moodToday?.mood || 3);
  const [notes, setNotes] = React.useState('');
  const [bytesRange, setBytesRange] = React.useState<'today'|'7d'|'30d'>('today');
  const [noContactModal, setNoContactModal] = React.useState(false);
  const [ritualModalId, setRitualModalId] = React.useState<string|null>(null);
  const [ritualJournal, setRitualJournal] = React.useState('');
  const [ritualMood, setRitualMood] = React.useState(5);
  const [ritualSubmitting, setRitualSubmitting] = React.useState(false);
  const [ritualSeconds, setRitualSeconds] = React.useState(0); // dwell time while modal open

  // Track dwell time for ritual modal
  React.useEffect(()=>{
    if(!ritualModalId) { setRitualSeconds(0); return; }
    let active = true;
    const id = setInterval(()=>{ if(active) setRitualSeconds(s=> s+1); }, 1000);
    return ()=>{ active = false; clearInterval(id); };
  },[ritualModalId]);

  // Load draft when opening ritual modal
  React.useEffect(()=>{
    if(!ritualModalId) return;
    try {
      const key = 'ritual_draft_'+ritualModalId;
      const existing = localStorage.getItem(key);
      if(existing && !ritualJournal){ setRitualJournal(existing); }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ritualModalId]);

  // Autosave draft (debounced)
  React.useEffect(()=>{
    if(!ritualModalId) return;
    const key = 'ritual_draft_'+ritualModalId;
    const handle = setTimeout(()=>{ try { if(ritualJournal) localStorage.setItem(key, ritualJournal); } catch {} }, 700);
    return ()=> clearTimeout(handle);
  },[ritualJournal, ritualModalId]);
  // Helper to optimistically mark a daily action after server mutation
  async function completeDailyAction(endpoint: string, key: keyof HubAPI['todayActions']) {
    try {
      const res = await fetch(endpoint, { method:'POST' });
      if(!res.ok){ const j = await res.json().catch(()=>({})); throw new Error(j.error || 'Failed'); }
      const prev = hub.data; if(prev && !prev.todayActions[key]) {
        hub.mutate({ ...prev, todayActions: { ...prev.todayActions, [key]: true }, user: { ...prev.user, bytes: prev.user.bytes + bytesRewardMap[key] } }, false);
      }
      hub.mutate();
    } catch (e:any) {
      toast.error(e.message || 'Action failed');
    }
  }
  const bytesRewardMap: Record<string, number> = { checkIn:10, noContact:8, ritual:12, wallInteract:3, aiChat:5, wallPost:7 };
  const prevUnlockedRef = React.useRef<Set<string>>(new Set());
  React.useEffect(()=>{
    const currentUnlocked = new Set(badges.filter(b=>b.unlocked).map(b=>b.id));
    prevUnlockedRef.current = currentUnlocked; // capture once initial badges load
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[badges.length>0]);
  const newlyUnlockedIds = React.useMemo(()=>{
    const prev = prevUnlockedRef.current;
    const current = new Set(badges.filter(b=>b.unlocked).map(b=>b.id));
    const newly: string[] = [];
    current.forEach(id=>{ if(!prev.has(id)) newly.push(id); });
    if (newly.length) prevUnlockedRef.current = current; // update after detection
    return new Set(newly);
  },[badges]);

  // Toast for newly unlocked badges
  React.useEffect(()=>{
    if (newlyUnlockedIds.size) {
      const names = badges.filter(b=>newlyUnlockedIds.has(b.id)).map(b=>b.name).slice(0,3);
      const more = newlyUnlockedIds.size > 3 ? ` +${newlyUnlockedIds.size-3} more` : '';
      toast.success(`Badge${newlyUnlockedIds.size>1?'s':''} unlocked: ${names.join(', ')}${more}`);
    }
  },[newlyUnlockedIds, badges]);
  React.useEffect(()=>{ try { const v = localStorage.getItem('hub_bytes_range'); if (v==='today'||v==='7d'||v==='30d') setBytesRange(v); } catch{} },[]);
  React.useEffect(()=>{ try { localStorage.setItem('hub_bytes_range', bytesRange); } catch{} },[bytesRange]);
  const isPremium = (user as any).subscriptionTier === 'premium' || (user as any).tier === 'firewall' || (user as any).tier === 'premium';
  // Deterministic daily encouragement (hydration-safe): hash(user + UTC date) => phrase
  const encouragement = React.useMemo(()=>{
    const phrases = [
      'Progress over perfection—showing up today matters.',
      'Tiny wins stack into transformation.',
      'Every action is a vote for your future self.',
      'Consistency compounds—your resilience is growing.',
      'Healing is not linear—you are still moving forward.',
      'Your future self is thanking you for today\'s effort.',
      'Small regulated actions rewire big emotional patterns.'
    ];
    const id = (user as any).id || user.email || user.username || 'anon';
    const day = new Date().toISOString().slice(0,10); // YYYY-MM-DD (UTC)
    const key = id + '|' + day;
    let h = 0; for (let i=0;i<key.length;i++){ h = (h * 33 + key.charCodeAt(i)) >>> 0; }
    return phrases[h % phrases.length];
  },[user]);

  return (
    <div className="space-y-6">
      {!user.emailVerified && <EmailVerificationPrompt userEmail={user.email} />}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>Healing Hub</span>
            {isPremium ? (
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center gap-1">
                <Crown className="w-3 h-3" /> Firewall
              </Badge>
            ) : (
              <Badge variant="outline" className="text-slate-300 border-slate-600 flex items-center gap-1">
                👻 Ghost
              </Badge>
            )}
          </h1>
          <p className="text-slate-400 text-sm">Welcome back, {user.username || user.email}. {encouragement}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-base px-3 py-1 flex items-center gap-1 border-orange-500/40 text-orange-300" aria-label="Current streak"><Flame className="w-4 h-4" />{hub.data?.user.streak ?? (user as any).streak ?? 0} d</Badge>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-12">
  <div className="md:col-span-8 space-y-6">
          {/* Rituals moved to top of primary column */}
          <Card className="bg-gradient-to-br from-purple-900/40 to-slate-900/60 border-purple-700/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-lg"><Flame className="w-5 h-5 text-orange-400" />{ritualMeta?.mode === 'firewall' ? "Today's Rituals" : "Today's Ritual"}</CardTitle>
              <CardDescription className="text-slate-300">{ritualMeta?.mode === 'firewall' ? 'Two guided interventions' : 'Focused intervention'}{!isPremium && ' • upgrade for a second daily ritual + reroll'}</CardDescription>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="space-y-3">
                  {Array.from({length: ritualMeta?.mode==='firewall'?2:1}).map((_,i)=>(
                    <div key={i} className="h-24 rounded-md bg-slate-800/40 border border-slate-700/40 animate-pulse" />
                  ))}
                </div>
              )}
              {hub.error && <p className="text-sm text-red-400">Failed to load rituals.</p>}
              {ritualList.length > 0 && (
                <div className="space-y-5">
                  {ritualList.map(r => {
                    const completed = !!r.completed;
                    return (
                      <div key={r.id} className="border border-slate-700/60 rounded-md p-4 bg-slate-800/40">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-white text-sm md:text-base">{r.title}</h3>
                              {completed && <Badge className="bg-emerald-600/50 text-emerald-200">Done</Badge>}
                            </div>
                            <div className="flex flex-wrap gap-3 text-[11px] text-slate-400">
                              {r.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.duration}</span>}
                              {r.difficulty && <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${difficultyClass(r.difficulty)}`}>{r.difficulty}</span>}
                              {r.category && <span className="px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-300">{r.category.replace('-', ' ')}</span>}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            <Button size="sm" disabled={completed} onClick={()=>{ setRitualModalId(r.id); }} className="bg-purple-600 hover:bg-purple-700 min-w-[110px]">{completed ? 'Completed' : 'Start'}</Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {ritualMeta?.mode === 'firewall' && ritualMeta?.canReroll && (
                    <div className="flex items-center gap-3 pt-2">
                      <Button variant="outline" size="sm" onClick={async ()=>{
                        try {
                          const res = await fetch('/api/daily-rituals/reroll',{method:'POST'});
                          if(!res.ok){ const j= await res.json().catch(()=>({})); toast.error(j.error||'Reroll failed'); return; }
                          toast.success('Rituals rerolled');
                          hub.mutate();
                        } catch { toast.error('Network error'); }
                      }} className="border-slate-600 text-slate-200 hover:bg-slate-800">Reroll</Button>
                      <span className="text-[11px] text-slate-500">One reroll per day before completing</span>
                    </div>
                  )}
                  {ritualMeta?.mode === 'firewall' && !ritualMeta?.canReroll && (
                    <p className="pt-1 text-[11px] text-slate-500">Reroll used or a ritual completed – new set tomorrow.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          {/* (Removed old Daily Actions card replaced above) */}


          {/* AI Therapy / Support (tier-aware) */}
          <Card className="bg-slate-900/80 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-lg"><Brain className="w-5 h-5 text-indigo-400" />AI Therapy</CardTitle>
              <CardDescription className="text-slate-400">
                {isPremium ? 'Unlimited chat (Fair Use). Add optional voice sessions.' : 'Unlock regulated AI chat therapy access'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {!isPremium ? (
                    <div className="space-y-4">
                    <div className="rounded-md border border-indigo-700/40 bg-indigo-900/20 p-4 space-y-3">
                    <p className="text-xs text-slate-300 leading-relaxed">Chat with 3 trained AI personas for 30 days (300 total messages: inputs + replies). Choose bytes or card purchase.</p>
                    {aiUsage.data && <p className="text-[10px] text-indigo-300">Remaining messages: {aiUsage.data.remaining}/{aiUsage.data.cap}{aiUsage.data.renewsAt && ` • renews ${aiUsage.data.renewsAt}`}</p>}
                    {aiUsage.data && aiUsage.data.cap && aiUsage.data.cap>0 && (aiUsage.data.remaining/aiUsage.data.cap) < 0.1 && (
                      <p className="text-[10px] text-amber-400">Low balance – consider redeeming or purchasing more.</p>
                    )}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Button onClick={()=>{window.location.href='/api/stripe/ai-therapy/purchase';}} className="bg-indigo-600 hover:bg-indigo-700 text-sm">Unlock $3.99</Button>
                      <Button variant="outline" disabled={(hub.data?.user.bytes||0) < 600} onClick={()=>{window.location.href='/ai-therapy/redeem?bytes=600';}} className="border-indigo-500 text-indigo-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed">Redeem 600 Bytes</Button>
                      <button onClick={()=> setManagePurchasesOpen(true)} className="text-[10px] text-indigo-400 hover:underline">Manage / Usage</button>
                      <button onClick={()=> setManagePurchasesOpen(true)} className="text-[10px] text-indigo-400 hover:underline">View Usage</button>
                    </div>
                    {(hub.data?.user.bytes||0) < 600 && <p className="text-[10px] text-slate-500">Need {(600-(hub.data?.user.bytes||0))} more bytes for redemption.</p>}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">Personas Included</p>
                    <ul className="text-[11px] text-slate-300 grid sm:grid-cols-3 gap-2">
                      <li className="bg-slate-800/50 rounded px-2 py-1">⚕️ Grounded Therapist</li>
                      <li className="bg-slate-800/50 rounded px-2 py-1">🔥 Tough-Love Coach</li>
                      <li className="bg-slate-800/50 rounded px-2 py-1">🌿 Nervous System Guide</li>
                    </ul>
                  </div>
                  <div className="rounded-md border border-purple-700/40 bg-purple-900/10 p-4 space-y-2">
                    <p className="text-xs text-slate-300">Voice AI Therapy (15 min real-time) is Firewall only.</p>
                    <Button onClick={()=>{window.location.href='/pricing#firewall';}} variant="outline" className="w-full border-purple-600 text-purple-300 text-sm">Upgrade for Voice & Unlimited Chat</Button>
                  </div>
                </div>
              ) : (
        <div className="space-y-5">
                  <div className="rounded-md border border-indigo-700/40 bg-indigo-900/20 p-4 space-y-3">
                    <p className="text-xs text-slate-300 leading-relaxed">Unlimited (fair use) chat with all therapy personas. Your streak & context persist across sessions.</p>
          {aiUsage.data && <p className="text-[10px] text-indigo-300">Messages today: {aiUsage.data.used}{aiUsage.data.cap? ` (soft cap ${aiUsage.data.cap})`:''}</p>}
          {aiUsage.data?.cap && aiUsage.data.used/Math.max(1,aiUsage.data.cap) >= 0.8 && (
            <p className="text-[10px] text-amber-400">Approaching fair‑use limit – heavy usage may reduce model quality.</p>
          )}
                    <div className="grid grid-cols-3 gap-2 text-[11px]">
                      <button onClick={()=>{ setAiPersona('supportive-guide'); setAiModalOpen(true); }} className="px-2 py-1 rounded bg-slate-800/60 text-indigo-300 hover:bg-slate-700/60 transition">⚕️ Supportive Guide</button>
                      <button onClick={()=>{ setAiPersona('strategic-analyst'); setAiModalOpen(true); }} className="px-2 py-1 rounded bg-slate-800/60 text-indigo-300 hover:bg-slate-700/60 transition">🧠 Strategic Analyst</button>
                      <button onClick={()=>{ setAiPersona('emotional-healer'); setAiModalOpen(true); }} className="px-2 py-1 rounded bg-slate-800/60 text-indigo-300 hover:bg-slate-700/60 transition">✨ Emotional Healer</button>
                    </div>
                  </div>
                  <div className="rounded-md border border-fuchsia-700/40 bg-fuchsia-900/10 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-300">Voice AI Therapy (15 min blocks)</p>
                      <span className="text-[10px] text-fuchsia-300">Add-on</span>
                    </div>
          {voiceCredits.data && <p className="text-[10px] text-fuchsia-300">Minutes remaining: {voiceCredits.data.minutesRemaining ?? voiceCredits.data.remainingMinutes}{voiceCredits.data.expiresAt && ` • expires ${voiceCredits.data.expiresAt}`}</p>}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Button onClick={()=>{window.location.href='/api/stripe/voice-therapy';}} className="bg-fuchsia-600 hover:bg-fuchsia-700 text-sm">Buy $9.99 / 15m</Button>
                      <Button variant="outline" disabled={(hub.data?.user.bytes||0) < 2500} onClick={()=>{window.location.href='/voice-therapy/redeem?bytes=2500';}} className="border-fuchsia-500 text-fuchsia-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed">Redeem 2500 Bytes</Button>
                    </div>
                    {(hub.data?.user.bytes||0) < 2500 && <p className="text-[10px] text-slate-500">Need {(2500-(hub.data?.user.bytes||0))} more bytes.</p>}
                    <p className="text-[10px] text-slate-500">Fair Usage: voice sessions expire 30 days after activation.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Wall of Wounds (moved from sidebar, renamed) */}
          <Card className="bg-slate-900/80 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-lg"><MessageCircle className="w-5 h-5 text-pink-400" />The Wall of Wounds</CardTitle>
              <CardDescription className="text-slate-400">Latest anonymous fragments</CardDescription>
            </CardHeader>
            <CardContent>
              {wallData.isLoading && !wallData.data && <div className="space-y-2">{Array.from({length:4}).map((_,i)=><div key={i} className="h-12 rounded bg-slate-800/40 animate-pulse" />)}</div>}
              {wallData.data && (
                <div className="relative">
                  <ul className="max-h-72 overflow-y-auto pr-1 space-y-3 auto-scroll-wall">
                    {wallData.data.posts.slice(0,20).map(p => {
                      const cat = ((p as any).glitchCategory || 'raw') as 'raw'|'vent'|'reframe'|'win'|'urge';
                      const colorMap: Record<typeof cat,string> = {
                        raw:'border-pink-500/40 bg-pink-900/10',
                        vent:'border-red-500/40 bg-red-900/10',
                        reframe:'border-emerald-500/40 bg-emerald-900/10',
                        win:'border-amber-500/40 bg-amber-900/10',
                        urge:'border-purple-500/40 bg-purple-900/10'
                      };
                      const color = colorMap[cat] || 'border-slate-600/50 bg-slate-800/30';
                      return (
                        <li key={p.id} className={`rounded-md p-3 text-sm leading-relaxed text-slate-200 border ${color}`}>
                          <div className="flex items-start justify-between gap-3">
                            <p className="flex-1 whitespace-pre-line break-words">{p.content}</p>
                            <span className="text-[10px] text-slate-500 shrink-0">{timeAgo(p.createdAt)}</span>
                          </div>
                          <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{p.reactions ?? 0}</span>
                            <span className="uppercase tracking-wide text-[9px] px-1.5 py-0.5 rounded bg-slate-900/40 border border-slate-700/40">{cat}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <Button size="sm" variant="outline" className="w-full mt-4 border-slate-600 text-slate-200" onClick={()=>{window.location.href='/wall';}}>Open Full Wall</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar (now includes Daily Actions) */}
        <div className="md:col-span-4 space-y-6">
          {/* Today's Actions moved to sidebar */}
          <Card className="bg-slate-900/80 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-sm sm:text-base"><Activity className="w-5 h-5 text-emerald-400" />Today's Actions
                <TooltipProvider>
                  <Tooltip delayDuration={150}>
                    <TooltipTrigger asChild>
                      <button type="button" aria-label="Daily actions info" className="ml-1 text-[10px] leading-none text-emerald-400/80 cursor-help border border-emerald-500/30 px-1 py-0.5 rounded hover:text-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-500">?</button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      Complete each unique action once per day for the listed byte reward. Resets at 00:00 UTC.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">Maintain momentum daily</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  disabled={(hub.data?.todayActions as any)?.checkIn}
                  onClick={()=> setCheckInModal(true)}
                  className={`group relative overflow-hidden rounded-md border p-3 text-left transition bg-slate-800/60 border-slate-700 hover:bg-slate-700/60 ${(hub.data?.todayActions as any)?.checkIn ? 'opacity-60 cursor-not-allowed':''}`}
                >
                  <div className="flex items-center gap-1.5 mb-1"><Heart className="w-4 h-4 text-pink-400" /><span className="font-medium text-[11px] text-slate-200">Check‑In</span></div>
                  <div className="text-[10px] text-slate-500">{(hub.data?.todayActions as any)?.checkIn ? 'Done' : 'Log mood'}</div>
                </button>
                <button
                  disabled={(hub.data?.todayActions as any)?.noContact}
                  onClick={()=> setNoContactModal(true)}
                  className={`group relative overflow-hidden rounded-md border p-3 text-left transition bg-slate-800/60 border-slate-700 hover:bg-slate-700/60 ${(hub.data?.todayActions as any)?.noContact ? 'opacity-60 cursor-not-allowed':''}`}
                >
                  <div className="flex items-center gap-1.5 mb-1"><Shield className="w-4 h-4 text-blue-400" /><span className="font-medium text-[11px] text-slate-200">No‑Contact</span></div>
                  <div className="text-[10px] text-slate-500">{(hub.data?.todayActions as any)?.noContact ? 'Logged' : 'Log day'}</div>
                </button>
              </div>
              <div className="space-y-2">
                {[
                  { key:'checkIn', label:'Daily Check‑in', bytes:'+10', done: hub.data?.todayActions.checkIn, endpoint:'/api/dashboard/checkin' },
                  { key:'noContact', label:'No‑contact streak', bytes:'+8', done: hub.data?.todayActions.noContact, endpoint:'/api/dashboard/noContact' },
                  { key:'ritual', label:'Daily Ritual(s)', bytes:'+12', done: hub.data?.todayActions.ritual, endpoint:'/api/dashboard/ritual' },
                  { key:'wallInteract', label:'Interact on Wall', bytes:'+3', done: hub.data?.todayActions.wallInteract, endpoint:'/api/dashboard/wallInteract' },
                  { key:'aiChat', label:'AI Therapy chat', bytes:'+5', done: hub.data?.todayActions.aiChat, endpoint:'/api/dashboard/aiChat', premium:true },
                  { key:'wallPost', label:'Post on Wall', bytes:'+7', done: hub.data?.todayActions.wallPost, endpoint:'/api/dashboard/wallPost', premium:true },
                ].filter(item => !item.premium || isPremium).map(item => (
                  <button key={item.key}
                    onClick={()=>{ if(!item.done) completeDailyAction(item.endpoint, item.key as any); }}
                    disabled={item.done}
                    className={`w-full flex items-center justify-between gap-2 text-[11px] p-1.5 rounded border transition ${item.done? 'bg-slate-800/20 border-slate-700/40 cursor-not-allowed opacity-60':'bg-slate-800/40 border-slate-700/60 hover:bg-slate-700/50'}`}
                    aria-pressed={item.done}
                  >
                    <div className="flex items-center gap-1.5 text-left">
                      <span className={`w-4 h-4 inline-flex items-center justify-center rounded ${item.done? 'bg-emerald-600/30 border border-emerald-500/50':'bg-slate-700/60 border border-slate-600/60'}`}>{item.done? <CheckIcon className="w-3 h-3 text-emerald-400" /> : ''}</span>
                      <span className={item.done? 'text-slate-300 line-through decoration-slate-500/70':'text-slate-300'}>{item.label}</span>
                      {item.premium && !isPremium && <span className="text-[9px] text-purple-400">Premium</span>}
                    </div>
                    <span className="text-[9px] text-emerald-400 font-medium flex items-center gap-0.5" title="Bytes reward"><ZapIcon className="w-3 h-3" />{item.bytes}</span>
                  </button>
                ))}
                <p className="text-[9px] text-slate-500 pt-1">Resets 00:00 UTC.</p>
              </div>
            </CardContent>
          </Card>
          {/* Badges Preview */}
          <Card className="bg-slate-900/80 border-slate-700">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between w-full">
                <div>
                  <CardTitle className="text-sm text-white">Badges</CardTitle>
                  <CardDescription className="text-slate-400">
                    {badgesMeta ? `${badgesMeta.unlocked}/${badgesMeta.total} unlocked (${Math.round(badgesMeta.unlocked/Math.max(1,badgesMeta.total)*100)}%)` : badgesLoading ? 'Loading…' : `${badges.filter(b=>b.unlocked).length}/${badges.length} unlocked`}
                    {badgesMeta && (badgesMeta.gated||0)>0 && <span className="ml-1 text-[10px] text-purple-300">• {badgesMeta.visible} visible / {badgesMeta.gated} gated</span>}
                  </CardDescription>
                </div>
                <a href="/badges" className="text-[11px] text-emerald-400 hover:underline">View All</a>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {badgesLoading && !badges.length && Array.from({length:8}).map((_,i)=>(
                  <div key={i} className="w-10 h-10 rounded-md bg-slate-800/50 border border-slate-700/50 animate-pulse" />
                ))}
                {badges.slice(0,8).map(b => {
                  const isProfile = (hub.data as any)?.user?.profileBadgeId === b.id || (b as any).isProfile;
                  const pulse = newlyUnlockedIds.has(b.id);
                  return (
                    <div key={b.id} className="relative group">
                      <BadgeToken
                        id={b.id}
                        name={b.name}
                        icon={(b as any).icon || 'swap-cycle'}
                        rarity={b.rarity}
                        kind={b.kind}
                        unlocked={b.unlocked}
                        profile={isProfile}
                        pulse={pulse}
                        upgradeLocked={b.upgradeLocked}
                        hidden={b.hidden}
                        onSelect={async ()=>{
                          if (!isPremium) return;
                          if (!b.unlocked) return;
                          try {
                            const res = await fetch('/api/badges/profile',{method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ badgeId: b.id })});
                            if(res.ok){
                              toast.success('Profile badge updated');
                              const prev = hub.data; if(prev){ hub.mutate({ ...prev, user: { ...prev.user, profileBadgeId: b.id }, badges: prev.badges?.map(x=> x.id===b.id ? { ...x, isProfile: true } : { ...x, isProfile: false }) }, false); }
                            } else { toast.error('Update failed'); }
                          } catch { toast.error('Network error'); }
                        }}
                      />
                      {!b.upgradeLocked && !b.unlocked && b.progress && (
                        <div className="absolute -bottom-1 left-0 w-full px-0.5">
                          <div className="h-1 w-full rounded bg-slate-800 overflow-hidden">
                            <div className="h-full bg-emerald-500/80" style={{width: `${b.progress.percent}%`}} />
                          </div>
                          <div className="absolute inset-x-0 -top-6 hidden group-hover:block">
                            <div className="rounded bg-slate-900/90 border border-slate-700 px-2 py-1 text-[10px] text-slate-300 shadow">{b.progress.hint}</div>
                          </div>
                        </div>
                      )}
                      {b.upgradeLocked && (
                        <div className="absolute -bottom-1 left-0 w-full px-0.5">
                          <div className="h-1 w-full rounded bg-slate-800 overflow-hidden">
                            <div className="h-full bg-purple-600/70" style={{width: '100%'}} />
                          </div>
                          <div className="absolute inset-x-0 -top-6 hidden group-hover:block">
                            <div className="rounded bg-slate-900/90 border border-slate-700 px-2 py-1 text-[10px] text-purple-300 shadow">Upgrade to reveal progress</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {!badgesLoading && !badges.length && <p className="text-xs text-slate-500">No badges yet.</p>}
              </div>
              <div className="mt-3 h-2 w-full rounded bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{width: `${badgesMeta? (badgesMeta.unlocked/Math.max(1,badgesMeta.total)*100) : badges.length? (badges.filter(b=>b.unlocked).length / badges.length * 100):0}%`}} />
              </div>
              {badgeMeta?.ghostCapReached && <p className="mt-2 text-[11px] text-amber-400">Ghost cap reached – upgrade to collect rare & legendary badges.</p>}
            </CardContent>
          </Card>

          {/* Removed Last 14 Days heatmap per spec */}
          <div className="grid grid-cols-3 gap-3">
            {metric('Check‑Ins', hub.data?.user.totalCheckIns ?? 0, <Heart className="w-3 h-3 text-pink-400" />)}
            {metric('No‑Contact', hub.data?.user.totalNoContacts ?? 0, <Shield className="w-3 h-3 text-blue-400" />, streak?.noContactThreat ? <span className="text-[10px] text-red-400 font-medium">THREAT</span> : streak?.noContactShieldAvailable ? <span className="text-[10px] text-emerald-400">SHIELD</span> : null)}
            {metric('Rituals', hub.data?.user.totalRituals ?? 0, <Flame className="w-3 h-3 text-orange-400" />)}
            {/* Swaps metric removed */}
          </div>
          {streak?.noContactThreat && <p className="text-xs text-red-400">No‑Contact streak threatened – check in soon to protect it.</p>}
          {!streak?.noContactThreat && streak?.noContactShieldAvailable && <p className="text-xs text-emerald-400">Shield window active – a check‑in now secures streak.</p>}
          {/* Post Creation Box (for Firewall users only) */}
          <Card className="bg-slate-900/80 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white">Post on the Wall of Wounds</CardTitle>
              <CardDescription className="text-slate-400 text-xs">Share an anonymous fragment. Auto-moderated.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isPremium ? (
                <form id="wallPostForm" className="space-y-3" onSubmit={async e=>{
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget as HTMLFormElement);
                  const content = (fd.get('content') as string || '').trim();
                  const category = fd.get('category') as string || 'raw';
                  if(!content){ toast.error('Write something first'); return; }
                  try {
                    const res = await fetch('/api/wall/post', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ content, category }) });
                    const j = await res.json().catch(()=>({}));
                    if(!res.ok){ toast.error(j.error||'Failed'); return; }
                    toast.success(j.moderated? 'Submitted for moderation' : 'Posted');
                    (e.currentTarget as HTMLFormElement).reset();
                    completeDailyAction('/api/dashboard/wallPost','wallPost' as any);
                    wallData.mutate();
                  } catch { toast.error('Network issue'); }
                }}>
                  <textarea name="content" maxLength={500} placeholder="Your glitch, grief, or spite..." className="w-full h-24 text-xs rounded border border-slate-700 bg-slate-800 p-2 text-slate-200 resize-none" />
                  <div className="flex items-center gap-2 text-[11px]">
                    <select name="category" className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-300 focus:outline-none">
                      <option value="raw">Raw</option>
                      <option value="vent">Vent</option>
                      <option value="reframe">Reframe</option>
                      <option value="win">Micro‑Win</option>
                      <option value="urge">Urge</option>
                    </select>
                    <Button type="submit" size="sm" className="ml-auto bg-pink-600 hover:bg-pink-700">Publish</Button>
                  </div>
                  <p className="text-[10px] text-slate-500">Auto-filter blocks harmful content. Anonymous – keep it humane.</p>
                </form>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">Upgrade to Firewall to post on the Wall of Wounds.</p>
                  <Button onClick={()=>{window.location.href='/pricing#firewall';}} size="sm" className="bg-pink-600 hover:bg-pink-700 w-full">Upgrade</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  {isLoading && <p className="text-xs text-slate-500">Loading dashboard data…</p>}
  {!isLoading && !hub.data && <p className="text-xs text-red-400">Failed to load hub data.</p>}
  {checkInModal && (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-700 bg-slate-900 p-5 space-y-4">
        <h2 className="text-white font-semibold text-lg">Daily Check‑In</h2>
        <p className="text-xs text-slate-400">How are you feeling today?</p>
        <div className="flex justify-between gap-1">
          {[1,2,3,4,5].map(m => <button key={m} onClick={()=>setMood(m)} className={`flex-1 py-2 rounded text-lg ${mood===m?'bg-emerald-600 text-white':'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{['😞','😕','😐','🙂','😄'][m-1]}</button>)}
        </div>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} maxLength={500} placeholder="Optional notes (private)" className="w-full h-24 text-sm rounded border border-slate-700 bg-slate-800 p-2 text-slate-200 resize-none" />
        <div className="flex justify-end gap-2">
          <Button variant="outline" className="border-slate-600" onClick={()=>{ setCheckInModal(false); }}>Cancel</Button>
          <Button onClick={async ()=>{
            try {
              const res = await fetch('/api/dashboard/checkin', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ mood, notes }) });
              if (!res.ok) throw new Error();
              toast.success('Check‑In saved');
              const prev = hub.data;
              hub.mutate(prev ? { ...prev, todayActions: { ...prev.todayActions, checkIn: true }, moodToday: { mood, notes } } : prev, false);
              setCheckInModal(false);
            } catch { toast.error('Failed to save'); } finally { hub.mutate(); }
          }} className="bg-emerald-600 hover:bg-emerald-700">Save</Button>
        </div>
        {moodToday && <p className="text-[11px] text-slate-500">Already logged mood {moodToday.mood} today.</p>}
      </div>
    </div>
  )}
  {noContactModal && (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-700 bg-slate-900 p-5 space-y-4">
        <h2 className="text-white font-semibold text-lg flex items-center gap-2"><Shield className="w-5 h-5 text-blue-400" />No‑Contact Log</h2>
        <p className="text-xs text-slate-400">Confirm you maintained no contact today. This protects your streak.</p>
        <div className="rounded-md bg-slate-800/60 border border-slate-700 p-3 text-xs text-slate-300 space-y-2">
          <p>Current streak: <span className="font-semibold text-white">{hub.data?.streaks?.noContact ?? 0} days</span></p>
          {streak?.noContactThreat && <p className="text-amber-400">Threat detected – logging now secures it.</p>}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" className="border-slate-600" onClick={()=> setNoContactModal(false)}>Cancel</Button>
          <Button onClick={async ()=>{
            try {
              const prev = hub.data;
              hub.mutate(prev ? { ...prev, todayActions: { ...prev.todayActions, noContact:true }, streaks: { ...(prev?.streaks||{}), noContact: (prev?.streaks?.noContact||0)+1 } } : prev, false);
              const res = await fetch('/api/dashboard/noContact',{method:'POST'});
              if(!res.ok) throw 0;
              toast.success('No‑Contact logged');
              setNoContactModal(false);
            } catch { toast.error('Failed to log'); hub.mutate(); } finally { hub.mutate(); }
          }} className="bg-blue-600 hover:bg-blue-700">Log Day</Button>
        </div>
      </div>
    </div>
  )}
  {ritualModalId && (()=>{ const r = ritualList.find(x=>x.id===ritualModalId); if(!r) return null; const ghostMode = ritualMeta?.mode==='ghost';
    const wordCount = ritualJournal.trim().split(/\s+/).filter(Boolean).length;
    const charCount = ritualJournal.trim().length;
    const minWords = 25; const minChars = 150; const minSeconds = 45;
    const wordsOk = wordCount >= minWords;
    const charsOk = charCount >= minChars;
    const secondsOk = ritualSeconds >= minSeconds;
    const disableSubmit = ritualSubmitting || !wordsOk || !charsOk || !secondsOk;
    return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-lg border border-slate-700 bg-slate-900 p-5 space-y-5 relative">
        <h2 className="text-white font-semibold text-lg flex items-center gap-2"><Flame className="w-5 h-5 text-orange-400" />{r.title}</h2>
        <p className="text-xs text-slate-400">Follow the ritual then journal your reflection. Draft autosaves locally.</p>
        <div className="space-y-2">
          <label className="text-[11px] uppercase tracking-wide text-slate-400">Reflection Journal</label>
          <textarea value={ritualJournal} onChange={e=>setRitualJournal(e.target.value)} maxLength={1500} className="w-full h-40 text-sm rounded border border-slate-700 bg-slate-800 p-2 text-slate-200 resize-none" placeholder="What did you notice, feel, release?" />
          <div className="flex justify-between text-[10px] text-slate-500"><span>{wordCount} words • {charCount} chars</span><span>Dwell {ritualSeconds}s</span></div>
          <ul className="text-[10px] space-y-1 mt-2">
            <li className={wordsOk? 'text-emerald-400':'text-slate-500'}>{wordsOk? '✔':'•'} {minWords}+ words</li>
            <li className={charsOk? 'text-emerald-400':'text-slate-500'}>{charsOk? '✔':'•'} {minChars}+ characters</li>
            <li className={secondsOk? 'text-emerald-400':'text-slate-500'}>{secondsOk? '✔':'•'} {minSeconds}+ seconds reflecting</li>
          </ul>
        </div>
        <div className="space-y-2">
          <label className="text-[11px] uppercase tracking-wide text-slate-400">Mood After</label>
          <div className="flex gap-1">{[1,2,3,4,5].map(m => <button key={m} onClick={()=>setRitualMood(m)} className={`flex-1 py-2 rounded text-lg ${ritualMood===m?'bg-purple-600 text-white':'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{['😞','😕','😐','🙂','😄'][m-1]}</button>)}</div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" className="border-slate-600" onClick={()=>{ setRitualModalId(null); setRitualJournal(''); }}>Close</Button>
          <Button disabled={disableSubmit} onClick={async ()=>{
            setRitualSubmitting(true);
            try {
              if (ghostMode) {
                const res = await fetch('/api/daily-rituals/complete-ghost',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ritualId: r.id })});
                if(!res.ok){ const j= await res.json().catch(()=>({})); throw new Error(j.error||'Complete failed'); }
              } else {
                const assignmentId = ritualMeta?.assignmentId; if(!assignmentId) throw new Error('Missing assignment');
                const res = await fetch('/api/daily-rituals/complete',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ assignmentId, ritualId: r.id, journalText: ritualJournal, moodRating: ritualMood, dwellTimeSeconds: ritualSeconds })});
                const j = await res.json(); if(!res.ok) throw new Error(j.error||'Complete failed');
              }
              toast.success('Ritual completed');
              try { localStorage.removeItem('ritual_draft_'+r.id); } catch {}
              const prev = hub.data; if(prev){
                hub.mutate({ ...prev, todayActions: { ...prev.todayActions, ritual: true }, todaysRituals: prev.todaysRituals?.map(x=> x.id===r.id? { ...x, completed: true }: x) }, false);
              }
              hub.mutate();
              setRitualModalId(null); setRitualJournal('');
            } catch(e:any){ toast.error(e.message||'Failed'); } finally { setRitualSubmitting(false); }
          }} className="bg-emerald-600 hover:bg-emerald-700">{ritualSubmitting? 'Saving...' : disableSubmit? 'Complete Ritual' : 'Complete Ritual'}</Button>
        </div>
      </div>
    </div>
  ); })()}
  {aiModalOpen && (
    <AITherapyModal
      selectedPersona={aiPersona}
      onClose={()=> setAiModalOpen(false)}
      onFirstUserMessage={()=>{ completeDailyAction('/api/dashboard/aiChat','aiChat' as any); aiUsage.mutate(); }}
    />
  )}
  {managePurchasesOpen && (
    <PurchasesModal open={managePurchasesOpen} onClose={()=> setManagePurchasesOpen(false)} />
  )}
    </div>
  );
}

export default DashboardV2;
