"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle, Sparkles, Zap, Users, Target } from 'lucide-react';
import Link from 'next/link';

interface ImplementationItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  category: 'core' | 'enhanced' | 'integration' | 'optimization';
  priority: 'high' | 'medium' | 'low';
  features: string[];
  demoUrl?: string;
  apiEndpoint?: string;
  completionPercentage: number;
}

const implementationProgress: ImplementationItem[] = [
  {
    id: 'progressive-onboarding',
    title: 'Progressive Onboarding System',
    description: 'Step-by-step guided user introduction with visual progress indicators',
    status: 'completed',
    category: 'core',
    priority: 'high',
    features: ['Visual step indicators', 'XP rewards', 'Skip options', 'Error handling', 'Time estimates'],
    demoUrl: '/enhanced-features-demo?tab=onboarding',
    completionPercentage: 100
  },
  {
    id: 'enhanced-therapy',
    title: 'Enhanced AI Therapy Sessions',
    description: 'AI personality adaptation based on emotional tone with tier-specific features',
    status: 'completed',
    category: 'core',
    priority: 'high',
    features: ['AI personality adaptation', 'Achievement celebrations', 'Tier-based unlocks', 'Progress visualization'],
    demoUrl: '/enhanced-features-demo?tab=therapy',
    apiEndpoint: '/api/therapy/enhanced',
    completionPercentage: 100
  },
  {
    id: 'progress-visualization',
    title: 'Advanced Progress Visualization',
    description: 'Multi-metric progress tracking with achievement celebrations',
    status: 'completed',
    category: 'enhanced',
    priority: 'high',
    features: ['Animated progress rings', 'Achievement overlays', 'Social sharing', 'Milestone tracking'],
    demoUrl: '/enhanced-features-demo?tab=progress',
    completionPercentage: 100
  },
  {
    id: 'enhanced-wall',
    title: 'Enhanced Wall of Wounds',
    description: 'Community platform with viral mechanics and emotional tagging',
    status: 'completed',
    category: 'enhanced',
    priority: 'high',
    features: ['Emotional reactions', 'Content filtering', 'Tier indicators', 'Viral mechanics'],
    demoUrl: '/enhanced-features-demo?tab=community',
    apiEndpoint: '/api/wall/react',
    completionPercentage: 100
  },
  {
    id: 'enhanced-dashboard',
    title: 'Enhanced Dashboard',
    description: 'Unified healing command center with all features integrated',
    status: 'completed',
    category: 'integration',
    priority: 'high',
    features: ['Tabbed interface', 'Quick stats', 'Emotional tone selector', 'Activity feed'],
    demoUrl: '/dashboard/enhanced',
    completionPercentage: 100
  },
  {
    id: 'enhanced-signup',
    title: 'Enhanced Sign-Up Flow',
    description: 'Multi-step registration with emotional tone selection',
    status: 'completed',
    category: 'core',
    priority: 'medium',
    features: ['Multi-step flow', 'Emotional tone selection', 'Tier preview', 'Progress tracking'],
    demoUrl: '/sign-up/enhanced',
    apiEndpoint: '/api/auth/signup/enhanced',
    completionPercentage: 100
  },
  {
    id: 'achievement-system',
    title: 'Achievement System',
    description: 'Comprehensive achievement tracking with celebrations and sharing',
    status: 'completed',
    category: 'enhanced',
    priority: 'medium',
    features: ['Achievement registry', 'Celebration effects', 'Social sharing', 'Reward claiming'],
    apiEndpoint: '/api/achievements/enhanced',
    completionPercentage: 100
  },
  {
    id: 'enhanced-landing',
    title: 'Enhanced Landing Page',
    description: 'Marketing showcase with interactive demos and feature highlights',
    status: 'completed',
    category: 'integration',
    priority: 'medium',
    features: ['Feature showcase', 'Interactive stats', 'Tier comparison', 'Demo integration'],
    demoUrl: '/enhanced',
    completionPercentage: 100
  },
  {
    id: 'navigation-system',
    title: 'Enhanced Navigation',
    description: 'Comprehensive navigation linking all enhanced features',
    status: 'completed',
    category: 'integration',
    priority: 'medium',
    features: ['Mobile responsive', 'User stats display', 'Feature categorization', 'Active state tracking'],
    completionPercentage: 100
  },
  {
    id: 'error-handling',
    title: 'Enhanced Error Handling',
    description: 'Graceful degradation with branded error messages',
    status: 'completed',
    category: 'optimization',
    priority: 'medium',
    features: ['Branded error messages', 'Retry mechanisms', 'Fallback content', 'Error tracking'],
    completionPercentage: 100
  },
  {
    id: 'ui-components',
    title: 'Enhanced UI Component Library',
    description: 'Extended component library with new elements',
    status: 'completed',
    category: 'optimization',
    priority: 'low',
    features: ['Alert components', 'Progress bars', 'Tabs system', 'Enhanced cards'],
    completionPercentage: 100
  },
  {
    id: 'database-integration',
    title: 'Database Schema Integration',
    description: 'Connect all features to persistent data storage',
    status: 'pending',
    category: 'integration',
    priority: 'high',
    features: ['User data persistence', 'Achievement tracking', 'Session history', 'Community data'],
    completionPercentage: 0
  }
];

export default function ImplementationStatus() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    overallProgress: 0
  });

  useEffect(() => {
    const total = implementationProgress.length;
    const completed = implementationProgress.filter(item => item.status === 'completed').length;
    const inProgress = implementationProgress.filter(item => item.status === 'in-progress').length;
    const pending = implementationProgress.filter(item => item.status === 'pending').length;
    const overallProgress = Math.round((completed / total) * 100);

    setStats({ total, completed, inProgress, pending, overallProgress });
  }, []);

  const filteredItems = selectedCategory === 'all' 
    ? implementationProgress 
    : implementationProgress.filter(item => item.category === selectedCategory);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'pending': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'pending': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core': return <Zap className="w-4 h-4" />;
      case 'enhanced': return <Sparkles className="w-4 h-4" />;
      case 'integration': return <Target className="w-4 h-4" />;
      case 'optimization': return <Users className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-blue-900/40 border-2 border-purple-500/50">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-white text-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              🚀 CTRL+ALT+BLOCK™ IMPLEMENTATION STATUS
            </CardTitle>
            <p className="text-purple-400 text-center text-lg">
              Enhanced platform features and integration progress
            </p>
          </CardHeader>
        </Card>

        {/* Overall Progress */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-gray-800/50 border border-green-500/30 md:col-span-2">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-green-400">{stats.overallProgress}%</div>
                <div className="text-lg text-white">Overall Progress</div>
                <Progress value={stats.overallProgress} className="h-3" />
                <p className="text-sm text-gray-400">
                  {stats.completed} of {stats.total} features implemented
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border border-green-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
              <div className="text-sm text-gray-400">Completed</div>
              <CheckCircle className="w-6 h-6 text-green-400 mx-auto mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border border-yellow-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.inProgress}</div>
              <div className="text-sm text-gray-400">In Progress</div>
              <Clock className="w-6 h-6 text-yellow-400 mx-auto mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border border-red-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{stats.pending}</div>
              <div className="text-sm text-gray-400">Pending</div>
              <AlertCircle className="w-6 h-6 text-red-400 mx-auto mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <Card className="bg-gray-800/50 border border-gray-600">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setSelectedCategory('all')}
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                className={selectedCategory === 'all' ? 'bg-purple-500' : 'border-gray-600 text-gray-400'}
              >
                All Features ({implementationProgress.length})
              </Button>
              <Button
                onClick={() => setSelectedCategory('core')}
                variant={selectedCategory === 'core' ? 'default' : 'outline'}
                className={selectedCategory === 'core' ? 'bg-purple-500' : 'border-gray-600 text-gray-400'}
              >
                <Zap className="w-4 h-4 mr-1" />
                Core ({implementationProgress.filter(i => i.category === 'core').length})
              </Button>
              <Button
                onClick={() => setSelectedCategory('enhanced')}
                variant={selectedCategory === 'enhanced' ? 'default' : 'outline'}
                className={selectedCategory === 'enhanced' ? 'bg-purple-500' : 'border-gray-600 text-gray-400'}
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Enhanced ({implementationProgress.filter(i => i.category === 'enhanced').length})
              </Button>
              <Button
                onClick={() => setSelectedCategory('integration')}
                variant={selectedCategory === 'integration' ? 'default' : 'outline'}
                className={selectedCategory === 'integration' ? 'bg-purple-500' : 'border-gray-600 text-gray-400'}
              >
                <Target className="w-4 h-4 mr-1" />
                Integration ({implementationProgress.filter(i => i.category === 'integration').length})
              </Button>
              <Button
                onClick={() => setSelectedCategory('optimization')}
                variant={selectedCategory === 'optimization' ? 'default' : 'outline'}
                className={selectedCategory === 'optimization' ? 'bg-purple-500' : 'border-gray-600 text-gray-400'}
              >
                <Users className="w-4 h-4 mr-1" />
                Optimization ({implementationProgress.filter(i => i.category === 'optimization').length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Items */}
        <div className="grid gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="bg-gray-800/50 border border-gray-600 hover:border-purple-500/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <CardTitle className="text-xl text-white">{item.title}</CardTitle>
                      <p className="text-gray-400">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(item.category)}
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Implementation Progress</span>
                    <span className="text-white">{item.completionPercentage}%</span>
                  </div>
                  <Progress value={item.completionPercentage} className="h-2" />
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-sm font-bold text-gray-300 mb-2">Features Implemented:</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.features.map((feature, index) => (
                      <Badge key={index} className="bg-blue-500/20 text-blue-400 border-blue-500/50 text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  {item.demoUrl && (
                    <Link href={item.demoUrl}>
                      <Button size="sm" className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                        🎮 Try Demo
                      </Button>
                    </Link>
                  )}
                  {item.apiEndpoint && (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                      API: {item.apiEndpoint}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card className="bg-gradient-to-br from-green-900/20 via-blue-900/30 to-purple-900/20 border-2 border-green-500/50">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-white text-center">
              🎯 IMPLEMENTATION COMPLETE
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-xl text-gray-300">
              All major enhanced features have been successfully implemented and are ready for testing!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/enhanced-features-demo">
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-lg px-8 py-4">
                  🚀 Explore All Features
                </Button>
              </Link>
              <Link href="/dashboard/enhanced">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 text-lg px-8 py-4">
                  📊 Open Enhanced Dashboard
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-400">
              Total Features Implemented: {stats.completed} | Overall Progress: {stats.overallProgress}%
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
