import React from 'react'
import AuthWrapper from '@/components/AuthWrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, 
  Brain, 
  Zap, 
  Star, 
  Share,
  Download,
  Trophy,
  Target,
  ArrowRight,
  Flame,
  Ghost,
  Coins
} from 'lucide-react'

export default function WallEcosystemShowcase() {
  const confessionExamples = [
    {
      title: '// Ghost_47a',
      text: 'He watched my story. That was it. That was all it took to ruin the progress.',
      tag: 'relapse',
      reactions: 552,
      isViral: true
    },
    {
      title: '// RedFlag.OS',
      text: 'He told me I was too emotional while crying about his ex.',
      tag: 'petty',
      reactions: 981,
      isViral: true
    },
    {
      title: '// Almost.exe',
      text: 'I wasn\'t the one. I was the almost. The warm-up. The "thank you, next."',
      tag: 'grief',
      reactions: 1370,
      isViral: true
    }
  ]

  const archetypes = [
    {
      name: 'The Data Flooder',
      tagline: 'If you don\'t reply in 3 min I\'ll ping the mainframe.',
      description: 'Broadcasts love on every frequency, short-circuits when signal drops',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'The Firewall Builder', 
      tagline: 'Feelings? Cool story—blocked at the port.',
      description: 'Builds walls faster than trust, keeps viruses and updates out',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      name: 'The Ghost in the Shell',
      tagline: 'Come closer… NOW LEAVE.',
      description: 'Push-pull loop detected, needs stable pings and crash recovery',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'The Secure Node',
      tagline: 'Systems online, no panic packets detected.',
      description: 'Rare bug-free build, mentors glitchier users and protects uptime',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ]

  const shopHighlights = [
    {
      name: 'Emergency Oracle Summon',
      description: '15-min voice AI therapy session',
      price: 500,
      category: 'Voice Sessions'
    },
    {
      name: 'Blocked & Blessed Badge',
      description: 'Premium badge for ultimate boundary setting',
      price: 400,
      category: 'Status Badges'
    },
    {
      name: 'Emotional Loot Crate',
      description: 'Rare ritual + exclusive theme + cursed AI compliment',
      price: 300,
      category: 'Mystery Drops'
    }
  ]

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-purple-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Hero Section */}
          <div className="text-center py-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Wall of Wounds Ecosystem
            </h1>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Revolutionary Confession Card™ System
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Transform anonymous trauma into beautifully digestible pain content that's wired to circulate. 
              Every wound becomes a glitch-core, Spotify-style confession card—shareable, cryptic, beautifully painful.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge className="bg-red-100 text-red-800 border-red-300 px-4 py-2 text-lg">
                💔 Viral Confession System
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-300 px-4 py-2 text-lg">
                🧠 Attachment Profiling
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-300 px-4 py-2 text-lg">
                🛍️ Gamified Byte Economy
              </Badge>
            </div>
          </div>

          {/* Confession Card Examples */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Viral Confession Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {confessionExamples.map((confession, index) => (
                <Card key={index} className="bg-gradient-to-br from-gray-900 to-black text-white">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono text-purple-300">
                        {confession.title}
                      </code>
                      {confession.isViral && (
                        <Badge className="bg-red-600 text-white">🔥 VIRAL</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <blockquote className="text-lg italic">
                      "{confession.text}"
                    </blockquote>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-gray-700 text-gray-300">
                        {confession.tag}
                      </Badge>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Heart className="h-4 w-4" />
                        <span>{confession.reactions.toLocaleString()} reactions</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 text-center border-t border-gray-700 pt-2">
                      Wall of Wounds — ctrlaltblock.com
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                        <Share className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Emotional System Check */}
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="text-2xl text-center flex items-center justify-center space-x-2">
                <Brain className="h-6 w-6 text-purple-600" />
                <span>Emotional System Check</span>
              </CardTitle>
              <CardDescription className="text-center text-lg">
                Stealth attachment-style profiling disguised as a glitch-themed quiz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {archetypes.map((archetype, index) => (
                  <div key={index} className={`p-4 rounded-lg border-2 border-dashed ${archetype.bgColor}`}>
                    <h4 className={`font-bold ${archetype.color} mb-2`}>{archetype.name}</h4>
                    <p className="text-sm italic text-gray-600 mb-2">"{archetype.tagline}"</p>
                    <p className="text-xs text-gray-700">{archetype.description}</p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6">
                <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <a href="/onboarding-quiz">Take the System Check</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Byte Shop Preview */}
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl text-center flex items-center justify-center space-x-2">
                <Coins className="h-6 w-6 text-yellow-500" />
                <span>Byte Shop Economy</span>
              </CardTitle>
              <CardDescription className="text-center text-lg">
                Transform emotional labor into tangible rewards and status symbols
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {shopHighlights.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                    <div className="flex items-center space-x-2">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold">{item.price} Bytes</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-6">
                <h4 className="font-bold text-center mb-4">Byte Earning Opportunities</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="font-bold">10-20 Bytes</div>
                    <div className="text-sm text-gray-600">Daily Ritual</div>
                  </div>
                  <div>
                    <div className="font-bold">10 Bytes</div>
                    <div className="text-sm text-gray-600">Confession Post</div>
                  </div>
                  <div>
                    <div className="font-bold">2-5 Bytes</div>
                    <div className="text-sm text-gray-600">Reactions</div>
                  </div>
                  <div>
                    <div className="font-bold">50 Bytes</div>
                    <div className="text-sm text-gray-600">Streak Bonus</div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <a href="/byte-shop">Explore Byte Shop</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Feature Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Confession Cards</h3>
                <p className="text-gray-600 mb-4">Anonymous wounds transformed into viral-ready pain content</p>
                <Button asChild className="w-full bg-red-500 hover:bg-red-600">
                  <a href="/wall-enhanced">Share Your Wound</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">System Check</h3>
                <p className="text-gray-600 mb-4">Discover your attachment archetype through brutal honesty</p>
                <Button asChild className="w-full bg-purple-500 hover:bg-purple-600">
                  <a href="/onboarding-quiz">Scan Vulnerabilities</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <Coins className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Byte Economy</h3>
                <p className="text-gray-600 mb-4">Quantified emotional labor with tangible rewards</p>
                <Button asChild className="w-full bg-blue-500 hover:bg-blue-600">
                  <a href="/byte-shop">Start Shopping</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Virality Features */}
          <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Built for Virality</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <Share className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-bold">Redacted Shares</h4>
                  <p className="text-sm text-gray-600">Black box graphics with tap-to-reveal inside platform</p>
                </div>
                <div className="text-center">
                  <Flame className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <h4 className="font-bold">Daily Brutal</h4>
                  <p className="text-sm text-gray-600">Auto-curated most brutal confession of the day</p>
                </div>
                <div className="text-center">
                  <Ghost className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <h4 className="font-bold">Anonymous Voyeurism</h4>
                  <p className="text-sm text-gray-600">No usernames, no replies, pure resonance</p>
                </div>
                <div className="text-center">
                  <Download className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-bold">One-Click Export</h4>
                  <p className="text-sm text-gray-600">Instagram Story, Twitter, PNG download ready</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Final CTA */}
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              The Wall of Wounds Revolution is Here
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-3xl mx-auto">
              Experience the perfect synthesis of anonymous trauma sharing, viral content creation, 
              and quantified emotional healing. Every wound becomes a beautiful, shareable piece of art.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700">
                <a href="/wall-enhanced">Enter the Wall</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/system-showcase">View Full Platform</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  )
}
