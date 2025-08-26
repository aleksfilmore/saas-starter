import * as React from 'react';
import useSWR from 'swr';

interface ReactionOptions {
  endpoint?: string; // default /api/wall/react
}

/**
 * Shared optimistic single-toggle reaction (heart/resonate) logic for Wall and dashboard preview.
 * Provides throttle, optimistic update, and error rollback.
 */
export function useWallReaction(options: ReactionOptions = {}) {
  const inflight = React.useRef<Set<string>>(new Set());
  const endpoint = options.endpoint || '/api/wall/react';

  const toggleReaction = async <T extends { id:string; hearts?:number; userReaction?: string | null }>(
    post: T,
    mutateList: (updater: (prev: any)=> any, shouldRevalidate?: boolean)=> void
  ) => {
    if(inflight.current.has(post.id)) return;
    inflight.current.add(post.id);
    const optimisticAdd = post.userReaction !== 'resonate';
    let rollback: any = null;
    try {
      mutateList(prev => { rollback = prev; if(!prev) return prev; const next = { ...prev }; next.posts = prev.posts.map((p:any)=> p.id===post.id ? { ...p, hearts: Math.max(0,(p.hearts||0)+(optimisticAdd?1:-1)), userReaction: optimisticAdd? 'resonate': null }: p); return next; }, false);
      const res = await fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ postId: post.id, reactionType:'resonate' }) });
      if(!res.ok) throw new Error('Reaction failed');
      const j = await res.json();
      mutateList(prev=> { if(!prev) return prev; const next = { ...prev }; next.posts = prev.posts.map((p:any)=> p.id===post.id ? { ...p, hearts: j.updatedCounts?.resonateCount ?? p.hearts, userReaction: j.userReaction }: p); return next; }, false);
    } catch(e){
      if(rollback) mutateList(()=> rollback, false);
      throw e;
    } finally { inflight.current.delete(post.id); }
  };

  return { toggleReaction };
}
