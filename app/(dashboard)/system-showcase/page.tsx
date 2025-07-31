import React from 'react'
import AuthWrapper from '@/components/AuthWrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Flame, 
  BookOpen, 
  BarChart3, 
  Zap, 
  Trophy,
  ArrowRight,
  Star,
  Target
} from 'lucide-react'

export default function RitualSystemShowcase() {
  const systemFeatures = [
    {
      icon: Flame,
      title: 'Daily Ritual Engine',
      description: 'Personalized healing rituals delivered daily based on your tier and progress',
      link: '/dashboard/glow-up-console',
      status: 'Fully Operational',
      color: 'text-orange-500'
    },
    {
      icon: BookOpen,
      title: 'Sacred Ritual Library',
      description: 'Browse 8 therapeutic categories with 15+ healing rituals and growing',
      link: '/rituals',
      status: 'Complete Vault',
      color: 'text-blue-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Deep insights into healing progress, streaks, and emotional transformation',
      link: '/analytics',
      status: 'Advanced Tracking',
      color: 'text-purple-500'
    },
    {
      icon: Target,
      title: 'Tier-Based Access',
      description: 'Ghost ($0) → Firewall ($9) → Deep Reset ($29) with progressive ritual unlocks',
      link: '/pricing',
      status: 'Revolutionary Pricing',
      color: 'text-green-500'
    }
  ]

  const ritualCategories = [
    { name: 'The Grief Cycle', icon: '🩸', description: 'Raw emotional processing' },
    { name: 'The Petty Purge', icon: '🔥', description: 'Spite-based catharsis' },
    { name: 'The Glow-Up Forge', icon: '⚒️', description: 'Identity reconstruction' },
    { name: 'The Reframe Loop', icon: '🌀', description: 'Perception-bending therapy' },
    { name: 'The Ghost Cleanse', icon: '👻', description: 'Digital exorcism protocols' },
    { name: 'The Public Face', icon: '🎭', description: 'High-functioning heartbreak survival' },
    { name: 'The Soft Reset', icon: '🌙', description: 'Gentle self-soothing rituals' },
    { name: 'The Cult Missions', icon: '🕹️', description: 'Gamified social healing' }
  ]

  const achievements = [
    { title: 'Revolutionary Pricing Model', description: '$9 impulse tier for maximum conversion' },
    { title: 'Therapeutic Architecture', description: '8 sacred categories with emotional targeting' },
    { title: 'Gamification Layer', description: 'XP/Bytes rewards with streak tracking' },
    { title: 'Immersive Experience', description: 'Step-by-step ritual completion interface' },
    { title: 'Progress Analytics', description: 'Comprehensive healing journey tracking' }
  ]

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Hero Section */}
          <div className="text-center py-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              CTRL+ALT+BLOCK™
            </h1>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Revolutionary Ritual-Based Healing System
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              The complete digital therapy ecosystem is now <span className="font-bold text-green-600">LIVE</span>. 
              Experience therapeutic rituals, gamified healing, and emotional transformation 
              powered by next-generation architecture.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge className="bg-green-100 text-green-800 border-green-300 px-4 py-2 text-lg">
                ✅ Platform Operational
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-300 px-4 py-2 text-lg">
                🔥 Ritual Engine Active
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-300 px-4 py-2 text-lg">
                📊 Analytics Deployed
              </Badge>
            </div>
          </div>

          {/* System Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {systemFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow border-2 border-dashed border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                      <span>{feature.title}</span>
                      <Badge variant="outline" className="ml-auto">
                        {feature.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <a href={feature.link} className="flex items-center justify-center space-x-2">
                        <span>Access System</span>
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Ritual Categories Showcase */}
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="text-2xl text-center">8 Sacred Healing Categories</CardTitle>
              <CardDescription className="text-center text-lg">
                Each category targets specific emotional healing patterns with 8-10 therapeutic rituals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ritualCategories.map((category, index) => (
                  <div key={index} className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h4 className="font-medium text-sm mb-1">{category.name}</h4>
                    <p className="text-xs text-gray-600">{category.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievement Showcase */}
          <Card className="bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <span>Platform Evolution Complete</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <h4 className="font-bold text-sm">{achievement.title}</h4>
                    </div>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Access Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <CardContent className="p-6 text-center">
                <Flame className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Start Your Ritual</h3>
                <p className="text-gray-600 mb-4">Begin today's personalized healing session</p>
                <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
                  <a href="/dashboard/glow-up-console">Launch Console</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Explore Rituals</h3>
                <p className="text-gray-600 mb-4">Browse the complete therapeutic vault</p>
                <Button asChild className="w-full bg-blue-500 hover:bg-blue-600">
                  <a href="/rituals">Open Library</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Track Progress</h3>
                <p className="text-gray-600 mb-4">Deep analytics on your healing journey</p>
                <Button asChild className="w-full bg-purple-500 hover:bg-purple-600">
                  <a href="/analytics">View Analytics</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Final CTA */}
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              The Future of Digital Therapy is Here
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-3xl mx-auto">
              Experience the revolutionary combination of ritual-based healing, 
              gamification psychology, and therapeutic architecture that transforms 
              emotional labor into empowering digital ceremonies.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <a href="/dashboard/glow-up-console">Begin Your Healing Journey</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/pricing">Explore Pricing Tiers</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  )
}
