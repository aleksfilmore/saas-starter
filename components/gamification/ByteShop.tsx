"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Mic, 
  Palette, 
  Brain, 
  Award, 
  Gift, 
  Zap, 
  Star,
  ShoppingCart,
  Coins,
  Crown,
  Headphones,
  Sparkles,
  Shield,
  Heart,
  Eye,
  Dice1
} from 'lucide-react'

interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  category: 'voice' | 'cosmetic' | 'therapy' | 'badges' | 'mystery'
  icon: React.ReactNode
  rarity?: 'common' | 'rare' | 'legendary'
  isUnlocked?: boolean
  requirements?: string
}

interface UserProgress {
  bytes: number
  xp: number
  tier: 'ghost' | 'firewall' | 'deep-reset'
  unlockedItems: string[]
  equippedBadge?: string
}

const shopItems: ShopItem[] = [
  // Voice Sessions
  {
    id: 'emergency-oracle',
    name: 'Emergency Oracle Summon',
    description: 'One 15-min voice AI therapy session for crisis moments',
    price: 500,
    category: 'voice',
    icon: <Mic className="h-5 w-5" />,
    rarity: 'rare'
  },
  {
    id: 'soft-mode-tts',
    name: 'Soft Mode Reading',
    description: 'TTS voice playback of your daily ritual in soothing tones',
    price: 100,
    category: 'voice',
    icon: <Headphones className="h-5 w-5" />,
    rarity: 'common'
  },

  // Cosmetic Upgrades
  {
    id: 'petty-flame-theme',
    name: 'Petty Flame Red',
    description: 'Confession card theme with fiery red glitch aesthetics',
    price: 150,
    category: 'cosmetic',
    icon: <Palette className="h-5 w-5" />,
    rarity: 'common'
  },
  {
    id: 'muted-meltdown-theme',
    name: 'Muted Meltdown',
    description: 'Soft grayscale theme for when you\'re emotionally drained',
    price: 150,
    category: 'cosmetic',
    icon: <Palette className="h-5 w-5" />,
    rarity: 'common'
  },
  {
    id: 'vaporwave-vengeance',
    name: 'Vaporwave Vengeance',
    description: 'Neon pink & cyan aesthetic for maximum 80s spite energy',
    price: 150,
    category: 'cosmetic',
    icon: <Palette className="h-5 w-5" />,
    rarity: 'common'
  },
  {
    id: 'cult-initiate-halo',
    name: 'Cult Initiate Halo',
    description: 'Glowing avatar frame showing your dedication to the process',
    price: 100,
    category: 'cosmetic',
    icon: <Crown className="h-5 w-5" />,
    rarity: 'common'
  },
  {
    id: 'redacted-identity',
    name: 'Redacted Identity',
    description: 'Censored bar avatar frame for maximum mystery',
    price: 100,
    category: 'cosmetic',
    icon: <Eye className="h-5 w-5" />,
    rarity: 'common'
  },

  // Therapy Boosts
  {
    id: 'bonus-therapy-session',
    name: 'Bonus AI Therapy Session',
    description: 'Extra AI session credit beyond your tier limit',
    price: 400,
    category: 'therapy',
    icon: <Brain className="h-5 w-5" />,
    rarity: 'rare'
  },
  {
    id: 'deep-reset-pack',
    name: 'Deep Reset Ritual Pack',
    description: 'Unlocks 3 rare rituals from higher tiers temporarily',
    price: 250,
    category: 'therapy',
    icon: <Sparkles className="h-5 w-5" />,
    rarity: 'rare'
  },
  {
    id: 'insight-surge',
    name: 'Insight Surge',
    description: 'Your AI remembers context from your last session',
    price: 350,
    category: 'therapy',
    icon: <Zap className="h-5 w-5" />,
    rarity: 'rare'
  },

  // Status Badges
  {
    id: 'no-text-back',
    name: '"I Didn\'t Text Back Today"',
    description: 'Equippable badge showing your restraint mastery',
    price: 100,
    category: 'badges',
    icon: <Award className="h-5 w-5" />,
    rarity: 'common'
  },
  {
    id: 'soft-but-ruthless',
    name: '"Soft But Ruthless"',
    description: 'The ultimate contradiction badge',
    price: 100,
    category: 'badges',
    icon: <Heart className="h-5 w-5" />,
    rarity: 'common'
  },
  {
    id: 'clean-after-story',
    name: '"Still Clean After That Story View"',
    description: 'Badge for surviving the social media relapse trigger',
    price: 150,
    category: 'badges',
    icon: <Shield className="h-5 w-5" />,
    rarity: 'common'
  },
  {
    id: 'blocked-blessed',
    name: '"Blocked & Blessed"',
    description: 'Premium badge for ultimate boundary setting',
    price: 400,
    category: 'badges',
    icon: <Star className="h-5 w-5" />,
    rarity: 'legendary'
  },

  // Mystery Items
  {
    id: 'daily-spin',
    name: 'Daily Byte Spin',
    description: 'Random reward: XP, confession card, cosmetic, or mini-ritual',
    price: 50,
    category: 'mystery',
    icon: <Dice1 className="h-5 w-5" />,
    rarity: 'common'
  },
  {
    id: 'emotional-loot-crate',
    name: 'Emotional Loot Crate',
    description: 'Contains 1 rare ritual, 1 exclusive card theme, and a cursed compliment from your ex (AI-generated)',
    price: 300,
    category: 'mystery',
    icon: <Gift className="h-5 w-5" />,
    rarity: 'rare'
  }
]

const categoryInfo = {
  voice: {
    name: 'Voice Sessions',
    description: 'AI therapy and audio experiences',
    icon: <Mic className="h-5 w-5" />
  },
  cosmetic: {
    name: 'Cosmetic Upgrades',
    description: 'Themes, frames, and visual customization',
    icon: <Palette className="h-5 w-5" />
  },
  therapy: {
    name: 'Therapy Boosts',
    description: 'Enhanced healing sessions and ritual access',
    icon: <Brain className="h-5 w-5" />
  },
  badges: {
    name: 'Status Badges',
    description: 'Equippable achievements and identity markers',
    icon: <Award className="h-5 w-5" />
  },
  mystery: {
    name: 'Mystery Drops',
    description: 'Random rewards and surprise unlocks',
    icon: <Gift className="h-5 w-5" />
  }
}

interface ByteShopProps {
  userProgress: UserProgress
  onPurchase: (itemId: string, cost: number) => void
}

export default function ByteShop({ userProgress, onPurchase }: ByteShopProps) {
  const [activeCategory, setActiveCategory] = useState<keyof typeof categoryInfo>('voice')
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null)

  const handlePurchase = (item: ShopItem) => {
    if (userProgress.bytes >= item.price && !userProgress.unlockedItems.includes(item.id)) {
      onPurchase(item.id, item.price)
      setPurchaseSuccess(item.name)
      setTimeout(() => setPurchaseSuccess(null), 3000)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100'
      case 'rare': return 'text-blue-600 bg-blue-100'
      case 'legendary': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const canPurchase = (item: ShopItem) => {
    return userProgress.bytes >= item.price && !userProgress.unlockedItems.includes(item.id)
  }

  const isOwned = (item: ShopItem) => {
    return userProgress.unlockedItems.includes(item.id)
  }

  const filteredItems = shopItems.filter(item => item.category === activeCategory)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Byte Shop
        </h1>
        <p className="text-gray-600 text-lg">
          Emotional Reformat Emporium - Transform your bytes into healing power
        </p>
        
        {/* User Balance */}
        <Card className="max-w-md mx-auto">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Coins className="h-5 w-5 text-yellow-500" />
                <span className="font-bold text-lg">{userProgress.bytes.toLocaleString()} Bytes</span>
              </div>
              <Badge className="bg-purple-100 text-purple-800">
                {userProgress.tier.toUpperCase()} TIER
              </Badge>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Complete rituals and engage with the community to earn more bytes
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Message */}
      {purchaseSuccess && (
        <div className="max-w-md mx-auto">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-green-600 font-medium">
                ✅ Successfully purchased: {purchaseSuccess}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Category Navigation */}
      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as keyof typeof categoryInfo)}>
        <TabsList className="grid grid-cols-5 w-full">
          {Object.entries(categoryInfo).map(([key, info]) => (
            <TabsTrigger key={key} value={key} className="flex items-center space-x-2">
              {info.icon}
              <span className="hidden sm:inline">{info.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Category Content */}
        {Object.entries(categoryInfo).map(([categoryKey, categoryData]) => (
          <TabsContent key={categoryKey} value={categoryKey} className="space-y-6">
            {/* Category Header */}
            <Card className="border-2 border-dashed border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  {categoryData.icon}
                  <span>{categoryData.name}</span>
                </CardTitle>
                <CardDescription className="text-base">
                  {categoryData.description}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <Card 
                  key={item.id} 
                  className={`transition-all duration-200 ${
                    isOwned(item) 
                      ? 'bg-green-50 border-green-200' 
                      : canPurchase(item) 
                      ? 'hover:shadow-lg hover:scale-105 cursor-pointer' 
                      : 'opacity-60'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {item.icon}
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        {item.rarity && (
                          <Badge className={getRarityColor(item.rarity)} variant="outline">
                            {item.rarity}
                          </Badge>
                        )}
                        {isOwned(item) && (
                          <Badge className="bg-green-100 text-green-800">OWNED</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold">{item.price.toLocaleString()} Bytes</span>
                      </div>
                      
                      <Button 
                        onClick={() => handlePurchase(item)}
                        disabled={!canPurchase(item) || isOwned(item)}
                        variant={isOwned(item) ? "secondary" : canPurchase(item) ? "default" : "outline"}
                        size="sm"
                      >
                        {isOwned(item) ? (
                          <>
                            <Star className="h-4 w-4 mr-2" />
                            Owned
                          </>
                        ) : canPurchase(item) ? (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Buy Now
                          </>
                        ) : (
                          'Insufficient Bytes'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Byte Earning Guide */}
      <Card className="bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200">
        <CardHeader>
          <CardTitle className="text-center">How to Earn More Bytes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { action: 'Daily Ritual Completion', bytes: '10-20', icon: <Brain className="h-5 w-5" /> },
              { action: 'Confession Post', bytes: '10', icon: <Heart className="h-5 w-5" /> },
              { action: 'Reacting/Commenting', bytes: '2-5', icon: <Star className="h-5 w-5" /> },
              { action: 'Streak Milestone', bytes: '50', icon: <Zap className="h-5 w-5" /> }
            ].map((earning, index) => (
              <div key={index} className="text-center p-4 bg-white rounded-lg">
                <div className="text-purple-600 mx-auto mb-2">{earning.icon}</div>
                <h4 className="font-medium text-sm">{earning.action}</h4>
                <p className="text-xs text-gray-600">+{earning.bytes} Bytes</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
