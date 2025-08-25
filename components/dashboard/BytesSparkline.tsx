"use client";
import React from 'react';

interface Point { date: string; earned: number }

export function BytesSparkline({ series, highlightRange }: { series: Point[]; highlightRange: 'today'|'7d'|'30d' }) {
  const data = series || [];
  if (!data.length) return <div className="h-8 rounded bg-slate-800/50" />;
  const max = Math.max(1, ...data.map(d=>d.earned));
  const width = 160; const height = 40; const step = width / (data.length - 1 || 1);
  const path = data.map((p,i)=> `${i===0?'M':'L'} ${i*step} ${height - (p.earned / max) * (height-6) -3}`).join(' ');
  const cutoff = highlightRange==='today'? data.length-1 : highlightRange==='7d'? data.length-7 : 0;
  return (
    <svg width={width} height={height} className="block mx-auto">
      <path d={path} fill="none" stroke="#10b981" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((p,i)=> i>=cutoff && <circle key={p.date} cx={i*step} cy={height - (p.earned / max) * (height-6) -3} r={2.5} fill="#10b981">
        <title>{p.date} : {p.earned}</title>
      </circle>)}
    </svg>
  );
}
