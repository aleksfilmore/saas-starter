'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Scissors, 
  Slash, 
  MailX, 
  Moon, 
  Crown, 
  Shield, 
  Wallet, 
  Mic, 
  Flag, 
  GhostIcon,
  Users,
  Megaphone,
  Zap,
  Lock,
  Clock,
  Trophy,
  Star,
  Coins,
  Sparkles
} from 'lucide-react'

// Badge Rack α – Glitch Trophies
const badgeRack = [
  {
    id: 'first-blood',
    name: 'First Blood',
    icon: Scissors,
    unlockTrigger: 'Delete first photo of ex',
    byteValue: 50,
    rarity: 'bronze',
    unlocked: true,
    equipped: false
  },
  {
    id: 'block-blessed',
    name: 'Block & Blessed',
    icon: Slash,
    unlockTrigger: 'Block contact + 24h no unblock',
    byteValue: 75,
    rarity: 'bronze',
    unlocked: true,
    equipped: true
  },
  {
    id: 'inbox-silencer',
    name: 'Inbox Silencer',
    icon: MailX,
    unlockTrigger: 'Zero drunk texts for 7 days',
    byteValue: 60,
    rarity: 'bronze',
    unlocked: false,
    equipped: false
  },
  {
    id: 'soft-resetter',
    name: 'Soft Resetter',
    icon: Moon,
    unlockTrigger: 'Complete 5 Soft Reset rituals',
    byteValue: 40,
    rarity: 'bronze',
    unlocked: true,
    equipped: false
  },
  {
    id: 'petty-royalty',
    name: 'Petty Royalty',
    icon: Crown,
    unlockTrigger: 'Top reaction on Wall this week',
    byteValue: 100,
    rarity: 'silver',
    unlocked: false,
    equipped: false
  },
  {
    id: 'firewall-ignition',
    name: 'Firewall Ignition',
    icon: Shield,
    unlockTrigger: '14-day no-contact streak',
    byteValue: 120,
    rarity: 'silver',
    unlocked: false,
    equipped: false
  },
  {
    id: 'byte-millionaire',
    name: 'Byte Millionaire',
    icon: Wallet,
    unlockTrigger: 'Accumulate 1,000 Bytes lifetime',
    byteValue: 0, // Cosmetic shop discount instead
    rarity: 'gold',
    unlocked: false,
    equipped: false,
    specialReward: 'Cosmetic shop discount'
  },
  {
    id: 'oracle-whisperer',
    name: 'Oracle Whisperer',
    icon: Mic,
    unlockTrigger: 'Finish first voice session',
    byteValue: 80,
    rarity: 'bronze',
    unlocked: false,
    equipped: false
  },
  {
    id: 'red-flag-bingo',
    name: 'Red Flag Bingo Champ',
    icon: Flag,
    unlockTrigger: 'Submit card with 6 flags ticked',
    byteValue: 70,
    rarity: 'silver',
    unlocked: false,
    equipped: false
  },
  {
    id: 'ghostbuster',
    name: 'Ghostbuster',
    icon: GhostIcon,
    unlockTrigger: 'Remove ex from last social feed',
    byteValue: 90,
    rarity: 'silver',
    unlocked: false,
    equipped: false
  },
  {
    id: 'cult-recruiter',
    name: 'Cult Recruiter',
    icon: Users,
    unlockTrigger: 'Refer 3 new users',
    byteValue: 100,
    rarity: 'gold',
    unlocked: false,
    equipped: false
  },
  {
    id: 'confession-day',
    name: 'Confession of the Day',
    icon: Megaphone,
    unlockTrigger: 'Wall post hits 200 reactions',
    byteValue: 0, // Badge only
    rarity: 'gold',
    unlocked: false,
    equipped: false,
    badgeOnly: true
  },
  {
    id: 'glitch-surgeon',
    name: 'Glitch Surgeon',
    icon: Zap,
    unlockTrigger: 'Report & auto-flag self-harm post',
    byteValue: 0,
    rarity: 'crimson',
    unlocked: false,
    equipped: false,
    modOnly: true
  },
  {
    id: 'secure-node',
    name: 'Secure Node',
    icon: Lock,
    unlockTrigger: '30 days clean + daily login',
    byteValue: 150,
    rarity: 'gold',
    unlocked: false,
    equipped: false
  },
  {
    id: 'beta-relic',
    name: 'Beta Relic',
    icon: Clock,
    unlockTrigger: 'Joined before public launch',
    byteValue: 0,
    rarity: 'crimson',
    unlocked: false,
    equipped: false,
    foundersCosmetic: true
  }
]

// User progress and stats (would come from backend)
const userStats = {
  totalBytesEarned: 487,
  unlockedBadges: ['first-blood', 'block-blessed', 'soft-resetter'],
  equippedBadge: 'block-blessed',
  streakDays: 7,
  wallReactions: 156,
  ritualCount: 12
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'bronze': return 'border-orange-600 bg-orange-50'
    case 'silver': return 'border-gray-400 bg-gray-50'
    case 'gold': return 'border-yellow-500 bg-yellow-50'
    case 'crimson': return 'border-red-600 bg-red-50'
    default: return 'border-gray-300 bg-gray-50'
  }
}

const getRarityText = (rarity: string) => {
  switch (rarity) {
    case 'bronze': return 'text-orange-600'
    case 'silver': return 'text-gray-600'
    case 'gold': return 'text-yellow-600'
    case 'crimson': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

const getProgressForBadge = (badge: any) => {
  switch (badge.id) {
    case 'firewall-ignition':
      return `${userStats.streakDays}/14 days`
    case 'byte-millionaire':
      return `${userStats.totalBytesEarned}/1000 Bytes`
    case 'confession-day':
      return `${userStats.wallReactions}/200 reactions`
    case 'secure-node':
      return `${userStats.streakDays}/30 days`
    default:
      return null
  }
}

export default function BadgeSystem() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [equippedBadge, setEquippedBadge] = useState(userStats.equippedBadge)

  const categories = [
    { id: 'all', name: 'All Badges', count: badgeRack.length },
    { id: 'unlocked', name: 'Unlocked', count: userStats.unlockedBadges.length },
    { id: 'bronze', name: 'Bronze', count: badgeRack.filter(b => b.rarity === 'bronze').length },
    { id: 'silver', name: 'Silver', count: badgeRack.filter(b => b.rarity === 'silver').length },
    { id: 'gold', name: 'Gold', count: badgeRack.filter(b => b.rarity === 'gold').length },
    { id: 'crimson', name: 'Crimson', count: badgeRack.filter(b => b.rarity === 'crimson').length }
  ]

  const getFilteredBadges = () => {
    if (selectedCategory === 'all') return badgeRack
    if (selectedCategory === 'unlocked') return badgeRack.filter(b => userStats.unlockedBadges.includes(b.id))
    return badgeRack.filter(b => b.rarity === selectedCategory)
  }

  const handleEquipBadge = (badgeId: string) => {
    if (userStats.unlockedBadges.includes(badgeId)) {
      setEquippedBadge(equippedBadge === badgeId ? '' : badgeId)
    }
  }

  const renderBadge = (badge: any, size: 'small' | 'large' = 'small') => {
    const IconComponent = badge.icon
    const sizeClass = size === 'large' ? 'h-12 w-12' : 'h-6 w-6'
    const containerSize = size === 'large' ? 'h-16 w-16' : 'h-10 w-10'
    
    return (
      <div className={`${containerSize} relative flex items-center justify-center rounded-full ${getRarityColor(badge.rarity)} border-2 animate-hover-glow`}>
        <IconComponent className={`${sizeClass} ${getRarityText(badge.rarity)}`} />
        {badge.equipped && (
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <Star className="h-2 w-2 text-white" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Equipped Badge Display */}
      <Card className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Currently Equipped Badge</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {equippedBadge ? (
            <>
              <div className="flex justify-center">
                {renderBadge(badgeRack.find(b => b.id === equippedBadge), 'large')}
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {badgeRack.find(b => b.id === equippedBadge)?.name}
                </h3>
                <p className="text-gray-300">
                  {badgeRack.find(b => b.id === equippedBadge)?.unlockTrigger}
                </p>
                <Badge className={`mt-2 ${getRarityColor(badgeRack.find(b => b.id === equippedBadge)?.rarity || 'bronze')}`}>
                  <span className={getRarityText(badgeRack.find(b => b.id === equippedBadge)?.rarity || 'bronze')}>
                    {(badgeRack.find(b => b.id === equippedBadge)?.rarity || 'bronze').toUpperCase()}
                  </span>
                </Badge>
              </div>
            </>
          ) : (
            <div className="text-gray-400">
              <Trophy className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>No badge equipped</p>
              <p className="text-sm">Select a badge below to equip it</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Badge Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Badge Collection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-2"
              >
                <span>{category.name}</span>
                <Badge variant="secondary" className="ml-1">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badge Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>Badge Rack α – Glitch Trophies</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredBadges().map((badge) => {
              const isUnlocked = userStats.unlockedBadges.includes(badge.id)
              const isEquipped = equippedBadge === badge.id
              const progress = getProgressForBadge(badge)
              
              return (
                <div
                  key={badge.id}
                  className={`p-4 border-2 rounded-lg transition-all duration-300 cursor-pointer ${
                    isEquipped ? 'border-green-500 bg-green-50' :
                    isUnlocked ? 'border-gray-300 hover:border-gray-400 bg-white hover:shadow-md' :
                    'border-gray-200 bg-gray-100 opacity-75'
                  } ${getRarityColor(badge.rarity)}`}
                  onClick={() => handleEquipBadge(badge.id)}
                >
                  <div className="space-y-3">
                    
                    {/* Badge Icon and Name */}
                    <div className="flex items-center space-x-3">
                      {renderBadge(badge)}
                      <div className="flex-1">
                        <h4 className="font-medium">{badge.name}</h4>
                        <Badge className={`text-xs ${getRarityColor(badge.rarity)}`}>
                          <span className={getRarityText(badge.rarity)}>
                            {badge.rarity.toUpperCase()}
                          </span>
                        </Badge>
                      </div>
                      {isEquipped && (
                        <Star className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    
                    {/* Unlock Trigger */}
                    <p className="text-sm text-gray-600">
                      {badge.unlockTrigger}
                    </p>
                    
                    {/* Progress Bar */}
                    {progress && !isUnlocked && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Progress</span>
                          <span>{progress}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: badge.id === 'firewall-ignition' ? `${(userStats.streakDays / 14) * 100}%` :
                                     badge.id === 'byte-millionaire' ? `${(userStats.totalBytesEarned / 1000) * 100}%` :
                                     badge.id === 'confession-day' ? `${(userStats.wallReactions / 200) * 100}%` :
                                     badge.id === 'secure-node' ? `${(userStats.streakDays / 30) * 100}%` :
                                     '0%'
                            }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Rewards */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {badge.byteValue > 0 && (
                          <>
                            <Coins className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">+{badge.byteValue} Bytes</span>
                          </>
                        )}
                        {badge.specialReward && (
                          <Badge className="bg-purple-100 text-purple-800 text-xs">
                            {badge.specialReward}
                          </Badge>
                        )}
                        {badge.badgeOnly && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            Badge Only
                          </Badge>
                        )}
                        {badge.modOnly && (
                          <Badge className="bg-red-100 text-red-800 text-xs">
                            Mod Only
                          </Badge>
                        )}
                        {badge.foundersCosmetic && (
                          <Badge className="bg-gold-100 text-gold-800 text-xs">
                            Founder's Frame
                          </Badge>
                        )}
                      </div>
                      
                      {!isUnlocked && (
                        <Lock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    
                    {/* Equip Button */}
                    {isUnlocked && (
                      <Button 
                        size="sm" 
                        variant={isEquipped ? "secondary" : "outline"}
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEquipBadge(badge.id)
                        }}
                      >
                        {isEquipped ? 'Equipped' : 'Equip Badge'}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* User Stats Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>Your Achievement Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userStats.unlockedBadges.length}</div>
              <div className="text-sm text-gray-600">Badges Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userStats.totalBytesEarned}</div>
              <div className="text-sm text-gray-600">Total Bytes Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userStats.streakDays}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{userStats.wallReactions}</div>
              <div className="text-sm text-gray-600">Wall Reactions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes hover-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
        }
        
        .animate-hover-glow:hover {
          animation: hover-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
