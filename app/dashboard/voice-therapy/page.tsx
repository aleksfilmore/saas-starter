'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mic, MicOff, Clock, DollarSign, Lock, Crown } from 'lucide-react'

export default function VoiceTherapyPage() {
  const [user, setUser] = useState<any>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [subscription, setSubscription] = useState<string>('free')

  // Check user and subscription status
  useEffect(() => {
    const checkUserAndSubscription = async () => {
      try {
        const userResponse = await fetch('/api/user/me')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData)
        }
        
        const subResponse = await fetch('/api/user/subscription')
        if (subResponse.ok) {
          const subData = await subResponse.json()
          setSubscription(subData.subscription || 'free')
        }
      } catch (error) {
        console.error('Error checking user/subscription:', error)
      }
    }
    
    checkUserAndSubscription()
  }, [])

  // Premium-only gate with purchase option
  if (subscription !== 'premium') {
    const handlePurchaseSession = async () => {
      try {
        const response = await fetch('/api/stripe/voice-therapy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const { url } = await response.json();
          window.location.href = url;
        } else {
          console.error('Failed to create checkout session');
        }
      } catch (error) {
        console.error('Error purchasing voice therapy session:', error);
      }
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Mic className="w-8 h-8 text-violet-400" />
            Voice AI Therapy
          </h1>
          <p className="text-gray-300">Real-time voice sessions with AI - $9.99 per 15 minutes</p>
        </div>

        <Card className="dashboard-card p-8 text-center">
          <CardContent className="p-0">
            <div className="mb-6">
              <div className="p-6 rounded-full bg-violet-500/20 w-24 h-24 mx-auto flex items-center justify-center mb-4">
                <Mic className="w-12 h-12 text-violet-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Voice AI Therapy</h2>
              <p className="text-gray-300 mb-6">
                Experience real-time conversations with AI for personalized therapy sessions
              </p>
            </div>

            <div className="bg-violet-900/30 rounded-lg p-6 mb-6 border border-violet-500/30">
              <h3 className="font-semibold text-violet-300 mb-4">What's included in your session:</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <Mic className="w-5 h-5 text-violet-400" />
                  <span className="text-violet-200">15 minutes of real-time voice conversation</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-violet-400" />
                  <span className="text-violet-200">Professional AI therapy guidance</span>
                </div>
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-violet-400" />
                  <span className="text-violet-200">Personalized for your emotional archetype</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white text-lg py-3"
                onClick={handlePurchaseSession}
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Purchase Session - $9.99
              </Button>
              
              <Button 
                variant="outline"
                className="w-full border-violet-500/30 text-violet-300 hover:bg-violet-500/10"
                onClick={() => window.location.href = '/pricing'}
              >
                <Crown className="w-5 h-5 mr-2" />
                Get Premium (Includes Voice Therapy)
              </Button>
              
              <Button 
                variant="outline"
                className="w-full border-gray-500/30 text-gray-300 hover:bg-gray-500/10"
                onClick={() => window.location.href = '/ai-therapy'}
              >
                Try Text Therapy Instead
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Mic className="w-8 h-8 text-violet-400" />
          Voice AI Therapy
          <Badge className="bg-violet-500/20 text-violet-400">
            PREMIUM
          </Badge>
        </h1>
        <p className="text-gray-300">Real-time voice sessions with AI - $9.99 per 15 minutes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voice Session Card */}
        <Card className="dashboard-card p-6">
          <CardContent className="p-0">
            <h2 className="text-xl font-bold text-white mb-4">Voice Session</h2>
            
            <div className="space-y-4">
              <div className="bg-violet-900/30 rounded-lg p-4 border border-violet-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-violet-300">Session Time</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-violet-400" />
                    <span className="font-mono text-white">
                      {Math.floor(sessionTime / 60).toString().padStart(2, '0')}:{(sessionTime % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-violet-300">Current Cost</span>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="font-mono text-green-400">
                      ${((sessionTime / 60) * (9.99 / 15)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className={`w-full text-lg py-6 ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-gradient-to-r from-violet-500 to-purple-500'
                }`}
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-6 h-6 mr-2" />
                    Stop Session
                  </>
                ) : (
                  <>
                    <Mic className="w-6 h-6 mr-2" />
                    Start Voice Session
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Info Card */}
        <Card className="dashboard-card p-6">
          <CardContent className="p-0">
            <h2 className="text-xl font-bold text-white mb-4">Pricing & Usage</h2>
            
            <div className="space-y-4">
              <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
                <h3 className="font-semibold text-green-300 mb-2">Premium Voice Therapy</h3>
                <p className="text-green-200 text-sm mb-2">$9.99 per 15-minute session</p>
                <p className="text-green-200 text-xs">
                  Minute-based billing - only pay for what you use
                </p>
              </div>

              <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
                <h3 className="font-semibold text-blue-300 mb-2">Available Features</h3>
                <ul className="text-blue-200 text-sm space-y-1">
                  <li>• Real-time voice conversations</li>
                  <li>• All 5 AI therapy personas</li>
                  <li>• Secure & private sessions</li>
                  <li>• Session recordings (optional)</li>
                </ul>
              </div>

              <div className="bg-amber-900/30 rounded-lg p-4 border border-amber-500/30">
                <h3 className="font-semibold text-amber-300 mb-2">How It Works</h3>
                <p className="text-amber-200 text-sm">
                  Sessions are billed per minute. Minimum charge is 1 minute. 
                  You can end sessions anytime.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
