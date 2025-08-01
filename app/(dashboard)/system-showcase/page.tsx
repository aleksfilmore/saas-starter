import React from 'react'
import AuthWrapper from '@/components/AuthWrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Trophy, 
  MessageSquare, 
  User, 
  Coins,
  Sparkles,
  Crown,
  Shield,
  Zap,
  Target,
  Heart,
  Calendar
} from 'lucide-react'

export default function SystemShowcase() {
  const systemComponents = [
    {
      name: 'Wall of Wounds Ecosystem',
      status: 'complete',
      description: 'Revolutionary confession card system with viral sharing',
      features: ['Glitch-coded titles', 'Emoji reactions', 'Social export', 'Anonymous posting'],
      url: '/wall-ecosystem',
      icon: MessageSquare,
      color: 'text-red-500',
      bgColor: 'from-red-50 to-pink-50'
    },
    {
      name: 'Avatar Identity System',
      status: 'complete',
      description: '10 unique archetypes with glitch effects and cosmetic frames',
      features: ['Circuit Heart', 'Firewall Mask', 'Ghost Packet', 'Rarity tiers'],
      url: '/avatar-system',
      icon: User,
      color: 'text-purple-500',
      bgColor: 'from-purple-50 to-blue-50'
    },
    {
      name: 'Badge Achievement System',
      status: 'complete',
      description: '15 glitch trophies with progress tracking and byte rewards',
      features: ['First Blood', 'Block & Blessed', 'Progress bars', 'Equipment system'],
      url: '/badge-system',
      icon: Trophy,
      color: 'text-yellow-500',
      bgColor: 'from-yellow-50 to-orange-50'
    },
    {
      name: 'Byte Shop Economy',
      status: 'complete',
      description: 'Comprehensive reward marketplace with 5 categories',
      features: ['Voice sessions', 'Cosmetic frames', 'Mystery drops', 'Status badges'],
      url: '/byte-shop',
      icon: Coins,
      color: 'text-green-500',
      bgColor: 'from-green-50 to-blue-50'
    },
    {
      name: 'Emotional System Check',
      status: 'complete',
      description: 'Stealth attachment-style profiling with therapeutic protocols',
      features: ['Data Flooder', 'Firewall Builder', 'Ghost in Shell', 'Secure Node'],
      url: '/onboarding-quiz',
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'from-blue-50 to-purple-50'
    },
    {
      name: 'Gamification Engine',
      status: 'complete',
      description: 'Unified progress system connecting all platform elements',
      features: ['XP tracking', 'Level progression', 'Multipliers', 'Cross-system rewards'],
      url: '/gamification-showcase',
      icon: Star,
      color: 'text-pink-500',
      bgColor: 'from-pink-50 to-purple-50'
    }
  ]

  const legacyComponents = [
    {
      name: 'Old Achievement System',
      status: 'migrated',
      newLocation: '/badge-system',
      description: 'Migrated to enhanced Badge Collection with rarity tiers'
    },
    {
      name: 'Basic Wall System',
      status: 'migrated', 
      newLocation: '/wall-enhanced',
      description: 'Evolved into viral confession card ecosystem'
    }
  ]

  const upcomingFeatures = [
    {
      name: 'API Integration',
      description: 'Backend persistence for confessions, profiles, and economy',
      priority: 'high'
    },
    {
      name: 'Real-time Notifications',
      description: 'Live achievement unlocks and social engagement alerts',
      priority: 'medium'
    },
    {
      name: 'Advanced Analytics',
      description: 'Viral tracking, engagement metrics, and healing insights',
      priority: 'medium'
    },
    {
      name: 'Social Features',
      description: 'Following, friend requests, and community building tools',
      priority: 'low'
    }
  ]

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Hero Section */}
          <div className="text-center py-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Platform System Overview
            </h1>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Complete Emotional Healing Ecosystem
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              A comprehensive view of all implemented systems, migrations, and the revolutionary 
              transformation of anonymous trauma into viral content and gamified healing.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge className="bg-green-100 text-green-800 border-green-300 px-4 py-2 text-lg">
                ✅ 6 Complete Systems
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-300 px-4 py-2 text-lg">
                🔄 2 Legacy Migrations
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-300 px-4 py-2 text-lg">
                🚀 4 Upcoming Features
              </Badge>
            </div>
          </div>

          {/* Complete Systems */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span>Complete Systems</span>
              </CardTitle>
              <CardDescription>
                Fully implemented and operational platform components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {systemComponents.map((system, index) => {
                  const IconComponent = system.icon
                  return (
                    <Card key={index} className={`bg-gradient-to-br ${system.bgColor} border-2 border-gray-200 hover:shadow-lg transition-all duration-300`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <IconComponent className={`h-8 w-8 ${system.color}`} />
                          <Badge className="bg-green-100 text-green-800">
                            ✅ Complete
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{system.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {system.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-2">Key Features:</h4>
                          <div className="flex flex-wrap gap-1">
                            {system.features.map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button asChild className="w-full">
                          <a href={system.url}>
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Explore System
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Legacy System Migrations */}
          <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-2">
                <ArrowRight className="h-6 w-6 text-orange-500" />
                <span>Legacy System Migrations</span>
              </CardTitle>
              <CardDescription>
                Old components that have been upgraded to enhanced systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {legacyComponents.map((legacy, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">{legacy.name}</h4>
                      <Badge className="bg-orange-100 text-orange-800">
                        🔄 Migrated
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{legacy.description}</p>
                    <Button asChild size="sm" variant="outline" className="w-full">
                      <a href={legacy.newLocation}>
                        <ArrowRight className="h-3 w-3 mr-2" />
                        View New System
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Platform Integration Map */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-2xl">System Integration Flow</CardTitle>
              <CardDescription>
                How all platform components work together in the healing ecosystem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-medium">1. Emotional Profiling</h4>
                  <p className="text-sm text-gray-600">System Check determines archetype</p>
                </div>
                
                <div className="text-center">
                  <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-medium">2. Avatar Selection</h4>
                  <p className="text-sm text-gray-600">Choose archetype-matched avatar</p>
                </div>
                
                <div className="text-center">
                  <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="h-8 w-8 text-red-600" />
                  </div>
                  <h4 className="font-medium">3. Content Creation</h4>
                  <p className="text-sm text-gray-600">Post viral confession cards</p>
                </div>
                
                <div className="text-center">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-medium">4. Progress Rewards</h4>
                  <p className="text-sm text-gray-600">Earn badges and bytes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-blue-500" />
                <span>Upcoming Features</span>
              </CardTitle>
              <CardDescription>
                Planned enhancements to expand the platform capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{feature.name}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                    <Badge className={
                      feature.priority === 'high' ? 'bg-red-100 text-red-800' :
                      feature.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {feature.priority.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Navigation */}
          <Card className="bg-gradient-to-r from-gray-900 to-black text-white">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Quick Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Button asChild className="bg-red-600 hover:bg-red-700">
                  <a href="/wall-ecosystem">Wall Ecosystem</a>
                </Button>
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <a href="/avatar-system">Avatar System</a>
                </Button>
                <Button asChild className="bg-yellow-600 hover:bg-yellow-700">
                  <a href="/badge-system">Badge System</a>
                </Button>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <a href="/byte-shop">Byte Shop</a>
                </Button>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <a href="/onboarding-quiz">System Check</a>
                </Button>
                <Button asChild className="bg-pink-600 hover:bg-pink-700">
                  <a href="/gamification-showcase">Gamification</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthWrapper>
  )
}
