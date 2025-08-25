"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Crown, Menu, X, Badge as BadgeIcon, User as UserIcon, LogOut, Settings, Bell, HeartPulse, Loader2, CreditCard, BellOff, Key, Check, Shield } from 'lucide-react';
import { AnalyticsEvents } from '@/lib/analytics/events';
import { BadgeToken } from '@/components/badges/BadgeToken';
import { CheckInModal } from '@/components/dashboard/modals/CheckInModal';
import useSWR from 'swr';
import { toast } from 'sonner';

interface HubUserResponse { user: { bytes: number; streak: number; profileBadgeId?: string | null; tier?: string; username?: string; email?: string }; }
interface BadgeSummary { id: string; name: string; icon: string; unlocked: boolean; rarity?: string; kind?: string; }
const fetcher = (u:string)=> fetch(u).then(r=> r.json());

interface DashboardHeaderProps { userEmail: string; username?: string | null; avatarUrl?: string | null; }

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userEmail, username, avatarUrl }) => {
  const { data, mutate: mutateHub } = useSWR<HubUserResponse>('/api/dashboard/hub', fetcher, { refreshInterval: 60000, focusThrottleInterval: 30000 });
  const { data: badgesData, isLoading: badgesLoading } = useSWR<{ badges: BadgeSummary[] }>('/api/dashboard/badges', fetcher, { dedupingInterval: 60000 });
  const { data: notifSummary, mutate: refreshNotif } = useSWR<{ unread:number; latest:any[] }>('/api/notifications/summary', fetcher, { refreshInterval: 45000 });
  const [open, setOpen] = React.useState(false); // user menu open
  const [mobileNav, setMobileNav] = React.useState(false);
  const [badgePickerOpen, setBadgePickerOpen] = React.useState(false);
  const [portalLoading, setPortalLoading] = React.useState(false);
  const [badgeUpdating, setBadgeUpdating] = React.useState(false);
  const [emailEnabled, setEmailEnabled] = React.useState<boolean|null>(null);
  const [togglingEmail, setTogglingEmail] = React.useState(false);
  const [checkInOpen, setCheckInOpen] = React.useState(false);
  const [mood, setMood] = React.useState<number|undefined>();
  const [notes, setNotes] = React.useState('');
  const [submittingCheckIn, setSubmittingCheckIn] = React.useState(false);
  const router = useRouter();
  const tier = (data?.user.tier || '').toLowerCase();
  const isPremium = tier === 'firewall' || tier === 'premium';
  const showUpgrade = !!data?.user && !isPremium; // avoid flash for premium before data loads
  const initials = (username||userEmail||'?').slice(0,2).toUpperCase();
  // Safely resolve selected profile badge (avoid calling .find on undefined)
  const profileBadge = badgesData?.badges?.find(b => b.id === data?.user.profileBadgeId);
  // Automatic latest badge for non-premium; premium can choose
  const unlockedBadges = (badgesData?.badges||[]).filter(b=> b.unlocked);
  const autoBadge = !isPremium ? unlockedBadges[unlockedBadges.length-1] : undefined;
  const effectiveBadge = isPremium ? profileBadge : autoBadge || profileBadge;
  const unread = notifSummary?.unread || 0;
  const [notifOpen, setNotifOpen] = React.useState(false);
  const notifRef = React.useRef<HTMLDivElement|null>(null);
  const userMenuRef = React.useRef<HTMLDivElement|null>(null);
  const badgePickerRef = React.useRef<HTMLDivElement|null>(null);
  const notifPanelRef = React.useRef<HTMLDivElement|null>(null);
  // Trigger refs for restoring focus
  const notifButtonRef = React.useRef<HTMLButtonElement|null>(null);
  const userMenuButtonRef = React.useRef<HTMLButtonElement|null>(null);
  const badgeTriggerRef = React.useRef<HTMLSpanElement|null>(null);
  const checkInButtonRef = React.useRef<HTMLButtonElement|null>(null);
  const firstNotifRef = React.useRef<HTMLButtonElement|null>(null);
  const firstUserItemRef = React.useRef<HTMLAnchorElement|null>(null);
  const firstBadgeItemRef = React.useRef<HTMLButtonElement|null>(null);
  // Client-side expanded notifications (pagination)
  const [notifItems, setNotifItems] = React.useState<any[]>([]);
  const [loadingMoreNotif, setLoadingMoreNotif] = React.useState(false);
  const [notifCursor, setNotifCursor] = React.useState<string|null>(null);
  const [notifHasMore, setNotifHasMore] = React.useState(false);
  const toggleNotifications = () => { setNotifOpen(o=>!o); };
  const sendEvent = React.useCallback(async (event:string, properties?:Record<string,any>) => { try { await fetch('/api/events',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ event, properties })}); } catch{} }, []);

  const handleNotificationClick = async (n: any) => {
    // Optimistically mark single notification read
    if(!n.read){
      refreshNotif(prev => {
        if(!prev) return prev as any;
        const updated = prev.latest.map(item => item.id === n.id ? { ...item, read:true } : item);
        return { ...prev, latest: updated, unread: Math.max(0, prev.unread - 1) };
      }, { revalidate: false });
      try { await fetch(`/api/notifications/${n.id}/read`, { method:'PATCH' }); } catch {}
      // Revalidate to sync with server (in case of fallback/mock differences)
      refreshNotif();
      sendEvent(AnalyticsEvents.NOTIFICATION_OPENED, { id: n.id, type: n.type });
    }
    if(n.actionUrl){
      if(/^https?:/i.test(n.actionUrl)){
        window.open(n.actionUrl, '_blank');
      } else {
        router.push(n.actionUrl);
        setNotifOpen(false);
      }
    }
  };
  // Load more notifications pagination
  const loadMoreNotifications = async () => {
    if(loadingMoreNotif) return; setLoadingMoreNotif(true);
    try {
      const url = new URL('/api/notifications/list', window.location.origin);
      url.searchParams.set('limit','10');
      if(notifCursor) url.searchParams.set('cursor', notifCursor);
      const r = await fetch(url.toString(), { cache:'no-store' });
      if(r.ok){
        const j = await r.json();
        const list = j.notifications || j.data?.notifications || [];
        setNotifItems(prev => [...prev, ...list]);
        const last = list[list.length-1];
        setNotifCursor(last? last.createdAt || last.created_at : null);
        setNotifHasMore(!!j.nextCursor);
      }
    } finally { setLoadingMoreNotif(false);} 
  };
  // Outside click & Esc close
  React.useEffect(()=>{
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if(notifOpen && notifRef.current && !notifRef.current.contains(t)) setNotifOpen(false);
      if(open && userMenuRef.current && !userMenuRef.current.contains(t)) setOpen(false);
      if(badgePickerOpen && badgePickerRef.current && !badgePickerRef.current.contains(t)) setBadgePickerOpen(false);
    };
    const esc = (e: KeyboardEvent) => { if(e.key==='Escape'){ setNotifOpen(false); setOpen(false); setBadgePickerOpen(false); setCheckInOpen(false);} };
    window.addEventListener('mousedown', handler);
    window.addEventListener('keydown', esc);
    return ()=>{ window.removeEventListener('mousedown', handler); window.removeEventListener('keydown', esc); };
  }, [notifOpen, open, badgePickerOpen]);

  // Preload email preference when user menu first opens
  React.useEffect(()=>{ if(open && emailEnabled===null){ (async()=>{ try{ const r= await fetch('/api/notifications',{cache:'no-store'}); if(r.ok){ const j= await r.json(); setEmailEnabled(!!j?.preferences?.enableEmail); } }catch{} })(); } }, [open, emailEnabled]);
  // Initialize notification list when panel opens
  React.useEffect(()=>{ if(notifOpen){ const base = (notifSummary?.latest||[]); setNotifItems(base); if(base.length>0){ const last = base[base.length-1]; setNotifCursor(last?.createdAt); } setNotifHasMore(false); setTimeout(()=> firstNotifRef.current?.focus(), 0);} }, [notifOpen, notifSummary]);
  React.useEffect(()=>{ if(open){ setTimeout(()=> firstUserItemRef.current?.focus(), 0);} }, [open]);
  React.useEffect(()=>{ if(badgePickerOpen){ setTimeout(()=> firstBadgeItemRef.current?.focus(), 0);} }, [badgePickerOpen]);
  // Return focus to triggering control when panel/dialog closes
  const prevNotifOpen = React.useRef(notifOpen); React.useEffect(()=>{ if(prevNotifOpen.current && !notifOpen){ notifButtonRef.current?.focus(); } prevNotifOpen.current = notifOpen; }, [notifOpen]);
  const prevUserOpen = React.useRef(open); React.useEffect(()=>{ if(prevUserOpen.current && !open){ userMenuButtonRef.current?.focus(); } prevUserOpen.current = open; }, [open]);
  const prevBadgeOpen = React.useRef(badgePickerOpen); React.useEffect(()=>{ if(prevBadgeOpen.current && !badgePickerOpen){ badgeTriggerRef.current?.focus(); } prevBadgeOpen.current = badgePickerOpen; }, [badgePickerOpen]);
  const prevCheckOpen = React.useRef(checkInOpen); React.useEffect(()=>{ if(prevCheckOpen.current && !checkInOpen){ checkInButtonRef.current?.focus(); } prevCheckOpen.current = checkInOpen; }, [checkInOpen]);

  // Generic focus trap handler
  const trapFocus = (e: React.KeyboardEvent, container: HTMLElement|null) => {
    if(!container) return; if(e.key !== 'Tab') return;
    const focusables = Array.from(container.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])')).filter(el=> !el.hasAttribute('disabled'));
    if(focusables.length===0) return;
    const first = focusables[0]; const last = focusables[focusables.length-1];
    if(e.shiftKey){ if(document.activeElement === first){ e.preventDefault(); last.focus(); } }
    else { if(document.activeElement === last){ e.preventDefault(); first.focus(); } }
  };

  const openStripePortal = async () => { try { setPortalLoading(true); const r = await fetch('/api/stripe/portal',{method:'POST'}); if(!r.ok) throw 0; const j= await r.json(); if(j?.url) window.location.href = j.url; } catch { toast.error('Subscription portal unavailable'); } finally { setPortalLoading(false);} };
  const toggleEmailNotifications = async () => { if(togglingEmail) return; try { setTogglingEmail(true); const current = emailEnabled ?? true; const next = !current; setEmailEnabled(next); const r = await fetch('/api/notifications',{method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ preferences:{ enableEmail: next }})}); if(!r.ok){ setEmailEnabled(current); toast.error('Failed updating preference'); } else { toast.success(next? 'Daily email enabled':'Daily email disabled'); } } finally { setTogglingEmail(false);} };
  const setFirewallBadge = async () => { if(badgeUpdating) return; try { setBadgeUpdating(true); const locker = await fetch('/api/badges/locker').then(r=>r.ok?r.json():null); const list = locker?.badges || locker?.data?.badges || []; const fw = list.find((b:any)=> /fire ?wall/i.test(b.name||'')); if(!fw){ toast.error('Firewall badge not unlocked'); return;} const r = await fetch('/api/badges/profile',{method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ badgeId: fw.id })}); if(r.ok){ toast.success('Firewall badge applied'); mutateHub(); } else { toast.error('Failed applying badge'); } } finally { setBadgeUpdating(false);} };
  const applyProfileBadge = async (badgeId: string|null) => { if(!isPremium) return; if(badgeUpdating) return; try { setBadgeUpdating(true); const r = await fetch('/api/badges/profile',{method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ badgeId })}); if(!r.ok){ toast.error('Failed to set badge'); return;} setBadgePickerOpen(false); toast.success(badgeId? 'Profile badge updated':'Badge removed'); mutateHub(); sendEvent(AnalyticsEvents.BADGE_PROFILE_CHANGED, { badgeId }); } finally { setBadgeUpdating(false);} };
  const startFirewallCheckout = async () => { try { const r = await fetch('/api/stripe/checkout',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ tier:'firewall' })}); if(!r.ok){ toast.error('Upgrade failed'); return;} const j= await r.json(); if(j?.url) window.location.href = j.url; else toast.error('Checkout URL missing'); } catch { toast.error('Upgrade failed'); } };
  const logout = async () => { try { await fetch('/api/auth/logout',{method:'POST', credentials:'include'}); } catch{}; try { await fetch('/api/logout',{method:'POST'}); } catch{}; try { localStorage.removeItem('user-email'); } catch{}; window.location.href='/'; };
  const submitCheckIn = async () => { if(submittingCheckIn || mood==null) return; try { setSubmittingCheckIn(true); const r = await fetch('/api/dashboard/checkin',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ mood, notes })}); if(!r.ok){ toast.error('Check-in failed'); return;} setCheckInOpen(false); setMood(undefined); setNotes(''); toast.success('Check-in recorded'); mutateHub(); sendEvent(AnalyticsEvents.CHECKIN_COMPLETED, { mood }); } finally { setSubmittingCheckIn(false);} };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-slate-950/70 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: Brand + Nav */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-1 text-lg sm:text-xl font-extrabold tracking-tight text-white">
            <span>CTRL</span><span className="text-slate-500">+</span><span>ALT</span><span className="text-slate-500">+</span><span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BLOCK</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium">
            <Link href="/wall" className="text-slate-400 hover:text-white transition">Wall</Link>
            <Link href="/ai-therapy" className="text-slate-400 hover:text-white transition">AI Therapy</Link>
            {showUpgrade && (
              <button onClick={startFirewallCheckout} className="text-slate-400 hover:text-white transition">Upgrade</button>
            )}
          </nav>
        </div>
        {/* Center: Quick Actions & Metrics */}
        <div className="hidden lg:flex items-center gap-3 text-[11px]">
          <button ref={checkInButtonRef} onClick={()=> setCheckInOpen(true)} className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800/70 border border-slate-700 text-emerald-300 hover:bg-slate-700">
            <HeartPulse className="w-3 h-3" /> Check‑In
          </button>
          {data ? (
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800/70 border border-slate-700 text-slate-200"><Zap className="w-3 h-3 text-emerald-400" />{data?.user.bytes ?? 0} <span className="text-slate-500 ml-1">Bytes</span></div>
          ) : (
            <div className="w-28 h-6 rounded bg-slate-800/50 border border-slate-700 animate-pulse" aria-busy="true" />
          )}
          {isPremium && (data ? <div className="flex items-center gap-1 px-2 py-1 rounded bg-gradient-to-br from-purple-600/40 to-pink-600/40 border border-purple-500/40 text-purple-200"><Crown className="w-3 h-3" />Premium</div> : <div className="w-20 h-6 rounded bg-slate-800/50 border border-slate-700 animate-pulse" aria-busy="true" />)}
        </div>
        {/* Right: User / Utilities */}
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:inline-flex" ref={notifRef}>
            <button ref={notifButtonRef} onClick={toggleNotifications} aria-label="Notifications" aria-haspopup="menu" aria-expanded={notifOpen} className="relative p-2 rounded-md border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors">
              <Bell className="w-4 h-4" />
              {unread>0 && <span className="absolute -top-1 -right-1 bg-emerald-500 text-[9px] rounded-full px-1 text-white">{unread}</span>}
            </button>
            {notifOpen && (
              <div
                role="menu"
                aria-label="Notifications"
                ref={notifPanelRef}
                onKeyDown={(e)=> trapFocus(e, notifPanelRef.current)}
                className="animate-scaleFade origin-top-right absolute right-0 mt-2 w-96 min-w-[24rem] max-h-[32rem] overflow-auto rounded-md bg-slate-900 border border-slate-700 shadow-xl p-4 flex flex-col gap-3 text-[12px] transition-opacity"
              >
                <div className="flex items-center justify-between sticky top-0 bg-slate-900/95 pb-1">
                  <span className="text-slate-300 font-medium">Notifications</span>
                  <button
                    onClick={()=> {
                      refreshNotif(prev=> prev? { ...prev, latest: prev.latest.map(x=> ({...x, read:true})), unread:0 }:prev, { revalidate:false});
                      setNotifItems(items=> items.map(x=> ({...x, read:true})));
                      fetch('/api/notifications/mark-read',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ids: [] })}).catch(()=>{});
                    }}
                    className="text-[11px] text-slate-400 hover:text-slate-200"
                  >Mark all</button>
                </div>
                {!notifSummary && (
                  <div className="space-y-2" aria-busy="true">
                    {[...Array(3)].map((_,i)=> <div key={i} className="h-10 rounded bg-slate-800/50 animate-pulse" />)}
                  </div>
                )}
                {notifItems.map((n,i) => {
                  const unreadItem = !n.read;
                  return (
                    <button
                      key={n.id}
                      ref={i===0? firstNotifRef: undefined}
                      type="button"
                      onClick={()=> handleNotificationClick(n)}
                      className={`text-left w-full p-2 rounded border transition group focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${unreadItem? 'bg-slate-800/70 border-slate-600 hover:border-slate-400':'bg-slate-800/40 border-slate-700 hover:border-slate-500'} `}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-medium text-slate-200 text-[12px] leading-tight group-hover:text-white">{n.title}</p>
                        {unreadItem && <span className="w-2 h-2 rounded-full bg-emerald-400 mt-0.5" />}
                      </div>
                      <p className="text-slate-400 text-[11px] leading-snug mt-1 line-clamp-3 group-hover:text-slate-300">{n.message}</p>
                      {n.actionUrl && <span className="mt-1 inline-block text-emerald-400 text-[11px] group-hover:underline">{n.actionText || 'Open'}</span>}
                    </button>
                  );
                })}
                {notifItems.length>0 && (
                  <div className="pt-1">
                    <button
                      disabled={loadingMoreNotif || !notifHasMore}
                      onClick={loadMoreNotifications}
                      className="w-full text-center text-[11px] rounded border border-slate-700 px-2 py-1 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {loadingMoreNotif? 'Loading…' : notifHasMore? 'Load more' : 'End'}
                    </button>
                  </div>
                )}
                {notifSummary && notifItems.length===0 && <p className="text-[11px] text-slate-500">No notifications.</p>}
              </div>
            )}
          </div>
          {/* Theme toggle & badges nav removed */}
          <div className="relative" ref={userMenuRef}>
            <button ref={userMenuButtonRef} onClick={()=> { setOpen(o=>!o); if(isPremium) setBadgePickerOpen(false);} } aria-haspopup="menu" aria-expanded={open} aria-controls="user-menu" className="flex items-center gap-2 group">
              {badgesLoading && <span className="hidden md:inline-block w-8 h-8 rounded-md bg-slate-800 border border-slate-700 animate-pulse" />}
              {!badgesLoading && effectiveBadge && (
                <span
                  ref={badgeTriggerRef}
                  tabIndex={isPremium?0:-1}
                  role={isPremium? 'button': undefined}
                  aria-haspopup={isPremium? 'dialog': undefined}
                  aria-expanded={badgePickerOpen}
                  className={`hidden md:inline-flex ${isPremium? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50':'cursor-default'}`}
                  title={isPremium? 'Change profile badge':'Latest unlocked badge'}
                  onClick={(e)=>{ if(!isPremium) return; e.stopPropagation(); setBadgePickerOpen(o=>!o); setOpen(false);} }
                  onKeyDown={(e)=>{ if(!isPremium) return; if(e.key==='Enter' || e.key===' '){ e.preventDefault(); setBadgePickerOpen(o=>!o); setOpen(false);} }}
                ><BadgeToken id={effectiveBadge.id} name={effectiveBadge.name} icon={effectiveBadge.icon||'swap-cycle'} unlocked={true} size="sm" /></span>
              )}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-[11px] font-semibold text-white">
                {avatarUrl ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover rounded-full" /> : initials}
              </div>
              <span className="hidden sm:inline-block text-[12px] text-slate-300 group-hover:text-white max-w-[120px] truncate">{username || userEmail}</span>
            </button>
            {open && (
              <div id="user-menu" role="menu" aria-label="User menu" ref={userMenuRef} onKeyDown={(e)=> trapFocus(e, userMenuRef.current)} className="animate-scaleFade origin-top-right absolute right-0 mt-2 w-80 min-w-[20rem] rounded-md bg-slate-900 border border-slate-700 shadow-xl p-3 flex flex-col text-[12px] gap-1">
                <Link href="/settings" ref={firstUserItemRef} className="flex items-center gap-2 px-2 py-2 rounded hover:bg-slate-800 text-slate-200"><Settings className="w-3 h-3" /> Settings</Link>
                <button onClick={openStripePortal} disabled={portalLoading} className="flex items-center gap-2 px-2 py-2 rounded hover:bg-slate-800 text-slate-200 disabled:opacity-50"><CreditCard className="w-3 h-3" /> {portalLoading ? 'Portal…':'Manage Subscription'}</button>
                <button onClick={toggleEmailNotifications} disabled={togglingEmail} className="flex items-center gap-2 px-2 py-2 rounded hover:bg-slate-800 text-slate-200 disabled:opacity-50">{togglingEmail ? <Loader2 className="w-3 h-3 animate-spin" /> : emailEnabled === false ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />} {emailEnabled === false ? 'Enable Daily Email' : 'Disable Daily Email'}</button>
                <Link href="/change-password" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-slate-800 text-slate-200"><Key className="w-3 h-3" /> Change Password</Link>
                {isPremium && <button onClick={setFirewallBadge} disabled={badgeUpdating} className="flex items-center gap-2 px-2 py-2 rounded hover:bg-slate-800 text-slate-200 disabled:opacity-50">{badgeUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Shield className="w-3 h-3" />} Firewall Badge</button>}
                <Link href="/badges" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-slate-800 text-slate-200"><BadgeIcon className="w-3 h-3" /> Badges</Link>
                <button onClick={logout} className="flex items-center gap-2 px-2 py-2 rounded hover:bg-slate-800 text-slate-200 text-left"><LogOut className="w-3 h-3" /> Logout</button>
              </div>
            )}
            {badgePickerOpen && isPremium && (
              <div ref={badgePickerRef} role="dialog" aria-modal="true" aria-label="Select profile badge" onKeyDown={(e)=> trapFocus(e, badgePickerRef.current)} className="animate-scaleFade origin-top-right absolute right-0 mt-2 w-72 max-h-96 overflow-auto rounded-md bg-slate-900 border border-slate-700 shadow-xl p-2 flex flex-col gap-2 text-[11px]">
                <div className="flex items-center justify-between mb-1"><span className="text-slate-300 font-medium">Select Profile Badge</span><button onClick={()=> setBadgePickerOpen(false)} className="text-slate-500 hover:text-slate-300">✕</button></div>
                {badgesLoading && <p className="text-slate-500">Loading badges…</p>}
                {!badgesLoading && (badgesData?.badges||[]).filter(b=> b.unlocked).length===0 && <p className="text-slate-500">No badges unlocked yet.</p>}
                <div className="grid grid-cols-3 gap-2" role="listbox" aria-label="Unlocked badges">
                  {(badgesData?.badges||[]).filter(b=> b.unlocked).map((b,i) => {
                    const active = b.id === data?.user.profileBadgeId;
                    return (
                      <button ref={i===0? firstBadgeItemRef: undefined} aria-selected={active} role="option" key={b.id} onClick={()=> applyProfileBadge(b.id)} disabled={badgeUpdating} className={`flex flex-col items-center gap-1 rounded border p-2 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${active? 'border-emerald-500 bg-emerald-500/10':'border-slate-700 hover:border-slate-500 bg-slate-800/40'}`}>
                        <BadgeToken id={b.id} name={b.name} icon={b.icon||'star'} unlocked={true} size="sm" />
                        <span className="truncate max-w-[64px]" title={b.name}>{b.name}</span>
                        {active && <Check className="w-3 h-3 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
                <button onClick={()=> applyProfileBadge(null)} disabled={badgeUpdating} className="mt-2 text-left text-xs text-slate-400 hover:text-slate-200">Remove badge</button>
              </div>
            )}
          </div>
          <button onClick={()=> setMobileNav(o=>!o)} aria-label="Toggle navigation" aria-expanded={mobileNav} aria-controls="mobile-nav" className="md:hidden p-2 rounded border border-slate-700 text-slate-300 hover:bg-slate-800">
            {mobileNav ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {/* Mobile nav */}
      <div id="mobile-nav" className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out border-t border-slate-800 bg-slate-950/90 backdrop-blur px-4 ${mobileNav? 'max-h-96 opacity-100 py-3':'max-h-0 opacity-0 py-0'} flex flex-col gap-2 text-[13px]`}> 
        <Link onClick={()=> setMobileNav(false)} href="/wall" className="text-slate-300 hover:text-white">Wall</Link>
        <Link onClick={()=> setMobileNav(false)} href="/ai-therapy" className="text-slate-300 hover:text-white">AI Therapy</Link>
  {showUpgrade && (
          <button onClick={()=> { startFirewallCheckout(); setMobileNav(false);} } className="text-left text-slate-300 hover:text-white">Upgrade</button>
        )}
        <div className="flex items-center gap-2 pt-2">
          <button onClick={()=> { setCheckInOpen(true); setMobileNav(false);} } className="flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded bg-slate-800/70 border border-slate-700 text-emerald-300">Check‑In</button>
        </div>
        <div className="flex items-center gap-3 pt-2 text-[11px]">
          <div className="flex-1 flex items-center gap-1 px-2 py-1 rounded bg-slate-800/70 border border-slate-700 text-slate-200"><Zap className="w-3 h-3 text-emerald-400" />{data?.user.bytes ?? 0}</div>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button onClick={()=> setNotifOpen(o=>!o)} className="flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded bg-slate-800/70 border border-slate-700 text-slate-300">Alerts</button>
        </div>
      </div>
      {/* Enhanced multi-step check-in */}
      {checkInOpen && (
        <CheckInModal onClose={()=> setCheckInOpen(false)} onComplete={()=> setCheckInOpen(false)} />
      )}
    </header>
  );
};
