// Wall of Wounds - Redirect to Enhanced System
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ArrowRight, Sparkles, Share, Heart } from 'lucide-react';
import Link from 'next/link';
import AuthWrapper from '@/components/AuthWrapper';

export default function WallRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new wall enhanced after a short delay
    const timer = setTimeout(() => {
      router.push('/wall-enhanced');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-purple-900 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <Card className="bg-gradient-to-r from-red-900/40 via-purple-900/30 to-pink-900/40 border-2 border-red-500/50">
            <CardHeader>
              <CardTitle className="text-3xl font-black text-white text-center">
                🧱 WALL SYSTEM UPGRADE
              </CardTitle>
              <p className="text-red-400 text-center text-lg">
                Wall of Wounds has evolved into a viral confession ecosystem
              </p>
            </CardHeader>
          </Card>

          {/* Evolution Notice */}
          <Card className="bg-gradient-to-br from-gray-900/50 via-red-900/30 to-black/50 border-2 border-purple-500/50">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-white text-center flex items-center justify-center space-x-2">
                <Sparkles className="h-6 w-6 text-purple-400" />
                <span>Revolutionary Confession Card™ System</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-lg border border-red-500/30">
                  <MessageSquare className="h-8 w-8 text-red-400 mx-auto mb-2" />
                  <h4 className="font-bold text-white mb-2">Glitch-Core Cards</h4>
                  <p className="text-sm text-gray-400">
                    Beautifully packaged pain content with viral-ready design
                  </p>
                </div>
                
                <div className="p-4 bg-gray-800/50 rounded-lg border border-purple-500/30">
                  <Share className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <h4 className="font-bold text-white mb-2">Viral Sharing</h4>
                  <p className="text-sm text-gray-400">
                    Spotify-style cards exportable to Instagram & social media
                  </p>
                </div>
                
                <div className="p-4 bg-gray-800/50 rounded-lg border border-pink-500/30">
                  <Heart className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                  <h4 className="font-bold text-white mb-2">Emotional Reactions</h4>
                  <p className="text-sm text-gray-400">
                    6 reaction types: 💔👻🔥🪞✂️🫠 with viral tracking
                  </p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-xl text-gray-300">
                  Your anonymous confessions are now transformed into shareable art pieces
                </p>
                
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge className="bg-red-100 text-red-800 border-red-300">
                    💔 Glitch Titles
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                    🎭 Anonymous Voyeurism  
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                    📱 One-Click Export
                  </Badge>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    ⚡ XP Rewards
                  </Badge>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-900/20 to-purple-900/20 rounded-lg p-6 border border-red-500/30">
                <h4 className="font-bold text-center mb-4 text-white">Enhanced Features</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                  <div>
                    <div className="font-medium text-red-400">Daily Brutal</div>
                    <div className="text-gray-400">Most brutal confession curated daily</div>
                  </div>
                  <div>
                    <div className="font-medium text-purple-400">Redacted Shares</div>
                    <div className="text-gray-400">Black box graphics for external sharing</div>
                  </div>
                  <div>
                    <div className="font-medium text-blue-400">Emotion Tags</div>
                    <div className="text-gray-400">Grief, rage, petty, glow-up categories</div>
                  </div>
                  <div>
                    <div className="font-medium text-pink-400">Byte Economy</div>
                    <div className="text-gray-400">Earn currency for wall engagement</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-gray-400 text-center">
                  Redirecting to enhanced Wall of Wounds in 3 seconds...
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/wall-enhanced">
                    <Button className="bg-gradient-to-r from-red-500 to-purple-500 hover:from-red-600 hover:to-purple-600">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Enter Enhanced Wall
                    </Button>
                  </Link>
                  <Link href="/wall-ecosystem">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Sparkles className="h-4 w-4 mr-2" />
                      View Full Ecosystem
                    </Button>
                  </Link>
                  <Link href="/gamification-showcase">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Explore Gamification
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading Animation */}
          <Card className="bg-gray-800/50 border border-gray-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-gray-400">Loading viral confession system...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthWrapper>
  );
}
