'use client';

import React from 'react';
import AuthWrapper from '@/components/AuthWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Zap, 
  Target, 
  Heart, 
  Users, 
  Brain, 
  Shield,
  Star,
  TrendingUp,
  Award,
  MessageCircle,
  Calendar,
  Settings,
  Navigation,
  Activity,
  Database
} from 'lucide-react';
import Link from 'next/link';

interface SystemStatus {
  feature: string;
  status: 'active' | 'ready' | 'enhanced';
  description: string;
  path: string;
  icon: any;
  category: 'core' | 'advanced' | 'community' | 'wellness';
}

export default function StatusPage() {
  const systemFeatures: SystemStatus[] = [
    // Core Features
    {
      feature: 'Dashboard',
      status: 'enhanced',
      description: 'Multi-view dashboard with adaptive and glow-up modes',
      path: '/dashboard',
      icon: Activity,
      category: 'core'
    },
    {
      feature: 'Navigation Center',
      status: 'enhanced',
      description: 'Centralized feature navigation with categorized access',
      path: '/navigation',
      icon: Navigation,
      category: 'core'
    },
    {
      feature: 'Progress Tracking',
      status: 'enhanced',
      description: 'Comprehensive analytics and visualization',
      path: '/progress',
      icon: TrendingUp,
      category: 'core'
    },
    {
      feature: 'Achievements System',
      status: 'enhanced',
      description: 'Rarity-based rewards and milestone tracking',
      path: '/achievements',
      icon: Award,
      category: 'core'
    },
    {
      feature: 'Settings Panel',
      status: 'active',
      description: 'User preferences and account management',
      path: '/settings',
      icon: Settings,
      category: 'core'
    },

    // Advanced Features
    {
      feature: 'AI Therapy Assistant',
      status: 'active',
      description: 'Intelligent emotional support and guidance',
      path: '/ai-therapy',
      icon: Brain,
      category: 'advanced'
    },
    {
      feature: 'Daily Rituals',
      status: 'active',
      description: 'Personalized healing routines and tracking',
      path: '/daily-rituals',
      icon: Calendar,
      category: 'advanced'
    },
    {
      feature: 'No Contact Support',
      status: 'active',
      description: 'Specialized support for relationship healing',
      path: '/no-contact',
      icon: Shield,
      category: 'advanced'
    },
    {
      feature: 'Crisis Support',
      status: 'ready',
      description: '24/7 emergency mental health resources',
      path: '/crisis-support',
      icon: Heart,
      category: 'advanced'
    },

    // Community Features
    {
      feature: 'Wall of Wounds',
      status: 'active',
      description: 'Anonymous community support and sharing',
      path: '/wall',
      icon: MessageCircle,
      category: 'community'
    },
    {
      feature: 'Community Quiz',
      status: 'active',
      description: 'Interactive assessments and insights',
      path: '/quiz',
      icon: Target,
      category: 'community'
    },

    // Wellness Features
    {
      feature: 'Ritual Scanner',
      status: 'ready',
      description: 'Smart ritual recognition and suggestions',
      path: '/scan',
      icon: Zap,
      category: 'wellness'
    },
    {
      feature: 'Welcome Onboarding',
      status: 'active',
      description: 'Guided user introduction and setup',
      path: '/welcome',
      icon: Star,
      category: 'wellness'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enhanced':
        return 'bg-purple-600 text-white';
      case 'active':
        return 'bg-green-600 text-white';
      case 'ready':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core':
        return 'border-purple-500';
      case 'advanced':
        return 'border-blue-500';
      case 'community':
        return 'border-green-500';
      case 'wellness':
        return 'border-yellow-500';
      default:
        return 'border-gray-500';
    }
  };

  const categories = [
    { id: 'core', name: 'Core Features', color: 'text-purple-400' },
    { id: 'advanced', name: 'Advanced Features', color: 'text-blue-400' },
    { id: 'community', name: 'Community Features', color: 'text-green-400' },
    { id: 'wellness', name: 'Wellness Features', color: 'text-yellow-400' }
  ];

  const stats = {
    totalFeatures: systemFeatures.length,
    enhanced: systemFeatures.filter(f => f.status === 'enhanced').length,
    active: systemFeatures.filter(f => f.status === 'active').length,
    ready: systemFeatures.filter(f => f.status === 'ready').length
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-purple-300 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                🚀 System Status
              </h1>
              <p className="text-xl text-purple-300">
                Platform Health & Feature Overview
              </p>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">{stats.totalFeatures}</div>
                  <div className="text-sm text-gray-400">Total Features</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/50 border-purple-500">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{stats.enhanced}</div>
                  <div className="text-sm text-gray-400">Enhanced</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/50 border-green-500">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{stats.active}</div>
                  <div className="text-sm text-gray-400">Active</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/50 border-blue-500">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{stats.ready}</div>
                  <div className="text-sm text-gray-400">Ready</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features by Category */}
          {categories.map((category) => {
            const categoryFeatures = systemFeatures.filter(f => f.category === category.id);
            
            return (
              <div key={category.id} className="mb-8">
                <h2 className={`text-2xl font-bold mb-4 ${category.color}`}>
                  {category.name}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryFeatures.map((feature) => {
                    const Icon = feature.icon;
                    
                    return (
                      <Card 
                        key={feature.feature} 
                        className={`bg-gray-900/50 border-2 ${getCategoryColor(feature.category)} hover:bg-gray-800/50 transition-all duration-200`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-white flex items-center text-lg">
                              <Icon className="h-5 w-5 mr-2" />
                              {feature.feature}
                            </CardTitle>
                            <Badge className={getStatusColor(feature.status)}>
                              {feature.status.toUpperCase()}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-300 text-sm mb-4">
                            {feature.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <Link href={feature.path}>
                              <Button 
                                size="sm" 
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                Access Feature
                              </Button>
                            </Link>
                            
                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* System Health */}
          <Card className="bg-gray-900/50 border-gray-700 mt-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="h-5 w-5 mr-2" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <div className="font-medium text-white">Authentication</div>
                    <div className="text-sm text-gray-400">User session management</div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <div className="font-medium text-white">Database</div>
                    <div className="text-sm text-gray-400">Data persistence layer</div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <div className="font-medium text-white">API Endpoints</div>
                    <div className="text-sm text-gray-400">Backend services</div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-8 text-center">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/dashboard">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Return to Dashboard
                </Button>
              </Link>
              <Link href="/navigation">
                <Button variant="outline" className="border-blue-500 text-blue-400">
                  Feature Navigation
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline" className="border-gray-500 text-gray-300">
                  Settings
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </AuthWrapper>
  );
}