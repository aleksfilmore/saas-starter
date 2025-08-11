"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Flame, 
  Trash2, 
  Sparkles, 
  RefreshCw, 
  Ghost, 
  User, 
  RotateCcw, 
  Users, 
  Lock,
  Star,
  Clock,
  Zap
} from 'lucide-react'
import { RITUAL_CATEGORIES, RITUAL_BANK, getRitualsByTier, type Ritual, type RitualCategory } from '@/lib/rituals/ritual-bank'

interface RitualLibraryProps {
  userTier: 'ghost' | 'firewall'
  onStartRitual?: (ritual: Ritual) => void
}

const categoryIcons = {
  'grief-cycle': Flame,
  'petty-purge': Trash2,
  'glow-up-forge': Sparkles,
  'reframe-loop': RefreshCw,
  'ghost-cleanse': Ghost,
  'public-face': User,
  'soft-reset': RotateCcw,
  'cult-missions': Users
}

export default function RitualLibrary({ userTier, onStartRitual }: RitualLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<RitualCategory>('grief-cycle')
  
  // Filter rituals by tier hierarchy
  const getUserRitualsByTier = (tier: 'ghost' | 'firewall') => {
    const tierHierarchy = { 'ghost': 0, 'firewall': 1 }
    const userTierLevel = tierHierarchy[tier]
    
    return RITUAL_BANK.filter(ritual => {
      const ritualTierLevel = tierHierarchy[ritual.tier]
      return ritualTierLevel <= userTierLevel
    })
  }
  
  const userRituals = getUserRitualsByTier(userTier)
  const categoryRituals = userRituals.filter((ritual: Ritual) => ritual.category === selectedCategory)
  const totalRituals = RITUAL_BANK.length
  const unlockedRituals = userRituals.length
  const progressPercentage = (unlockedRituals / totalRituals) * 100

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'ghost': return 'bg-gray-100 text-gray-800'
      case 'firewall': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const canAccessRitual = (ritual: Ritual) => {
    const tierHierarchy = { 'ghost': 0, 'firewall': 1 }
    return tierHierarchy[userTier] >= tierHierarchy[ritual.tier]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Ritual Library
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover powerful healing rituals designed to guide you through emotional transformation. 
          Each category targets specific aspects of your healing journey.
        </p>
        
        {/* Progress Overview */}
        <Card className="max-w-md mx-auto">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Rituals Unlocked</span>
                <span className="font-semibold">{unlockedRituals}/{totalRituals}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <Badge className={`mx-auto block w-fit ${getTierBadgeColor(userTier)}`}>
                {userTier.toUpperCase()} TIER
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Navigation */}
      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as RitualCategory)}>
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
          {Object.keys(RITUAL_CATEGORIES).map((category) => {
            const Icon = categoryIcons[category as RitualCategory]
            const config = RITUAL_CATEGORIES[category as RitualCategory]
            return (
              <TabsTrigger
                key={category}
                value={category}
                className="flex flex-col items-center gap-1 text-xs"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{config.title}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* Category Content */}
        {Object.keys(RITUAL_CATEGORIES).map((category) => {
          const config = RITUAL_CATEGORIES[category as RitualCategory]
          const Icon = categoryIcons[category as RitualCategory]
          const rituals = userRituals.filter((ritual: Ritual) => ritual.category === category)
          
          return (
            <TabsContent key={category} value={category} className="space-y-6">
              {/* Category Header */}
              <Card className="border-2 border-dashed border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-blue-600" />
                    {config.title}
                    <Badge variant="outline">{config.subtitle}</Badge>
                  </CardTitle>
                  <CardDescription className="text-base">
                    {config.description}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Rituals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rituals.map((ritual: Ritual) => {
                  const isAccessible = canAccessRitual(ritual)
                  
                  return (
                    <Card 
                      key={ritual.id} 
                      className={`transition-all duration-200 ${
                        isAccessible 
                          ? 'hover:shadow-lg hover:scale-105 cursor-pointer' 
                          : 'opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg leading-tight">
                            {ritual.title}
                          </CardTitle>
                          {!isAccessible && <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{ritual.estimatedTime}</span>
                          <Badge className={getTierBadgeColor(ritual.tier)} variant="outline">
                            {ritual.tier}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {ritual.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Zap className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">+{ritual.xpReward} XP</span>
                            <span className="text-gray-400">|</span>
                            <span className="font-medium">+{ritual.byteReward} bytes</span>
                          </div>
                          
                          {ritual.tags && (
                            <div className="flex flex-wrap gap-1">
                              {ritual.tags.slice(0, 3).map((tag: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {ritual.tags.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{ritual.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        <Button 
                          className="w-full" 
                          onClick={() => isAccessible && onStartRitual?.(ritual)}
                          disabled={!isAccessible}
                          variant={isAccessible ? "default" : "secondary"}
                        >
                          {isAccessible ? "Start Ritual" : "Upgrade to Unlock"}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* No Rituals Available */}
              {rituals.length === 0 && (
                <Card className="text-center py-8">
                  <CardContent>
                    <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Rituals Available</h3>
                    <p className="text-gray-600 mb-4">
                      Upgrade your tier to unlock powerful {config.title.toLowerCase()} rituals.
                    </p>
                    <Button variant="outline">Upgrade Now</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
