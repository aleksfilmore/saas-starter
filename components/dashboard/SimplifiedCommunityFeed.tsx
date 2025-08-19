'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Users } from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'

interface CommunityPost {
  id: string
  content: string
  timestamp: string
  reactionsCount: number
  category: string
  userReaction?: string | null
  commentCount?: number
}

interface SimplifiedCommunityFeedProps {
  className?: string
  limit?: number
  variant?: 'compact' | 'expanded'
}

export function SimplifiedCommunityFeed({ className, limit = 6, variant = 'compact' }: SimplifiedCommunityFeedProps) {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [visible, setVisible] = useState(limit)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshIndex, setRefreshIndex] = useState(0)
  const [optimisticReactions, setOptimisticReactions] = useState<Record<string, number>>({}) // Track optimistic reactions

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/wall/preview?limit=${Math.max(visible, limit)}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed preview fetch')
      const data = await res.json()
      setPosts(data.posts || [])
    } catch (e:any) {
      setError(e.message || 'Failed to load community')
    } finally {
      setLoading(false)
    }
  }, [visible, limit, refreshIndex])

  useEffect(()=> { load() }, [load])

  // Auto refresh every 60s
  useEffect(()=> {
    const t = setInterval(()=> setRefreshIndex(i=> i+1), 60000)
    return () => clearInterval(t)
  }, [])

  const lastTimestamp = posts[0]?.timestamp;
  // Incremental poll every 25s for new posts (lighter than full refresh)
  useEffect(()=> {
    const t = setInterval(async ()=> {
      try {
        if(!lastTimestamp) return;
        const res = await fetch(`/api/wall/preview?limit=${limit}&since=${encodeURIComponent(lastTimestamp)}`, { cache:'no-store' });
        if(res.ok){
          const data = await res.json();
          if(data.posts?.length){
            setPosts(curr => [...data.posts, ...curr]);
          }
        }
      } catch { /* ignore */ }
    }, 25000);
    return ()=> clearInterval(t);
  }, [lastTimestamp, limit]);

  const handleReaction = async (postId: string, reactionType: string) => {
    const currentPost = posts.find(p => p.id === postId);
    if (!currentPost) return;

    const hasUserReacted = currentPost.userReaction === reactionType;
    
    // Optimistically update the reaction count
    setOptimisticReactions(prev => ({
      ...prev,
      [postId]: hasUserReacted ? -1 : 1 // Remove if already reacted, add if not
    }));

    try {
      const response = await fetch('/api/wall/react', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          reactionType
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update local state to reflect the reaction (for permanent sync)
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              reactionsCount: result.updatedCounts?.totalReactions || post.reactionsCount,
              userReaction: result.userReaction
            };
          }
          return post;
        }));
      } else {
        // Revert optimistic update on failure
        setOptimisticReactions(prev => ({
          ...prev,
          [postId]: Math.max(0, (prev[postId] || 0) - 1)
        }));
        
        console.error('Failed to react to post');
      }
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticReactions(prev => ({
        ...prev,
        [postId]: Math.max(0, (prev[postId] || 0) - 1)
      }));
      
      console.error('Failed to react to post:', error);
    }
  };

  const sliced = posts.slice(0, visible)
  const showLoadMore = visible < posts.length

  return (
    <section className={clsx('mb-8', className)}>
      <div className="flex items-center justify-between mb-4">
        <Link href="/wall" className="text-sm font-semibold text-white flex items-center gap-2 hover:text-purple-300 transition-colors">
          <Users className="w-4 h-4" />
          <span>Community Pulse</span>
          <span className="text-xs text-gray-400 font-normal">live • inspiration</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="h-6 w-6 text-xs text-purple-300 hover:text-purple-200" onClick={()=> setRefreshIndex(i=> i+1)} title="Refresh">↻</Button>
          <Link href="/wall" className="text-xs text-purple-300 hover:text-purple-200 transition-colors">View all →</Link>
        </div>
      </div>
      <div className={clsx(
        'grid gap-3',
        variant === 'compact' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      )}>
        {loading && Array.from({length: limit}).map((_,i)=>(
          <Card key={i} className="bg-gray-800/40 border-gray-700 animate-pulse h-32" />
        ))}
        {!loading && error && (
          <Card className="bg-red-900/40 border-red-700 col-span-full">
            <CardContent className="p-4 text-xs text-red-300">{error}</CardContent>
          </Card>
        )}
        {!loading && !error && sliced.map(p => (
          <Card key={p.id} className="bg-gray-800/60 border-gray-700/60 hover:border-gray-600 transition-colors group">
            <CardContent className="p-4 flex flex-col h-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 tracking-wide uppercase">
                  {p.category}
                </span>
                <span className="text-[10px] text-gray-500">{p.timestamp ? new Date(p.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : ''}</span>
              </div>
              <p className="text-xs text-gray-200 leading-relaxed line-clamp-4 flex-1">
                “{p.content}”
              </p>
              <div className="mt-3 text-[10px] text-gray-400 flex items-center justify-between">
                <button 
                  onClick={() => handleReaction(p.id, 'resonate')}
                  className={`transition-colors hover:text-pink-400 ${
                    p.userReaction === 'resonate' ? 'text-pink-400' : ''
                  }`}
                >
                  ❤️ {p.reactionsCount + (optimisticReactions[p.id] || 0)}
                </button>
                <span className="opacity-60">💬 {p.commentCount || 0}</span>
                <Link href="/wall" className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-300">Reply</Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {showLoadMore && !loading && !error && (
        <div className="mt-4 flex justify-center">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setVisible(v => v + limit)}
            className="border-purple-500/40 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
          >
            Load more
          </Button>
        </div>
      )}
      <div className="text-center mt-4">
        <Link href="/wall">
          <Button 
            size="sm"
            variant="ghost"
            className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/10"
          >
            <MessageSquare className="w-4 h-4 mr-1" /> Share Your Story
          </Button>
        </Link>
      </div>
    </section>
  )
}
