'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Plus, ArrowRight, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface WallPost {
  id: string;
  content: string;
  glitchTitle: string;
  timeAgo: string;
  totalReactions: number;
  commentCount: number;
  userReaction: string | null;
  isAnonymous: boolean;
  authorLevel?: number;
}

interface WallOfWoundsDashboardProps {
  userTier: 'ghost' | 'firewall' | 'premium';
  className?: string;
}

export default function WallOfWoundsDashboard({ userTier, className = '' }: WallOfWoundsDashboardProps) {
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [reacting, setReacting] = useState<string | null>(null);

  const isFirewallUser = userTier === 'firewall' || userTier === 'premium';

  useEffect(() => {
    loadRecentPosts();
  }, []);

  const loadRecentPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/wall/feed?limit=6&dashboard=true');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to load wall posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (postId: string) => {
    if (reacting) return;
    
    setReacting(postId);
    try {
      const response = await fetch('/api/wall/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          postId, 
          reaction: 'resonate' // Default to heart/resonate
        }),
      });

      if (response.ok) {
        // Update the post locally
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === postId) {
              const wasReacted = post.userReaction === 'resonate';
              return {
                ...post,
                userReaction: wasReacted ? null : 'resonate',
                totalReactions: wasReacted ? post.totalReactions - 1 : post.totalReactions + 1
              };
            }
            return post;
          })
        );
      }
    } catch (error) {
      console.error('Failed to react to post:', error);
    } finally {
      setReacting(null);
    }
  };

  const handleUpgradeClick = () => {
    // Trigger Stripe checkout for Firewall subscription
    const upgradeToFirewall = async () => {
      try {
        const response = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tier: 'premium' }),
        });

        if (response.ok) {
          const { url } = await response.json();
          window.location.href = url;
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to start checkout');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        alert('Failed to start checkout. Please try again.');
      }
    };

    upgradeToFirewall();
  };

  if (loading) {
    return (
      <Card className={`bg-gray-900/90 border-purple-500/30 ${className}`}>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-purple-400" />
            Wall of Wounds™
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-purple-400 animate-pulse">Loading healing journeys...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gray-900/90 border-purple-500/30 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-purple-400" />
            Wall of Wounds™
          </div>
          <div className="flex items-center gap-1 text-sm text-purple-400">
            <Users className="h-4 w-4" />
            <span>Live</span>
          </div>
        </CardTitle>
        <p className="text-purple-300 text-sm">
          Anonymous healing journeys
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Post Area - Ghost Users Get CTA */}
        {!isFirewallUser ? (
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/50 rounded-lg p-4">
            <div className="text-center space-y-3">
              <div className="text-2xl">🔥</div>
              <h3 className="font-bold text-white">Share Your Healing Journey</h3>
              <p className="text-purple-300 text-sm">
                Unlock the power to post on the Wall of Wounds™ and connect with the community
              </p>
              <Button 
                onClick={handleUpgradeClick}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-semibold w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Upgrade to Firewall Mode
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-purple-300 text-sm">Share your truth</span>
              <Link href="/wall">
                <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white">
                  <Plus className="h-4 w-4 mr-1" />
                  Post
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Recent Posts */}
        <div className="space-y-3">
          {posts.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-gray-400 text-sm">No posts yet</div>
              <div className="text-purple-400 text-xs mt-1">Be the first to share</div>
            </div>
          ) : (
            posts.map((post) => (
              <div 
                key={post.id} 
                className="bg-gray-800/40 border border-gray-700 rounded-lg p-3 hover:border-purple-500/50 transition-colors"
              >
                {/* Post Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-purple-400">
                    <span>👻</span>
                    <span className="font-medium">{post.glitchTitle}</span>
                    {!post.isAnonymous && post.authorLevel && (
                      <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                        LVL {post.authorLevel}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{post.timeAgo}</span>
                </div>

                {/* Post Content (Truncated) */}
                <p className="text-white text-sm mb-3 line-clamp-3">
                  {post.content.length > 120 
                    ? `${post.content.substring(0, 120)}...` 
                    : post.content
                  }
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Heart Reaction */}
                    <button
                      onClick={() => handleReaction(post.id)}
                      disabled={reacting === post.id}
                      className={`flex items-center gap-1 transition-colors ${
                        post.userReaction === 'resonate'
                          ? 'text-red-400' 
                          : 'text-gray-400 hover:text-red-400'
                      }`}
                      aria-label={`React to post with heart. Current reactions: ${post.totalReactions}`}
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          post.userReaction === 'resonate' ? 'fill-current' : ''
                        }`} 
                      />
                      <span className="text-xs">{post.totalReactions}</span>
                    </button>

                    {/* Comments */}
                    <div className="flex items-center gap-1 text-gray-400">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs">{post.commentCount}</span>
                    </div>
                  </div>

                  {/* Trending indicator */}
                  {post.totalReactions > 5 && (
                    <TrendingUp className="h-4 w-4 text-yellow-400" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* View All Posts Link */}
        <div className="pt-2">
          <Link href="/wall">
            <Button 
              variant="outline" 
              className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              View All Posts
            </Button>
          </Link>
        </div>

        {/* Community Stats */}
        <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-purple-400">
                {posts.reduce((sum, post) => sum + post.totalReactions, 0)}
              </div>
              <div className="text-xs text-gray-400">Hearts Given</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-400">
                {posts.length}
              </div>
              <div className="text-xs text-gray-400">Recent Posts</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
