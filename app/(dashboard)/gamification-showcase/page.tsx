import React from 'react'
import AuthWrapper from '@/components/AuthWrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Trophy, 
  Star, 
  Coins, 
  Target, 
  Zap, 
  Crown, 
  Shield,
  ArrowRight,
  Sparkles,
  HeartPulse,
  Lock,
  Circle
} from 'lucide-react'

export default function GamificationShowcase() {
  const avatarPreview = [
    { name: 'Circuit Heart', icon: HeartPulse, rarity: 'bronze', unlocked: true },
    { name: 'Firewall Mask', icon: Shield, rarity: 'bronze', unlocked: true },
    { name: 'Byte Beast', icon: Crown, rarity: 'gold', unlocked: false }
  ]

  const badgePreview = [
    { name: 'First Blood', progress: 100, bytes: 50, rarity: 'bronze' },
    { name: 'Block & Blessed', progress: 100, bytes: 75, rarity: 'bronze' },
    { name: 'Firewall Ignition', progress: 50, bytes: 120, rarity: 'silver' }
  ]

  const userStats = {
    totalBytes: 487,
    unlockedAvatars: 3,
    unlockedBadges: 2,
    currentStreak: 7,
    lifetimeXP: 1250
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Hero Section */}
          <div className="text-center py-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Gamification Engine
            </h1>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Transform Pain into Progress
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Every step of your healing journey is quantified, rewarded, and celebrated. 
              Build your digital identity while earning tangible progress toward emotional freedom.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge className="bg-purple-100 text-purple-800 border-purple-300 px-4 py-2 text-lg">
                🎭 Avatar Identity System
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-300 px-4 py-2 text-lg">
                🏆 Achievement Badges
              </Badge>
              <Badge className="bg-pink-100 text-pink-800 border-pink-300 px-4 py-2 text-lg">
                💰 Byte Economy
              </Badge>
            </div>
          </div>

          {/* Current Progress Overview */}
          <Card className="bg-gradient-to-r from-gray-900 to-black text-white">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Your Warrior Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-yellow-400">{userStats.totalBytes}</div>
                  <div className="text-sm text-gray-300">Bytes Earned</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400">{userStats.unlockedAvatars}</div>
                  <div className="text-sm text-gray-300">Avatars Unlocked</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400">{userStats.unlockedBadges}</div>
                  <div className="text-sm text-gray-300">Badges Earned</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-400">{userStats.currentStreak}</div>
                  <div className="text-sm text-gray-300">Day Streak</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400">{userStats.lifetimeXP}</div>
                  <div className="text-sm text-gray-300">Lifetime XP</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avatar System Preview */}
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="text-2xl text-center flex items-center justify-center space-x-2">
                <User className="h-6 w-6 text-purple-600" />
                <span>Avatar Identity System</span>
              </CardTitle>
              <CardDescription className="text-center text-lg">
                Express your emotional archetype through 10 unique glitch-coded avatars
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {avatarPreview.map((avatar, index) => {
                  const IconComponent = avatar.icon
                  return (
                    <div key={index} className={`p-4 rounded-lg border-2 text-center ${
                      avatar.unlocked ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200 opacity-60'
                    }`}>
                      <div className="flex justify-center mb-3">
                        <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                          avatar.rarity === 'bronze' ? 'bg-orange-100 border-2 border-orange-600' :
                          avatar.rarity === 'silver' ? 'bg-gray-100 border-2 border-gray-400' :
                          avatar.rarity === 'gold' ? 'bg-yellow-100 border-2 border-yellow-500' :
                          'bg-red-100 border-2 border-red-600'
                        }`}>
                          <IconComponent className={`h-8 w-8 ${
                            avatar.rarity === 'bronze' ? 'text-orange-600' :
                            avatar.rarity === 'silver' ? 'text-gray-600' :
                            avatar.rarity === 'gold' ? 'text-yellow-600' :
                            'text-red-600'
                          }`} />
                        </div>
                      </div>
                      <h4 className="font-medium mb-2">{avatar.name}</h4>
                      <Badge className={`text-xs ${
                        avatar.rarity === 'bronze' ? 'bg-orange-100 text-orange-800' :
                        avatar.rarity === 'silver' ? 'bg-gray-100 text-gray-800' :
                        avatar.rarity === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {avatar.rarity.toUpperCase()}
                      </Badge>
                      {!avatar.unlocked && (
                        <div className="mt-2">
                          <Lock className="h-4 w-4 text-gray-400 mx-auto" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 mb-6">
                <h4 className="font-bold text-center mb-4">Avatar Features</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                  <div>
                    <Circle className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <div className="font-medium">Glitch Effects</div>
                    <div className="text-gray-600">SVG filters & animations</div>
                  </div>
                  <div>
                    <Sparkles className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="font-medium">Cosmetic Frames</div>
                    <div className="text-gray-600">Purchasable with Bytes</div>
                  </div>
                  <div>
                    <Target className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <div className="font-medium">Archetype Match</div>
                    <div className="text-gray-600">Based on attachment style</div>
                  </div>
                  <div>
                    <Star className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                    <div className="font-medium">Rarity Tiers</div>
                    <div className="text-gray-600">Bronze → Gold → Crimson</div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <a href="/avatar-system">Customize Your Avatar</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Badge System Preview */}
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl text-center flex items-center justify-center space-x-2">
                <Trophy className="h-6 w-6 text-blue-600" />
                <span>Achievement Badge System</span>
              </CardTitle>
              <CardDescription className="text-center text-lg">
                Unlock 15 glitch trophies through healing milestones and emotional victories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {badgePreview.map((badge, index) => (
                  <div key={index} className={`p-4 rounded-lg border-2 ${
                    badge.progress === 100 ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        badge.rarity === 'bronze' ? 'bg-orange-100 border-2 border-orange-600' :
                        badge.rarity === 'silver' ? 'bg-gray-100 border-2 border-gray-400' :
                        'bg-yellow-100 border-2 border-yellow-500'
                      }`}>
                        <Trophy className={`h-6 w-6 ${
                          badge.rarity === 'bronze' ? 'text-orange-600' :
                          badge.rarity === 'silver' ? 'text-gray-600' :
                          'text-yellow-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{badge.name}</h4>
                        <div className="flex items-center space-x-1">
                          <Coins className="h-3 w-3 text-yellow-500" />
                          <span className="text-sm">+{badge.bytes} Bytes</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Progress</span>
                        <span>{badge.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            badge.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${badge.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-lg p-6 mb-6">
                <h4 className="font-bold text-center mb-4">Badge Categories</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                  <div>
                    <Zap className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="font-medium">Ritual Mastery</div>
                    <div className="text-gray-600">Daily protocol completion</div>
                  </div>
                  <div>
                    <Shield className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <div className="font-medium">No-Contact Streaks</div>
                    <div className="text-gray-600">Firewall maintenance</div>
                  </div>
                  <div>
                    <Crown className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <div className="font-medium">Social Victory</div>
                    <div className="text-gray-600">Wall viral achievements</div>
                  </div>
                  <div>
                    <Star className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                    <div className="font-medium">Milestone Rewards</div>
                    <div className="text-gray-600">Lifetime progress</div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <a href="/badge-system">View Achievement Progress</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Byte Economy Integration */}
          <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Byte Economy Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold mb-4 flex items-center space-x-2">
                    <Coins className="h-5 w-5 text-yellow-600" />
                    <span>Earning Opportunities</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Daily Ritual Completion</span>
                      <span className="font-medium">10-20 Bytes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Badge Unlocks</span>
                      <span className="font-medium">40-150 Bytes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wall Confession Posts</span>
                      <span className="font-medium">10 Bytes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Streak Bonuses</span>
                      <span className="font-medium">50 Bytes</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold mb-4 flex items-center space-x-2">
                    <Star className="h-5 w-5 text-purple-600" />
                    <span>Spending Options</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Cosmetic Frames</span>
                      <span className="font-medium">100-300 Bytes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Voice AI Sessions</span>
                      <span className="font-medium">500 Bytes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Animated Badge Overlays</span>
                      <span className="font-medium">400+ Bytes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mystery Loot Crates</span>
                      <span className="font-medium">300 Bytes</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Your Journey Awaits
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-3xl mx-auto">
              Every confession posted, every ritual completed, every day of no-contact maintained 
              contributes to your growing legend. Start building your digital warrior identity today.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <a href="/avatar-system">Choose Your Avatar</a>
              </Button>
              <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                <a href="/badge-system">Unlock Achievements</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  )
}
