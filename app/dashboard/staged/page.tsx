'use client';

import React from 'react';
import AuthWrapper from '@/components/AuthWrapper';
import { useDashboard } from '@/hooks/useDashboard';
import FeatureGate from '@/components/ui/FeatureGate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Flame, 
  Zap, 
  Shield, 
  Heart, 
  MessageCircle, 
  Brain, 
  BarChart3,
  Mic,
  Calendar,
  Target,
  RefreshCw,
  ArrowRight,
  Star,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

// Shared style tokens
const CONTAINER_MAX_WIDTH = '1280px';
const CTA_COLORS = {
  bg: '#A855F7',
  hover: '#C084FC'
};

// Skeleton components
function HeroSkeleton() {
  return (
    <Card className="bg-gray-900/50 border-gray-700 animate-pulse">
      <CardContent className="p-6">
        <div className="h-[120px] bg-gray-800 rounded-lg"></div>
      </CardContent>
    </Card>
  );
}

function TileSkeleton() {
  return (
    <Card className="bg-gray-900/50 border-gray-700 animate-pulse">
      <CardContent className="p-4">
        <div className="h-[60px] bg-gray-800 rounded-lg"></div>
      </CardContent>
    </Card>
  );
}

// Welcome strip component
function WelcomeStrip({ alias, level, xp }: { alias: string; level: number; xp: number }) {
  const progressPercent = Math.floor(((xp % 1000) / 1000) * 100);
  
  return (
    <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Hey {alias}, Level {level}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <Progress value={progressPercent} className="w-32 h-2" />
              <span className="text-sm text-purple-300">{progressPercent}%</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span className="text-cyan-400">{xp.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hero ritual component
function RitualHero({ ritual }: { ritual: any }) {
  if (!ritual) {
    return <HeroSkeleton />;
  }

  const difficultyStars = '★'.repeat(ritual.difficulty) + '☆'.repeat(5 - ritual.difficulty);

  return (
    <Card className="bg-gradient-to-br from-orange-900/30 via-red-900/30 to-purple-900/30 border border-orange-500/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center text-2xl">
          <span className="text-3xl mr-3">{ritual.emoji}</span>
          {ritual.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">{difficultyStars}</span>
            <span className="text-gray-300">Difficulty {ritual.difficulty}/5</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="h-4 w-4 text-cyan-400" />
            <span className="text-cyan-400">+{ritual.xpReward} XP</span>
          </div>
        </div>
        
        <p className="text-gray-300">{ritual.description}</p>
        
        <div className="flex space-x-3">
          <Button 
            style={{ backgroundColor: CTA_COLORS.bg }}
            className="hover:opacity-90 flex-1"
          >
            Complete Ritual
          </Button>
          {ritual.canReroll && (
            <Button variant="outline" className="border-gray-500 text-gray-300">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reroll
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Pills component
function StatusPills({ streak, bytes, shieldAvailable }: any) {
  return (
    <div className="flex space-x-3">
      <Card className="bg-gray-900/50 border-orange-500/50">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2">
            <Flame className="h-5 w-5 text-orange-400" />
            <div>
              <div className="text-sm font-semibold text-white">{streak.days}</div>
              <div className="text-xs text-gray-400">Day Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-900/50 border-yellow-500/50">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-400" />
            <div>
              <div className="text-sm font-semibold text-white">{bytes}</div>
              <div className="text-xs text-gray-400">Bytes</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className={`bg-gray-900/50 ${shieldAvailable ? 'border-blue-500/50' : 'border-gray-600/50'}`}>
        <CardContent className="p-3">
          <div className="flex items-center space-x-2">
            <Shield className={`h-5 w-5 ${shieldAvailable ? 'text-blue-400' : 'text-gray-500'}`} />
            <div>
              <div className="text-xs text-gray-400">Shield</div>
              <div className={`text-sm font-semibold ${shieldAvailable ? 'text-blue-400' : 'text-gray-500'}`}>
                {shieldAvailable ? 'Ready' : 'Used'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Secondary tile component
function SecondaryTile({ icon: Icon, title, description, href, locked = false, badge }: any) {
  const content = (
    <Card className={`${locked ? 'opacity-50' : 'hover:bg-gray-800/50'} bg-gray-900/50 border-gray-700 transition-all cursor-pointer`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-900/30 rounded-lg">
            <Icon className="h-5 w-5 text-purple-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-white text-sm">{title}</h3>
              {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
              {locked && <div className="text-yellow-400">🔒</div>}
            </div>
            <p className="text-xs text-gray-400 mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (locked) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}

// Quick action chips
function QuickActionChips() {
  const actions = [
    { label: 'Panic', emoji: '🚨', href: '/crisis-support' },
    { label: 'Breath', emoji: '🫁', href: '/ritual?type=breath' },
    { label: 'Gratitude', emoji: '🙏', href: '/ritual?type=gratitude' }
  ];

  return (
    <div className="flex space-x-2">
      {actions.map((action) => (
        <Link key={action.label} href={action.href}>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <span className="mr-1">{action.emoji}</span>
            {action.label}
          </Button>
        </Link>
      ))}
    </div>
  );
}

// Wall preview component (Core+ only)
function WallPreview({ posts }: { posts: any[] }) {
  return (
    <FeatureGate stage="core">
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Community Feed
            </div>
            <Link href="/wall">
              <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white">
                View Wall <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {posts?.slice(0, 3).map((post) => (
            <div key={post.id} className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-gray-300 text-sm line-clamp-2">{post.content}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <Heart className="h-3 w-3" />
                  <span>{post.hearts}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{post.replies}</span>
                </div>
                <span>{new Date(post.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </FeatureGate>
  );
}

// Main dashboard component
export default function StagedDashboard() {
  const { data, isLoading, isError } = useDashboard();

  if (isError) {
    return (
      <AuthWrapper>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400">Failed to load dashboard</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        <div className="mx-auto px-4 py-8" style={{ maxWidth: CONTAINER_MAX_WIDTH }}>
          
          {/* Welcome Strip */}
          {data && (
            <div className="mb-6">
              <WelcomeStrip 
                alias={data.user.alias} 
                level={data.level} 
                xp={data.xp} 
              />
            </div>
          )}

          {/* Today's Ritual Hero */}
          <div className="mb-6">
            {isLoading ? <HeroSkeleton /> : <RitualHero ritual={data?.ritual} />}
          </div>

          {/* Status Pills */}
          {data && (
            <div className="mb-6">
              <StatusPills 
                streak={data.streak} 
                bytes={data.bytes} 
                shieldAvailable={data.streak.shieldAvailable} 
              />
            </div>
          )}

          {/* Secondary Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Always visible tiles */}
            <SecondaryTile
              icon={Target}
              title="No-Contact Tracker"
              description="Track your healing progress"
              href="/no-contact"
            />
            
            <SecondaryTile
              icon={Heart}
              title="Mood Log"
              description="Record your emotional state"
              href="/mood"
              badge="+5 Bytes"
            />

            {/* Core+ tiles */}
            <FeatureGate stage="core" fallback={
              <SecondaryTile
                icon={Brain}
                title="AI Therapy"
                description="Unlock at Day 5"
                href="/ai-therapy"
                locked={true}
              />
            }>
              <SecondaryTile
                icon={Brain}
                title="AI Therapy"
                description={`Chat (${data?.quota || 0} left)`}
                href="/ai-therapy"
                badge={data?.quota === 0 ? 'Upgrade' : undefined}
              />
            </FeatureGate>

            <FeatureGate stage="core" fallback={
              <SecondaryTile
                icon={MessageCircle}
                title="Wall"
                description="Unlock at Day 5"
                href="/wall"
                locked={true}
              />
            }>
              <SecondaryTile
                icon={MessageCircle}
                title="Wall"
                description="Read confessions"
                href="/wall"
                badge="Read only"
              />
            </FeatureGate>

            {/* Power+ tiles */}
            <FeatureGate stage="power" fallback={
              <SecondaryTile
                icon={Mic}
                title="Voice Oracle"
                description="Unlock at Day 14"
                href="/voice"
                locked={true}
              />
            }>
              <SecondaryTile
                icon={Mic}
                title="Voice Oracle"
                description={data?.user.hasSubscription ? "Start 15-min Call" : "Trial available"}
                href="/voice"
                badge={!data?.user.hasSubscription ? 'Trial' : undefined}
              />
            </FeatureGate>

            <FeatureGate stage="power" fallback={
              <SecondaryTile
                icon={BarChart3}
                title="Analytics"
                description="Unlock at Day 14"
                href="/analytics"
                locked={true}
              />
            }>
              <SecondaryTile
                icon={BarChart3}
                title="Analytics"
                description="14-day progress sparkline"
                href="/analytics"
              />
            </FeatureGate>
          </div>

          {/* Wall Preview (Core+ only) */}
          {data?.wallPreview && (
            <div className="mb-6">
              <WallPreview posts={data.wallPreview} />
            </div>
          )}

          {/* Quick Action Chips */}
          <div className="mb-6">
            <QuickActionChips />
          </div>

          {/* Upsell ribbons for Power users without subscription */}
          <FeatureGate stage="power">
            {data && !data.user.hasSubscription && (
              <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Unlock 2 Voice Oracle calls/month</p>
                      <p className="text-purple-300 text-sm">Upgrade to Cult Leader tier</p>
                    </div>
                    <Button style={{ backgroundColor: CTA_COLORS.bg }} className="hover:opacity-90">
                      Upgrade Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </FeatureGate>

          {/* Debug info (remove in production) */}
          {data && (
            <div className="mt-8 p-4 bg-gray-800/30 rounded-lg border border-gray-600">
              <h3 className="text-white font-medium mb-2">Debug Info</h3>
              <p className="text-gray-300 text-sm">
                Stage: <Badge>{data.ux_stage}</Badge> | 
                Level: {data.level} | 
                XP: {data.xp} | 
                Quota: {data.quota}
              </p>
              <div className="mt-2 text-xs text-gray-400">
                <Link href="/dashboard?stage=starter" className="text-blue-400 hover:underline mr-4">
                  Test Starter
                </Link>
                <Link href="/dashboard?stage=core" className="text-green-400 hover:underline mr-4">
                  Test Core
                </Link>
                <Link href="/dashboard?stage=power" className="text-purple-400 hover:underline">
                  Test Power
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </AuthWrapper>
  );
}
