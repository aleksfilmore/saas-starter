"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Send, Users, TrendingUp, Shield } from 'lucide-react';

interface WallPost {
  id: string;
  content: string;
  archetype: string;
  timeAgo: string;
  reactions: number;
  anonymous: boolean;
}

interface Props {
  posts: WallPost[];
  onPostSubmit: (content: string) => Promise<void> | void;
  canPost?: boolean; // free users false
  onEngage?: () => void; // like or any engagement (counts daily task)
}

const archetypeColors = {
  'Data Flooder': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Firewall Builder': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Secure Node': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Ghost in the Shell': 'bg-purple-500/20 text-purple-400 border-purple-500/30'
};

export function LiveCommunityZone({ posts, onPostSubmit, canPost = true, onEngage }: Props) {
  const [newPost, setNewPost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userReactions, setUserReactions] = useState<{[key: string]: boolean}>({});

  const handleReaction = async (postId: string) => {
    // Check if user already reacted to this post
    if (userReactions[postId]) {
      // Remove reaction
      try {
        const response = await fetch('/api/wall/react', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postId,
            reactionType: 'resonate'
          })
        });

        if (response.ok) {
          setUserReactions(prev => ({ ...prev, [postId]: false }));
        }
      } catch (error) {
        console.error('Failed to remove reaction:', error);
      }
    } else {
      // Add reaction
      try {
        const response = await fetch('/api/wall/react', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postId,
            reactionType: 'resonate'
          })
        });

        if (response.ok) {
          setUserReactions(prev => ({ ...prev, [postId]: true }));
          onEngage?.();
        }
      } catch (error) {
        console.error('Failed to react to post:', error);
      }
    }
  };

  const handleSubmit = async () => {
    if (!newPost.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onPostSubmit(newPost);
      setNewPost('');
    } catch (error) {
      console.error('Failed to submit post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalReactions = posts.reduce((sum, post) => sum + post.reactions, 0);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Community Live Feed</h2>
        <div className="flex items-center space-x-4 text-gray-400">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span className="text-sm">{posts.length} active</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">{totalReactions} hearts</span>
          </div>
        </div>
      </div>

      {/* Post Creation */}
      <Card className="bg-gray-800/60 border-gray-700">
        <CardContent className="pt-6">
          {canPost ? (
            <div className="space-y-4">
              <Textarea
                placeholder="Share your story, breakthrough, or struggle... (posted anonymously)"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Shield className="h-4 w-4" />
                  <span>Anonymous • Safe space</span>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!newPost.trim() || isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Share
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-gray-300">
              <p className="mb-2 font-medium">Posting is a Premium feature</p>
              <p className="text-xs text-gray-400 mb-3">Upgrade to share your own stories. You can still react & support others.</p>
              <div className="w-full h-1 bg-gray-700 rounded">
                <div className="h-full w-1/3 bg-gradient-to-r from-purple-600 to-pink-600 rounded" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Feed */}
      <Card className="bg-gray-800/60 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Wall of Wounds</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
          {posts.map((post) => (
            <div 
              key={post.id}
              className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50 hover:border-gray-500/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Badge className={archetypeColors[post.archetype as keyof typeof archetypeColors] || 'bg-gray-500/20 text-gray-400'}>
                    {post.archetype}
                  </Badge>
                  <span className="text-gray-400 text-sm">{post.timeAgo}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`transition-colors ${
                    userReactions[post.id] 
                      ? 'text-red-400 hover:text-red-300' 
                      : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                  }`}
                  onClick={() => handleReaction(post.id)}
                  disabled={userReactions[post.id]}
                >
                  <Heart className={`h-4 w-4 mr-1 ${userReactions[post.id] ? 'fill-current' : ''}`} />
                  {post.reactions + (userReactions[post.id] ? 1 : 0)}
                </Button>
              </div>
              <p className="text-gray-200 leading-relaxed">{post.content}</p>
            </div>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">The community is quiet right now</p>
              <p className="text-sm mt-2">Be the first to share your story and inspire others</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
