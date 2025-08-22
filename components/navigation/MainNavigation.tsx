'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Home,
  Sparkles,
  Shield,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  Heart,
  Users,
  Trophy,
  Target,
  Zap,
  Star,
  Brain,
  Flame
} from 'lucide-react';

interface MainNavigationProps {
  currentPath?: string;
  userStats?: {
    streak: number;
    bytes: number;
    username?: string;
    badges?: number;
  };
}

const mainFeatures = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Main healing center',
    color: 'from-blue-500 to-cyan-500',
    badge: '🏠'
  },
  {
    title: 'AI Therapy',
    href: '/ai-therapy',
    icon: Brain,
    description: 'Smart healing companion',
    color: 'from-purple-500 to-pink-500',
    badge: '🧠'
  },
  {
    title: 'Daily Rituals',
    href: '/daily-rituals',
    icon: Calendar,
    description: 'Healing protocols',
    color: 'from-green-500 to-emerald-500',
    badge: '📅'
  },
  {
    title: 'No-Contact Tracker',
    href: '/no-contact',
    icon: Shield,
    description: 'Freedom progress',
    color: 'from-orange-500 to-red-500',
    badge: '🛡️'
  },
  {
    title: 'Wall of Wounds',
    href: '/wall',
    icon: MessageSquare,
    description: 'Community support',
    color: 'from-pink-500 to-rose-500',
    badge: '💔'
  },
  {
    title: 'Progress Analytics',
    href: '/dashboard/progress',
    icon: BarChart3,
    description: 'Track your growth',
    color: 'from-cyan-500 to-blue-500',
    badge: '📊'
  }
];

const advancedFeatures = [
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Customize experience',
    color: 'from-gray-500 to-slate-500',
    badge: '⚙️'
  },
  {
    title: 'System Status',
    href: '/status',
    icon: BarChart3,
    description: 'Platform health overview',
    color: 'from-green-500 to-emerald-500',
    badge: '🚀'
  }
];

export function MainNavigation({ currentPath, userStats }: MainNavigationProps) {
  const isActive = (href: string) => currentPath === href;

  return (
    <div className="space-y-8">
      {/* User Status Bar */}
      {userStats && (
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">
                  Welcome, {userStats.username || 'Warrior'}
                </h3>
                <p className="text-sm text-gray-400">Badges: {userStats.badges || 0}</p>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  <span className="text-cyan-400">{userStats.bytes.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-400">{userStats.streak}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">{userStats.bytes}</span>
                  <span className="text-yellow-400">✨</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Features */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mainFeatures.map((feature) => {
            const Icon = feature.icon;
            const active = isActive(feature.href);
            
            return (
              <Link key={feature.href} href={feature.href}>
                <Card className={`group transition-all duration-200 cursor-pointer ${
                  active 
                    ? 'bg-purple-500/20 border-purple-500/50 scale-105' 
                    : 'bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 hover:scale-105'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-white">{feature.title}</h3>
                          <span className="text-sm">{feature.badge}</span>
                        </div>
                        {active && (
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse mt-1"></div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Advanced Features */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Advanced Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {advancedFeatures.map((feature) => {
            const Icon = feature.icon;
            const active = isActive(feature.href);
            
            return (
              <Link key={feature.href} href={feature.href}>
                <Card className={`group transition-all duration-200 cursor-pointer ${
                  active 
                    ? 'bg-purple-500/20 border-purple-500/50 scale-105' 
                    : 'bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 hover:scale-105'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-white">
                            {feature.title}
                          </h3>
                          <span className="text-sm">{feature.badge}</span>
                        </div>
                        {active && (
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse mt-1"></div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/crisis-support">
            <Button className="w-full h-16 bg-red-500 hover:bg-red-600 flex flex-col gap-1">
              <Heart className="h-5 w-5" />
              <span className="text-xs">Crisis Support</span>
            </Button>
          </Link>
          
          <Link href="/quiz">
            <Button className="w-full h-16 bg-purple-500 hover:bg-purple-600 flex flex-col gap-1">
              <Target className="h-5 w-5" />
              <span className="text-xs">Heart Quiz</span>
            </Button>
          </Link>
          
          <Link href="/pricing">
            <Button className="w-full h-16 bg-yellow-500 hover:bg-yellow-600 flex flex-col gap-1">
              <Star className="h-5 w-5" />
              <span className="text-xs">Upgrade</span>
            </Button>
          </Link>
          
          <Link href="/how-it-works">
            <Button className="w-full h-16 bg-blue-500 hover:bg-blue-600 flex flex-col gap-1">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs">Learn More</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MainNavigation;
