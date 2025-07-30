// Wall of Wounds - Main Component
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WallPost {
  id: string;
  content: string;
  glitchCategory: string;
  glitchTitle: string;
  isAnonymous: boolean;
  timeAgo: string;
  totalReactions: number;
  userReaction: string | null;
  resonateCount: number;
  sameLoopCount: number;
  draggedMeTooCount: number;
  stoneColdCount: number;
  cleansedCount: number;
  commentCount: number;
  isOraclePost: boolean;
  isFeatured: boolean;
  authorLevel?: number;
}

const GLITCH_REACTIONS = {
  resonate: { emoji: '🌀', label: 'Resonates', description: 'This resonates with my core' },
  same_loop: { emoji: '🔄', label: 'Same Loop', description: 'Same infinite loop here' },
  dragged_me_too: { emoji: '⬇️', label: 'Dragged Me', description: 'This dragged me down too' },
  stone_cold: { emoji: '🗿', label: 'Stone Cold', description: 'Stone cold accuracy' },
  cleansed: { emoji: '✨', label: 'Cleansed', description: 'I felt cleansed reading this' },
};

const GLITCH_CATEGORIES = {
  system_error: '5Y5T3M_3RR0R_D3T3CT3D',
  loop_detected: 'L00P_1NF1N1T3_D3T3CT3D',
  memory_leak: 'M3M0RY_L34K_1D3NT1F13D',
  buffer_overflow: 'BUFF3R_0V3RFL0W_W4RN1NG',
  syntax_error: '5YNT4X_3RR0R_L1N3_0',
  null_pointer: 'NULL_P01NT3R_3XC3PT10N',
  stack_overflow: '5T4CK_0V3RFL0W_3XC3PT10N',
  access_denied: '4CC355_D3N13D_3RR0R_403',
};

export default function WallOfWounds() {
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('recent');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('system_error');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, [filter]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/wall/feed?filter=${filter}&limit=20`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPostContent.trim()) return;

    try {
      setIsPosting(true);
      const response = await fetch('/api/wall/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newPostContent,
          glitchCategory: selectedCategory,
          isAnonymous,
        }),
      });

      if (response.ok) {
        setNewPostContent('');
        loadPosts(); // Reload feed
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to post');
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to post to the void');
    } finally {
      setIsPosting(false);
    }
  };

  const reactToPost = async (postId: string, reactionType: string) => {
    try {
      const response = await fetch('/api/wall/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, reactionType }),
      });

      if (response.ok) {
        loadPosts(); // Reload to get updated counts
      }
    } catch (error) {
      console.error('Failed to react:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-red-500 glitch">
            W4LL_0F_W0UND5™
          </h1>
          <p className="text-green-300">
            [ANONYMOUS EMOTIONAL DATA PROCESSING INTERFACE]
          </p>
        </div>

        {/* Post Creation */}
        <Card className="bg-gray-900 border-green-500 mb-6">
          <CardHeader>
            <CardTitle className="text-green-400">
              TRANSMIT_NEW_EMOTIONAL_DATA()
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm text-green-300 mb-2">
                ERROR_TYPE:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 bg-black border border-green-500 text-green-400 rounded"
              >
                {Object.entries(GLITCH_CATEGORIES).map(([key, title]) => (
                  <option key={key} value={key}>
                    {title}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Process your emotional data here... (max 2000 chars)"
              className="w-full h-32 p-3 bg-black border border-green-500 text-green-400 rounded resize-none"
              maxLength={2000}
            />

            <div className="flex justify-between items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="text-green-500"
                />
                <span className="text-green-300">ANONYMOUS_MODE</span>
              </label>

              <div className="flex items-center space-x-4">
                <span className="text-xs text-green-300">
                  {newPostContent.length}/2000
                </span>
                <Button
                  onClick={createPost}
                  disabled={isPosting || !newPostContent.trim()}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isPosting ? 'TRANSMITTING...' : 'TRANSMIT_TO_VOID()'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-6">
          {[
            { key: 'recent', label: 'RECENT_TRANSMISSIONS' },
            { key: 'viral', label: 'VIRAL_LOOPS' },
            { key: 'oracle', label: 'ORACLE_POSTS' },
            { key: 'pulse', label: 'DAILY_PULSE' },
          ].map((tab) => (
            <Button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              variant={filter === tab.key ? 'default' : 'outline'}
              className={`${
                filter === tab.key
                  ? 'bg-green-600 text-black'
                  : 'border-green-500 text-green-400 hover:bg-green-900'
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-green-400">LOADING_EMOTIONAL_DATA...</div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-red-400">NO_DATA_FOUND</div>
              <div className="text-green-300 text-sm mt-2">
                The void is empty. Be the first to transmit.
              </div>
            </div>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="bg-gray-900 border-green-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-red-400 font-bold text-sm">
                        {post.glitchTitle}
                      </div>
                      {post.isOraclePost && (
                        <Badge className="bg-purple-600 text-white mt-1">
                          ORACLE_POST
                        </Badge>
                      )}
                      {post.isFeatured && (
                        <Badge className="bg-yellow-600 text-black mt-1">
                          DAILY_PULSE
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-green-300">
                      {post.timeAgo}
                      {!post.isAnonymous && post.authorLevel && (
                        <div>LVL_{post.authorLevel}</div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-green-400 mb-4 whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {/* Reactions */}
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(GLITCH_REACTIONS).map(([key, reaction]) => (
                      <Button
                        key={key}
                        onClick={() => reactToPost(post.id, key)}
                        variant="outline"
                        size="sm"
                        className={`${
                          post.userReaction === key
                            ? 'bg-green-600 border-green-400'
                            : 'border-green-500 hover:bg-green-900'
                        } text-xs`}
                      >
                        {reaction.emoji} {post[`${key}Count` as keyof WallPost] || 0}
                      </Button>
                    ))}
                    <div className="text-xs text-green-300 flex items-center ml-4">
                      💬 {post.commentCount} COMMENTS
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .glitch {
          text-shadow: 0.05em 0 0 #ff0000, -0.03em -0.04em 0 #00ff00,
            0.025em 0.04em 0 #0000ff;
          animation: glitch 725ms infinite;
        }

        @keyframes glitch {
          0%,
          15%,
          17%,
          30%,
          32%,
          50%,
          52%,
          70%,
          72%,
          90%,
          92%,
          100% {
            text-shadow: 0.05em 0 0 #ff0000, -0.03em -0.04em 0 #00ff00,
              0.025em 0.04em 0 #0000ff;
          }
          16%,
          31%,
          51%,
          71%,
          91% {
            text-shadow: -0.05em -0.025em 0 #ff0000, 0.025em 0.035em 0 #00ff00,
              -0.05em -0.05em 0 #0000ff;
          }
        }
      `}</style>
    </div>
  );
}
