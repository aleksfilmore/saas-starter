"use client";
import React from 'react';
import { cn } from '@/lib/utils';

// Minimal internal icon library (cringe cyber motifs)
// Using pure SVG so no external asset dependency.
const ICONS: Record<string, React.ReactNode> = {
  'swap-cycle': (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path stroke="currentColor" strokeWidth="1.5" fill="none" d="M7 7h11l-3.2-3.2M17 17H6l3.2 3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  'dna-helix': (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path stroke="currentColor" strokeWidth="1" fill="none" d="M7 3c5 4 5 14 10 18M17 3c-5 4-5 14-10 18M8 7h8M8 11h8M8 15h8" strokeLinecap="round" />
    </svg>
  ),
  'flame-small': (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path d="M12 3c1 3 4 4 4 7a4 4 0 0 1-8 0c0-1 0-2 1-4l1 2 2-5Z" fill="currentColor" className="opacity-80" />
      <path d="M12 12.5c.6.9-.4 2-1.3 1.4-.7-.5-.3-1.5.5-1.8" stroke="#fff" strokeWidth="0.5" />
    </svg>
  ),
  'flame-core': (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path d="M12 2c2 4 6 5 6 10a6 6 0 0 1-12 0c0-2 0-3 2-6l1 3 3-7Z" fill="currentColor" />
      <circle cx="12" cy="13" r="2.3" fill="#fff" className="opacity-80" />
    </svg>
  ),
  'pulse-node': (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <path d="M3 12h5l2-5 3 10 2-5h6" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  'bandwidth-max': (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <rect x="4" y="14" width="3" height="6" rx="1" fill="currentColor" />
      <rect x="9" y="10" width="3" height="10" rx="1" fill="currentColor" />
      <rect x="14" y="6" width="3" height="14" rx="1" fill="currentColor" />
      <rect x="19" y="3" width="2" height="17" rx="1" fill="currentColor" />
    </svg>
  )
};

const RARITY_STYLES: Record<string,string> = {
  common: 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600 text-slate-200',
  uncommon: 'bg-gradient-to-br from-emerald-700/40 to-teal-800/40 ring-1 ring-emerald-500/40 text-emerald-200',
  rare: 'bg-gradient-to-br from-indigo-700/40 to-violet-800/40 ring-1 ring-violet-500/50 text-indigo-200 shadow-inner',
  epic: 'bg-gradient-to-br from-fuchsia-700/40 to-orange-600/40 ring-2 ring-fuchsia-400/60 text-fuchsia-200 shadow',
  legendary: 'bg-gradient-to-br from-amber-400/50 via-orange-500/40 to-yellow-400/40 ring-2 ring-amber-300 text-amber-100 shadow-lg',
  event: 'bg-gradient-to-br from-cyan-500/40 to-rose-500/40 ring-1 ring-cyan-300/60 text-cyan-100'
};

const KIND_CHIPS: Record<string,string> = {
  swap: 'Swap',
  streak: 'Streak',
  progression: 'Prog',
  community: 'Comm',
  event: 'Event',
  discount: '%'
};

export interface BadgeTokenProps {
  id: string;
  name: string;
  icon: string; // key into ICONS
  rarity?: string;
  kind?: string;
  unlocked: boolean;
  profile?: boolean;
  pulse?: boolean;
  upgradeLocked?: boolean; // user must upgrade to view/unlock
  hidden?: boolean; // generic hidden badge silhouette
  size?: 'sm' | 'md';
  onSelect?: () => void;
}

export const BadgeToken: React.FC<BadgeTokenProps> = ({ id, name, icon, rarity='common', kind='progression', unlocked, profile, pulse, upgradeLocked, hidden, size='md', onSelect }) => {
  const base = RARITY_STYLES[rarity] || RARITY_STYLES.common;
  const dim = size==='sm' ? 'w-8 h-8 text-[10px]' : 'w-14 h-14';
  const labelSize = size==='sm' ? 'text-[8px]' : 'text-[10px]';
  return (
    <button
      onClick={onSelect}
      disabled={!unlocked || upgradeLocked}
      title={upgradeLocked? 'Premium Badge – Upgrade to unlock' : (hidden? 'Hidden Badge' : name + (rarity? ` • ${rarity}`:''))}
      className={cn('relative rounded-md flex items-center justify-center transition font-medium overflow-hidden group border',
        dim,
        base,
        (!unlocked || upgradeLocked) && 'opacity-40 grayscale cursor-not-allowed',
        profile && 'ring-2 ring-emerald-400',
        pulse && 'animate-pulse'
      )}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition" />
      <div className="flex flex-col items-center gap-0.5">
        <span className={cn(labelSize,'truncate leading-none max-w-[2.5rem]')} style={{fontVariant: 'all-small-caps'}}>{hidden? '???' : name.split(' ')[0]}</span>
        <span className={cn(size==='sm' ? 'text-sm' : 'text-base','leading-none')}>{ICONS[icon] || <span className="text-lg">?</span>}</span>
      </div>
      {profile && <span className="absolute -top-1 -right-1 bg-emerald-500 text-[9px] px-1 rounded text-white">PRO</span>}
      {kind && size==='md' && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-slate-900/80 text-[9px] px-1 rounded text-slate-200 border border-slate-600">{KIND_CHIPS[kind]||kind.slice(0,4)}</span>}
      {(!unlocked || upgradeLocked) && <span className="absolute inset-0 bg-slate-900/80 backdrop-blur-[1px]" />}
      {upgradeLocked && <span className="absolute inset-0 flex items-center justify-center text-[9px] text-amber-300 font-semibold">UPGRADE</span>}
    </button>
  );
};
