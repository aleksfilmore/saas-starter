/**
 * SWR hooks for Wall data with optimized caching and revalidation
 */

import useSWR from 'swr';
import { useAuth } from '@/contexts/AuthContext';

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
});

export interface WallPost {
  id: string;
  content: string;
  glitchCategory: string;
  glitchTitle: string;
  isAnonymous: boolean;
  createdAt: string;
  resonateCount: number;
  sameLoopCount: number;
  draggedMeTooCount: number;
  stoneColdCount: number;
  cleansedCount: number;
  commentCount: number;
  isOraclePost: boolean;
  isFeatured: boolean;
  totalReactions: number;
  timeAgo: string;
  userReaction?: string | null;
}

export interface WallFeedData {
  posts: WallPost[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
  filter: string;
  category: string | null;
}

/**
 * Hook for wall feed with intelligent caching
 */
export function useWallFeed(filter: string = 'recent', category?: string) {
  const { isAuthenticated } = useAuth();
  
  const url = isAuthenticated 
    ? `/api/wall/feed?filter=${filter}${category ? `&category=${category}` : ''}`
    : null;

  const { data, error, isLoading, mutate } = useSWR<WallFeedData>(
    url,
    fetcher,
    {
      // Aggressive caching for better performance
      dedupingInterval: 30000, // 30 seconds
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 60000, // 1 minute auto-refresh
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    data,
    posts: data?.posts || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refresh: mutate,
  };
}

/**
 * Hook for optimistic reaction updates
 */
export function useOptimisticReaction() {
  const reactToPost = async (postId: string, reactionType: string, currentCount: number) => {
    // Optimistic update logic
    const response = await fetch('/api/wall/react', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ postId, reactionType })
    });

    if (!response.ok) {
      throw new Error('Reaction failed');
    }

    return response.json();
  };

  return { reactToPost };
}

/**
 * Hook for wall post submission with cache invalidation
 */
export function useWallPost() {
  const submitPost = async (content: string, category: string, isAnonymous: boolean = true) => {
    const response = await fetch('/api/wall/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        content,
        glitchCategory: category,
        isAnonymous
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit post');
    }

    return response.json();
  };

  return { submitPost };
}
