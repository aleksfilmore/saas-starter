import React from 'react';

interface NextUnlockPanelProps {
  streak: number;
  level: number;
  bytes: number;
  subscriptionTier?: 'free'|'premium';
}

function computeNext(streak:number, level:number, subscriptionTier?:string){
  if(subscriptionTier==='premium') return {label:'You are Premium', detail:'Focus on consistency to unlock milestone badges next.'};
  if(streak < 3) return {label:'Unlock AI Preview', detail:'Reach a 3-day streak to preview AI therapy snippet.'};
  if(level < 5) return {label:'Community Posting', detail:'Reach Level 5 to post on the Wall.'};
  return {label:'Premium Momentum Pack', detail:'Upgrade for dual rituals, guidance & unlimited AI support.'};
}

export const NextUnlockPanel: React.FC<NextUnlockPanelProps> = ({streak, level, bytes, subscriptionTier}) => {
  const next = computeNext(streak, level, subscriptionTier);
  return (
    <div className="rounded-xl border border-cyan-700/40 bg-cyan-900/10 p-4 backdrop-blur-sm">
      <p className="text-xs uppercase tracking-wide text-cyan-400 mb-1">Next Unlock</p>
      <h3 className="text-sm font-semibold text-white">{next.label}</h3>
      <p className="text-xs text-cyan-300 mt-1 leading-relaxed">{next.detail}</p>
      {subscriptionTier!=='premium' && (
        <button onClick={()=>{window.location.href='/pricing'}} className="mt-3 w-full text-sm font-medium bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white py-2 rounded-md">Upgrade</button>
      )}
    </div>
  );
};
