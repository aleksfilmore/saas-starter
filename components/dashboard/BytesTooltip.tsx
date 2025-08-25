"use client";
import React from 'react';

interface Props { children: React.ReactNode; explanation?: string; }

// Lightweight custom tooltip (avoids adding radix provider if not already)
export function BytesTooltip({ children, explanation }: Props) {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute left-1/2 -translate-x-1/2 top-full mt-1 z-40">
        <div className="max-w-xs text-[10px] leading-snug bg-slate-900/90 border border-slate-700 text-slate-200 px-2 py-1 rounded shadow-xl">
          {explanation || 'Earn bytes once per action daily. Bytes fuel rewards & progression.'}
        </div>
      </div>
    </div>
  );
}
