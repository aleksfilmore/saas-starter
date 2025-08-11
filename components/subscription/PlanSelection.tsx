'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Ghost, Zap, Shield, Brain, Users, Heart } from 'lucide-react'
import { SUBSCRIPTION_PLANS } from '@/lib/stripe/config'

interface PlanSelectionProps {
  onPlanSelect: (plan: 'FREE' | 'PREMIUM') => void
  selectedPlan?: 'FREE' | 'PREMIUM'
  showTitle?: boolean
  className?: string
}

export default function PlanSelection({ 
  onPlanSelect, 
  selectedPlan = 'FREE',
  showTitle = true,
  className = ""
}: PlanSelectionProps) {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  const plans = [
    {
      key: 'FREE' as const,
      icon: Ghost,
      iconColor: 'text-gray-400',
      bgGradient: 'from-gray-800 to-gray-900',
      borderColor: 'border-gray-600',
      hoverBorder: 'hover:border-gray-500',
      plan: SUBSCRIPTION_PLANS.FREE,
      popular: false
    },
    {
      key: 'PREMIUM' as const,
      icon: Crown,
      iconColor: 'text-yellow-400',
      bgGradient: 'from-purple-900 to-pink-900',
      borderColor: 'border-purple-500',
      hoverBorder: 'hover:border-purple-400',
      plan: SUBSCRIPTION_PLANS.PREMIUM,
      popular: true
    }
  ]

  return (
    <div className={className}>
      {showTitle && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Choose Your Journey</h2>
          <p className="text-gray-300">Start free, upgrade anytime to unlock your full potential</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map(({ key, icon: Icon, iconColor, bgGradient, borderColor, hoverBorder, plan, popular }) => (
          <Card
            key={key}
            className={`
              relative cursor-pointer transition-all duration-300
              bg-gradient-to-br ${bgGradient}
              border-2 ${selectedPlan === key ? 'border-purple-400 ring-2 ring-purple-400/50' : borderColor}
              ${hoverBorder} hover:shadow-xl hover:scale-105
              ${hoveredPlan === key ? 'shadow-2xl' : ''}
            `}
            onClick={() => onPlanSelect(key)}
            onMouseEnter={() => setHoveredPlan(key)}
            onMouseLeave={() => setHoveredPlan(null)}
          >
            {popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1">
                  🔥 Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-3">
                <div className={`w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-white flex items-center justify-center gap-2">
                {plan.name}
                {selectedPlan === key && <Check className="h-5 w-5 text-green-400" />}
              </CardTitle>
              <div className="flex items-center justify-center gap-1">
                <span className="text-3xl font-bold text-white">
                  ${key === 'FREE' ? '0' : plan.price}
                </span>
                {key === 'PREMIUM' && <span className="text-gray-300">/month</span>}
              </div>
              <CardDescription className="text-gray-300 mt-2">
                {plan.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {key === 'FREE' && (
                <div className="mt-6 p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Zap className="h-4 w-4" />
                    <span>Perfect for getting started</span>
                  </div>
                </div>
              )}

              {key === 'PREMIUM' && (
                <div className="mt-6 space-y-3">
                  <div className="p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
                    <div className="flex items-center gap-2 text-purple-300 text-sm mb-2">
                      <Brain className="h-4 w-4" />
                      <span className="font-medium">AI-Powered Features</span>
                    </div>
                    <ul className="text-xs text-purple-200 space-y-1">
                      <li>• 1,000 AI therapy messages/month</li>
                      <li>• Voice therapy sessions available</li>
                      <li>• Advanced personalization</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-pink-900/30 rounded-lg border border-pink-500/30">
                    <div className="flex items-center gap-2 text-pink-300 text-sm mb-2">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">Community Features</span>
                    </div>
                    <ul className="text-xs text-pink-200 space-y-1">
                      <li>• Wall of Wounds™ posting</li>
                      <li>• Edit & delete posts</li>
                      <li>• Connect with others safely</li>
                    </ul>
                  </div>
                </div>
              )}

              <Button
                className={`
                  w-full mt-6 font-medium
                  ${selectedPlan === key 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : key === 'PREMIUM'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }
                `}
                onClick={() => onPlanSelect(key)}
              >
                {selectedPlan === key ? (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Selected
                  </div>
                ) : (
                  `Choose ${plan.name.split(' ')[1]} Mode`
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-4 py-2 rounded-full">
          <Shield className="h-4 w-4" />
          <span>Cancel anytime • No hidden fees</span>
        </div>
      </div>
    </div>
  )
}
