"use client";
import React from 'react';
import useSWR from 'swr';
import { BadgeToken } from '@/components/badges/BadgeToken';
import { toast } from 'sonner';

interface BadgeSummary { id: string; name: string; icon: string; unlocked: boolean; rarity?: string; kind?: string; }
interface HubUserResponse { user: { profileBadgeId?: string | null; tier?: string; }; }
const fetcher = (u:string)=> fetch(u).then(r=> r.json());

interface BadgeManagerProps { userId: string; }

const BadgeManager: React.FC<BadgeManagerProps> = () => {
  const { data: hub, mutate: mutateHub } = useSWR<HubUserResponse>('/api/dashboard/hub', fetcher);
  const { data: badgesData, isLoading } = useSWR<{ badges: BadgeSummary[] }>('/api/dashboard/badges', fetcher);
  const tier = (hub?.user.tier||'').toLowerCase();
  const isFirewall = tier === 'firewall';
  const unlocked = (badgesData?.badges||[]).filter(b=> b.unlocked);
  const profileBadgeId = hub?.user.profileBadgeId;

  const applyProfileBadge = async (badgeId: string) => {
    if(!isFirewall){ toast.error('Only Firewall users can change profile badge'); return; }
    try {
      const r = await fetch('/api/badges/profile',{ method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ badgeId }) });
      if(!r.ok){ const j= await r.json().catch(()=>({})); toast.error(j.error||'Failed'); return; }
      toast.success('Profile badge updated');
      mutateHub();
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-white mb-2">Badges</h1>
      <p className="text-slate-400 text-sm mb-6">{isFirewall ? 'Select any unlocked badge as your profile badge.' : 'Ghost tier: your latest unlocked badge is shown automatically.'}</p>
      {isLoading && <p className="text-slate-500">Loading badges…</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {unlocked.map(b => {
          const active = b.id === profileBadgeId;
          return (
            <button key={b.id} onClick={()=> applyProfileBadge(b.id)} disabled={!isFirewall} className={`flex flex-col items-center gap-2 border rounded-md p-3 bg-slate-800/50 hover:bg-slate-800 transition relative group ${active? 'border-emerald-500':'border-slate-700'}`}> 
              <BadgeToken id={b.id} name={b.name} icon={b.icon||'star'} unlocked size="md" />
              <span className="text-xs text-slate-200 font-medium truncate w-full" title={b.name}>{b.name}</span>
              {active && <span className="absolute top-1 right-1 text-emerald-400 text-[10px]">Selected</span>}
              {!isFirewall && <span className="absolute inset-0 rounded-md bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[10px] text-slate-300">Ghost tier</span>}
            </button>
          );
        })}
        {unlocked.length===0 && !isLoading && <p className="col-span-full text-slate-500 text-sm">No badges unlocked yet.</p>}
      </div>
    </div>
  );
};

export default BadgeManager;
