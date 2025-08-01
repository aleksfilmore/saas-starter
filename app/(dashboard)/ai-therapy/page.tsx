"use client"

import React, { useState, useRef, useEffect } from 'react'
import AuthWrapper from '@/components/AuthWrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff, 
  Clock, 
  Zap, 
  Crown,
  Shield,
  Heart,
  Brain,
  Sparkles,
  Lock
} from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  emotion?: 'supportive' | 'challenging' | 'empathetic' | 'insightful'
}

export default function AITherapyPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hey there, digital warrior. I'm here to help you process whatever's weighing on your system. What's running through your head right now?",
      sender: 'ai',
      timestamp: new Date(),
      emotion: 'supportive'
    }
  ])
  
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [userTier, setUserTier] = useState<'ghost' | 'firewall' | 'cult-leader'>('ghost')
  const [dailySessionsUsed, setDailySessionsUsed] = useState(0)
  const [dailyMessagesUsed, setDailyMessagesUsed] = useState(0)
  const [voiceMinutesRemaining, setVoiceMinutesRemaining] = useState(0)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Message limits by tier
  const tierLimits = {
    ghost: { textSessions: 1, dailyMessages: 50, voiceMinutes: 0, price: 'FREE' },
    firewall: { textSessions: 999, dailyMessages: 200, voiceMinutes: 0, price: '$19/mo' },
    'cult-leader': { textSessions: 999, dailyMessages: 500, voiceMinutes: 60, price: '$49/mo' }
  }

  // AI Response Generator
  const generateAIResponse = (userMessage: string): string => {
    const responses = {
      anxiety: [
        "That anxiety spiral is real. Your nervous system is just trying to protect you, even when the threat isn't actually there. What if we tried a quick grounding technique?",
        "I hear you. Anxiety loves to play the 'what if' game. But right now, in this moment, you're safe. Can you name 3 things you can see around you?"
      ],
      anger: [
        "That rage is valid data. Your system is telling you something important. Instead of suppressing it, what if we used it as fuel for change?",
        "Anger is just love with nowhere to go. What boundary got crossed here? What part of you is asking for protection?"
      ],
      sadness: [
        "Grief is love persisting. It's not something to fix, but something to honor. How can we sit with this feeling without drowning in it?",
        "That sadness is teaching you something about what matters to you. What is it trying to tell you?"
      ],
      breakthrough: [
        "Yes! That's the shift I was waiting for. You just rewired a neural pathway in real time. How does that awareness feel in your body?",
        "That insight is pure gold. Your healing brain just leveled up. What are you going to do with this new understanding?"
      ],
      default: [
        "Tell me more about that. What's underneath that feeling?",
        "I'm hearing you. What would it look like to approach this from a place of self-compassion?",
        "That's a lot to hold. What support do you need right now?",
        "Your emotional response makes complete sense. What would healing look like in this situation?"
      ]
    }

    // Simple keyword detection for response selection
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('worry') || lowerMessage.includes('panic')) {
      return responses.anxiety[Math.floor(Math.random() * responses.anxiety.length)]
    }
    if (lowerMessage.includes('angry') || lowerMessage.includes('mad') || lowerMessage.includes('pissed')) {
      return responses.anger[Math.floor(Math.random() * responses.anger.length)]
    }
    if (lowerMessage.includes('sad') || lowerMessage.includes('cry') || lowerMessage.includes('hurt')) {
      return responses.sadness[Math.floor(Math.random() * responses.sadness.length)]
    }
    if (lowerMessage.includes('understand') || lowerMessage.includes('realize') || lowerMessage.includes('see now')) {
      return responses.breakthrough[Math.floor(Math.random() * responses.breakthrough.length)]
    }
    
    return responses.default[Math.floor(Math.random() * responses.default.length)]
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Check daily message limits
    const currentLimit = tierLimits[userTier].dailyMessages
    if (dailyMessagesUsed >= currentLimit) {
      alert(`Daily message limit reached (${currentLimit}). Upgrade tier or spend 50 Bytes for 100 more messages.`)
      return
    }

    // Check session limits for ghost tier
    if (userTier === 'ghost' && dailySessionsUsed >= 1) {
      alert('Daily text therapy limit reached. Upgrade to Firewall ($19/mo) for unlimited sessions.')
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)
    setDailyMessagesUsed(prev => prev + 1)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date(),
        emotion: 'empathetic'
      }
      
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
      setDailyMessagesUsed(prev => prev + 1)
      
      // Update session count for ghost tier
      if (userTier === 'ghost') {
        setDailySessionsUsed(prev => prev + 1)
      }
    }, 1500)
  }

  const handleVoiceTherapy = () => {
    if (voiceMinutesRemaining > 0) {
      alert('Starting 15-minute Voice AI Therapy session...')
    } else {
      alert('Purchase 15-minute Voice AI Therapy session for $19.99?')
    }
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <Card className="bg-gradient-to-r from-purple-900 to-blue-900 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center space-x-2">
                    <Brain className="h-6 w-6" />
                    <span>AI Therapy Console</span>
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Your personal healing protocol powered by emotional AI
                  </CardDescription>
                </div>
                <div className="text-right">
                  <Badge className={`${
                    userTier === 'ghost' ? 'bg-gray-600' :
                    userTier === 'firewall' ? 'bg-orange-600' :
                    'bg-purple-600'
                  } text-white`}>
                    {userTier.toUpperCase()} TIER
                  </Badge>
                  <div className="text-sm text-purple-200 mt-1">
                    {tierLimits[userTier].price}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Message Limit Status */}
          <Card className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-orange-400">
                    {tierLimits[userTier].daily - dailyMessagesUsed} messages left today
                  </div>
                  <div className="text-sm text-orange-300">
                    {dailyMessagesUsed >= tierLimits[userTier].daily * 0.8 ? 
                      "⚠️ Almost at your daily limit" : 
                      `Resets in ${24 - new Date().getHours()} hours`
                    }
                  </div>
                </div>
                {dailyMessagesUsed >= tierLimits[userTier].daily * 0.8 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-orange-500 text-orange-400 hover:bg-orange-600 hover:text-white"
                    onClick={() => alert('Byte top-up coming soon!')}
                  >
                    +50 bytes
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-900/20 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div className="text-sm text-yellow-200">
                  <strong className="text-yellow-400">Important:</strong> This AI is a supportive companion, not a licensed therapist. 
                  For crisis support, contact your local emergency services or a qualified mental health professional.
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <Card className="h-[600px] flex flex-col bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5" />
                      <span>Text Therapy Session</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        Messages: {dailyMessagesUsed}/{tierLimits[userTier].dailyMessages}
                      </Badge>
                      <Badge variant="outline">
                        Sessions: {dailySessionsUsed}/{tierLimits[userTier].textSessions}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col space-y-4">
                  {/* Messages */}
                  <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.sender === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-700 text-gray-100 border border-gray-600'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 border p-3 rounded-lg">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <div className="flex space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Share what's on your mind..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={dailyMessagesUsed >= tierLimits[userTier].dailyMessages}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || dailyMessagesUsed >= tierLimits[userTier].dailyMessages}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {dailyMessagesUsed >= tierLimits[userTier].dailyMessages && (
                    <div className="text-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-700 mb-2">
                        Daily message limit reached ({tierLimits[userTier].dailyMessages} messages).
                      </p>
                      <div className="flex justify-center space-x-3">
                        <Button variant="outline" size="sm" className="text-orange-600">
                          Spend 50 Bytes for +100 Messages
                        </Button>
                        {userTier === 'ghost' && (
                          <Button variant="link" size="sm" className="text-orange-600 font-medium">
                            Upgrade to Firewall ($19/mo)
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              
              {/* Voice Therapy */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2 text-white">
                    <Mic className="h-5 w-5" />
                    <span>Voice AI Therapy</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {voiceMinutesRemaining} min
                    </div>
                    <div className="text-sm text-gray-400">remaining</div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleVoiceTherapy}
                    disabled={voiceMinutesRemaining === 0}
                  >
                    {voiceMinutesRemaining > 0 ? (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        Start Voice Session
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Buy 60min - $19.99
                      </>
                    )}
                  </Button>
                  
                  {voiceMinutesRemaining === 0 && (
                    <Button 
                      variant="outline" 
                      className="w-full border-green-500 text-green-400 hover:bg-green-600 hover:text-white"
                      onClick={() => {
                        // Handle micro-trial purchase
                        alert('3-minute voice trial coming soon!');
                      }}
                    >
                      Try Voice: $4.00 (3 min)
                    </Button>
                  )}
                  
                  <div className="text-xs text-gray-400 text-center">
                    Premium voice therapy with real-time emotional analysis
                  </div>
                </CardContent>
              </Card>

              {/* Session Stats */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Session Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Messages exchanged</span>
                    <Badge variant="outline">{messages.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Session duration</span>
                    <Badge variant="outline">12 min</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Emotional insights</span>
                    <Badge variant="outline">3</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Emergency Protocols</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full text-sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Crisis Support
                  </Button>
                  <Button variant="outline" className="w-full text-sm">
                    <Shield className="h-4 w-4 mr-2" />
                    No Contact Check
                  </Button>
                  <Button variant="outline" className="w-full text-sm">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Quick Ritual
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  )
}
