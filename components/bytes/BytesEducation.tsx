'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Coins, 
  Zap, 
  Calendar, 
  MessageSquare, 
  ThumbsUp, 
  Brain,
  Target,
  Clock,
  TrendingUp,
  Info,
  CheckCircle,
  Star,
  Gift
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BytesEducationProps {
  className?: string
  variant?: 'full' | 'compact' | 'modal'
}

const earningActivities = [
  {
    icon: <Calendar className="h-4 w-4" />,
    name: "Daily Rituals",
    amount: 8,
    frequency: "2x daily",
    description: "Complete your assigned healing rituals",
    color: "bg-green-500/20 text-green-400"
  },
  {
    icon: <MessageSquare className="h-4 w-4" />,
    name: "Daily Check-ins",
    amount: 4,
    frequency: "1x daily",
    description: "Share your mood and progress",
    color: "bg-blue-500/20 text-blue-400"
  },
  {
    icon: <MessageSquare className="h-4 w-4" />,
    name: "Wall Posts",
    amount: 4,
    frequency: "2x daily",
    description: "Support others in the community",
    color: "bg-purple-500/20 text-purple-400"
  },
  {
    icon: <ThumbsUp className="h-4 w-4" />,
    name: "Wall Reactions",
    amount: 1,
    frequency: "3x daily",
    description: "React to community posts",
    color: "bg-orange-500/20 text-orange-400"
  },
  {
    icon: <Brain className="h-4 w-4" />,
    name: "AI Therapy",
    amount: 8,
    frequency: "Weekly limit",
    description: "One byte reward per week",
    color: "bg-pink-500/20 text-pink-400"
  }
]

const spendingOptions = [
  {
    icon: <Brain className="h-4 w-4" />,
    name: "AI Therapy Messages",
    cost: 10,
    description: "Individual therapy session messages",
    color: "bg-purple-600"
  },
  {
    icon: <Gift className="h-4 w-4" />,
    name: "Premium Features",
    cost: 50,
    description: "Unlock special healing tools",
    color: "bg-blue-600"
  },
  {
    icon: <Star className="h-4 w-4" />,
    name: "Badge Boosts",
    cost: 25,
    description: "Accelerate badge progression",
    color: "bg-yellow-600"
  }
]

export function BytesEducation({ className = "", variant = "full" }: BytesEducationProps) {
  const [activeTab, setActiveTab] = useState<'earning' | 'spending' | 'tips'>('earning')

  const dailyMax = earningActivities.reduce((sum, activity) => {
    if (activity.name === "AI Therapy") return sum // Weekly limit
    const multiplier = activity.frequency.includes('2x') ? 2 : activity.frequency.includes('3x') ? 3 : 1
    return sum + (activity.amount * multiplier)
  }, 0)

  if (variant === 'compact') {
    return (
      <Card className={`bg-gray-800 border-gray-700 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-purple-400" />
              <h3 className="font-semibold text-white">Bytes Economy</h3>
            </div>
            <Badge className="bg-purple-600 text-white">
              ~{dailyMax}/day max
            </Badge>
          </div>
          <p className="text-sm text-gray-300 mb-3">
            Earn bytes through healing activities. Monthly cap: 1,000 bytes.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-green-400">📅 Rituals: 8B</div>
            <div className="text-blue-400">💭 Check-ins: 4B</div>
            <div className="text-purple-400">💬 Posts: 4B</div>
            <div className="text-orange-400">👍 Reactions: 1B</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Coins className="h-6 w-6 text-purple-400" />
            Bytes: Your Healing Currency
          </CardTitle>
          <Badge className="bg-purple-600 text-white">
            Max: 1,000/month
          </Badge>
        </div>
        <p className="text-gray-300 text-sm">
          Bytes are earned through healing activities and can be spent on premium features. 
          Our sustainable economy ensures fair access while supporting platform growth.
        </p>
      </CardHeader>

      <CardContent>
        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 bg-gray-700/50 rounded-lg p-1">
          {(['earning', 'spending', 'tips'] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 ${
                activeTab === tab 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {tab === 'earning' && <TrendingUp className="h-4 w-4 mr-1" />}
              {tab === 'spending' && <Zap className="h-4 w-4 mr-1" />}
              {tab === 'tips' && <Target className="h-4 w-4 mr-1" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'earning' && (
            <motion.div
              key="earning"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">How to Earn Bytes</h3>
                  <Badge className="bg-green-600 text-white">
                    ~{dailyMax} bytes/day
                  </Badge>
                </div>
                
                {earningActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${activity.color}`}>
                        {activity.icon}
                      </div>
                      <div>
                        <div className="font-medium text-white">{activity.name}</div>
                        <div className="text-sm text-gray-400">{activity.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-purple-400">+{activity.amount}B</div>
                      <div className="text-xs text-gray-400">{activity.frequency}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-400 mb-1">Monthly Cap Protection</h4>
                    <p className="text-sm text-gray-300">
                      Earnings are capped at 1,000 bytes per month to maintain a sustainable economy 
                      and ensure fair access for all users.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'spending' && (
            <motion.div
              key="spending"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-3 mb-6">
                <h3 className="text-lg font-semibold text-white">Ways to Spend Bytes</h3>
                
                {spendingOptions.map((option, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${option.color} text-white`}>
                        {option.icon}
                      </div>
                      <div>
                        <div className="font-medium text-white">{option.name}</div>
                        <div className="text-sm text-gray-400">{option.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-red-400">{option.cost}B</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-400 mb-1">Smart Spending</h4>
                    <p className="text-sm text-gray-300">
                      Bytes can also be purchased with real money if you need immediate access 
                      to premium features. Earned bytes never expire.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tips' && (
            <motion.div
              key="tips"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Maximizing Your Bytes</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <Clock className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">Daily Consistency</h4>
                      <p className="text-sm text-gray-400">
                        Complete rituals and check-ins daily for maximum byte earning potential.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">Community Engagement</h4>
                      <p className="text-sm text-gray-400">
                        Support others through wall posts and reactions - it counts towards your bytes!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <Brain className="h-5 w-5 text-pink-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">AI Therapy Timing</h4>
                      <p className="text-sm text-gray-400">
                        You can use AI therapy unlimited times, but byte rewards are limited to once per week.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <Target className="h-5 w-5 text-purple-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">Strategic Spending</h4>
                      <p className="text-sm text-gray-400">
                        Save bytes for features that truly enhance your healing journey.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

export default BytesEducation
