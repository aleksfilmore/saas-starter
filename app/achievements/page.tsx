"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AchievementsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new badge system after a short delay
    const timer = setTimeout(() => {
      router.push('/badge-system');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-blue-900/40 border-2 border-purple-500/50">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-white text-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              🔄 SYSTEM UPGRADE
            </CardTitle>
            <p className="text-purple-400 text-center text-lg">
              Achievement system has been upgraded to our new Badge Collection
            </p>
          </CardHeader>
        </Card>

        {/* Migration Notice */}
        <Card className="bg-gradient-to-br from-blue-900/20 via-purple-900/30 to-pink-900/20 border-2 border-blue-500/50">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-white text-center flex items-center justify-center space-x-2">
              <Sparkles className="h-6 w-6 text-blue-400" />
              <span>Enhanced Badge System</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <h4 className="font-bold text-white mb-2">15 New Badges</h4>
                <p className="text-sm text-gray-400">
                  Glitch Trophies with rarity tiers and progress tracking
                </p>
              </div>
              
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                <Star className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <h4 className="font-bold text-white mb-2">Real-time Progress</h4>
                <p className="text-sm text-gray-400">
                  Live progress bars and achievement notifications
                </p>
              </div>
              
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                <ArrowRight className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <h4 className="font-bold text-white mb-2">Byte Rewards</h4>
                <p className="text-sm text-gray-400">
                  Earn 40-150 Bytes per badge unlock
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xl text-gray-300">
                Your achievements have been migrated to our enhanced badge system with new features:
              </p>
              
              <div className="flex flex-wrap justify-center gap-2">
                <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                  Bronze Tier Badges
                </Badge>
                <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                  Silver Tier Badges
                </Badge>
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  Gold Tier Badges
                </Badge>
                <Badge className="bg-red-100 text-red-800 border-red-300">
                  Crimson Tier Badges
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-400">
                Redirecting to new Badge Collection in 3 seconds...
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/badge-system">
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    <Trophy className="h-4 w-4 mr-2" />
                    View Badge Collection
                  </Button>
                </Link>
                <Link href="/avatar-system">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Star className="h-4 w-4 mr-2" />
                    Customize Avatar
                  </Button>
                </Link>
                <Link href="/gamification-showcase">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Full Gamification Tour
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Animation */}
        <Card className="bg-gray-800/50 border border-gray-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="h-2 w-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-gray-400">Loading new badge system...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
