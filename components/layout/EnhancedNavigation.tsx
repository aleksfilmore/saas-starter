"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Home, 
  Settings, 
  Trophy,
  Users,
  Gamepad2,
  BarChart3,
  Target,
  Sparkles,
  Menu,
  X
} from 'lucide-react';

interface NavigationProps {
  user?: {
    alias: string;
    xp: number;
    tier: 'free' | 'firewall' | 'cult-leader';
    streakDays: number;
  };
}

const navigationItems = [
  {
    section: 'Core Features',
    items: [
      {
        id: 'dashboard',
        label: 'Enhanced Dashboard',
        href: '/dashboard/enhanced',
        icon: Home,
        description: 'Unified healing command center',
        badge: '🚀'
      },
      {
        id: 'therapy',
        label: 'AI Therapy',
        href: '/ai-therapy-demo',
        icon: Gamepad2,
        description: 'Adaptive AI personality sessions',
        badge: '🎮'
      },
      {
        id: 'progress',
        label: 'Progress Tracking',
        href: '/enhanced-features-demo?tab=progress',
        icon: BarChart3,
        description: 'Advanced XP visualization',
        badge: '📊'
      },
      {
        id: 'community',
        label: 'Wall of Wounds',
        href: '/wall',
        icon: Users,
        description: 'Enhanced community platform',
        badge: '📱'
      }
    ]
  },
  {
    section: 'Enhanced Experience',
    items: [
      {
        id: 'onboarding',
        label: 'Progressive Onboarding',
        href: '/enhanced-features-demo?tab=onboarding',
        icon: Target,
        description: 'Step-by-step guided setup',
        badge: '🎯'
      },
      {
        id: 'achievements',
        label: 'Achievements',
        href: '/achievements',
        icon: Trophy,
        description: 'Milestone celebrations',
        badge: '🏆'
      },
      {
        id: 'demo',
        label: 'Interactive Demo',
        href: '/enhanced-features-demo',
        icon: Sparkles,
        description: 'Try all enhanced features',
        badge: '✨'
      }
    ]
  },
  {
    section: 'Platform',
    items: [
      {
        id: 'enhanced-landing',
        label: 'Enhanced Home',
        href: '/enhanced',
        icon: Home,
        description: 'Marketing showcase',
        badge: '🎨'
      },
      {
        id: 'signup-enhanced',
        label: 'Enhanced Sign Up',
        href: '/sign-up/enhanced',
        icon: User,
        description: 'Improved registration flow',
        badge: '📝'
      }
    ]
  }
];

export default function EnhancedNavigation({ user }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/enhanced-features-demo') {
      return pathname.startsWith('/enhanced-features-demo');
    }
    return pathname === href;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'firewall': return 'text-orange-400 border-orange-500/50 bg-orange-500/20';
      case 'cult-leader': return 'text-purple-400 border-purple-500/50 bg-purple-500/20';
      default: return 'text-blue-400 border-blue-500/50 bg-blue-500/20';
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-800/80 border border-purple-500/50 backdrop-blur-sm"
        size="sm"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </Button>

      {/* Navigation Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-gray-900/95 border-r border-gray-700 backdrop-blur-sm z-40 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="text-2xl font-black text-white mb-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
            CTRL+ALT+BLOCK™
          </div>
          <p className="text-sm text-purple-400">Enhanced Digital Healing</p>
          
          {user && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Welcome back, {user.alias}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                  {user.xp.toLocaleString()} XP
                </Badge>
                <Badge className={getTierColor(user.tier)}>
                  {user.tier.toUpperCase()}
                </Badge>
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50">
                  {user.streakDays}🔥
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {navigationItems.map((section) => (
            <div key={section.section}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                {section.section}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <Link key={item.id} href={item.href}>
                      <div className={`group flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                        active 
                          ? 'bg-purple-500/20 border border-purple-500/50 text-white' 
                          : 'hover:bg-gray-800/50 text-gray-300 hover:text-white'
                      }`}>
                        <div className={`p-2 rounded-md ${
                          active 
                            ? 'bg-purple-500/30' 
                            : 'bg-gray-700/50 group-hover:bg-gray-600/50'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{item.label}</span>
                            <span className="text-sm">{item.badge}</span>
                          </div>
                          <p className="text-xs text-gray-400 truncate">
                            {item.description}
                          </p>
                        </div>
                        {active && (
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="text-xs text-gray-400 text-center">
            <p>Enhanced Platform v2.0</p>
            <p className="mt-1">🚀 Next-gen healing technology</p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
