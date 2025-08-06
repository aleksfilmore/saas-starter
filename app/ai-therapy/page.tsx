'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AuthWrapper from '@/components/AuthWrapper';
import Link from 'next/link';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Mic,
  ShoppingCart,
  Clock,
  AlertTriangle,
  Heart,
  Sparkles,
  ArrowLeft,
  Crown,
  Shield
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  archetype?: string;
}

interface QuotaInfo {
  used: number;
  total: number;
  resetAt: string;
  canPurchaseMore: boolean;
  purchaseCost: number;
  tier: string;
}

export default function AITherapyPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUserData();
    fetchQuotaInfo();
  }, []);

  useEffect(() => {
    if (showChat && messages.length === 0) {
      initializeChat();
    }
  }, [showChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const fetchQuotaInfo = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/ai-therapy/quota', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setQuotaInfo(data.quota);
      }
    } catch (error) {
      console.error('Failed to fetch quota info:', error);
    }
  };

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: crypto.randomUUID(),
      content: "Hey there 👋 I'm your AI therapy companion, trained specifically for heartbreak recovery. I understand attachment styles and can help you work through your healing journey. What's on your mind today?",
      role: 'assistant',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    // Check quota
    if (quotaInfo && quotaInfo.used >= quotaInfo.total) {
      alert('You\'ve reached your message limit. Upgrade or wait for reset to continue.');
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/ai-therapy/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: inputMessage.trim(),
          conversationHistory: messages.slice(-10)
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          content: data.response,
          role: 'assistant',
          timestamp: new Date(),
          archetype: user?.archetype
        };

        setMessages(prev => [...prev, aiMessage]);
        
        // Update quota
        if (quotaInfo) {
          setQuotaInfo(prev => prev ? {
            ...prev,
            used: prev.used + 1
          } : null);
        }
      } else {
        const error = await response.json();
        console.error('AI response error:', error);
        
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          content: "I'm having trouble responding right now. Please try again in a moment.",
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: "Connection error. Please check your internet and try again.",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const purchaseExtraMessages = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/ai-therapy/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          packageType: 'extra_20'
        })
      });

      if (response.ok) {
        await fetchQuotaInfo();
        alert('Successfully purchased 20 extra messages!');
      } else {
        const error = await response.json();
        alert('Purchase failed: ' + error.message);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  const formatTimeUntilReset = (resetAt: string) => {
    const resetTime = new Date(resetAt);
    const now = new Date();
    const diff = resetTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Now';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const quotaPercentage = quotaInfo ? (quotaInfo.used / quotaInfo.total) * 100 : 0;
  const messagesLeft = quotaInfo ? quotaInfo.total - quotaInfo.used : 0;

  // Show landing page if user hasn't started chat yet
  if (!showChat) {
    return (
      <AuthWrapper>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
          
          {/* Header */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white hover:text-purple-400">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                🧠 AI Therapy
              </h1>
              <p className="text-xl text-purple-400">
                Your personal healing companion powered by AI
              </p>
            </div>
          </div>

          {/* Current Plan Status */}
          {quotaInfo && (
            <div className="max-w-6xl mx-auto mb-8">
              <Card className="bg-gray-800/80 border border-gray-600/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1">
                        {quotaInfo.tier.toUpperCase()}
                      </Badge>
                      <div>
                        <h3 className="text-xl font-bold text-white">Current Plan</h3>
                        <p className="text-gray-400">{messagesLeft} messages remaining</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setShowChat(true)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Start Chat Session
                    </Button>
                  </div>
                  
                  {/* Daily Quota Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Daily Messages</span>
                      <span className="text-gray-300">{quotaInfo.used} / {quotaInfo.total}</span>
                    </div>
                    <Progress value={quotaPercentage} className="h-2" />
                    {quotaPercentage >= 80 && (
                      <p className="text-orange-400 text-sm mt-2">⚠️ Approaching daily limit</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Chat Interface Preview */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Text Chat */}
              <Card className="bg-gray-800/80 border border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2 text-green-400" />
                    Text Chat Oracle
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 text-sm">Status</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Ready
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Chat with your AI therapist using text messages. Get instant responses tailored to your archetype.
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => setShowChat(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Start Chat Session
                  </Button>
                </CardContent>
              </Card>

              {/* Voice Oracle */}
              <Card className="bg-gray-800/80 border border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center">
                    <Mic className="h-5 w-5 mr-2 text-blue-400" />
                    Voice Oracle
                    <Crown className="h-4 w-4 ml-2 text-yellow-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 text-sm">Real-time Voice AI</span>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        Premium
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm">
                      15-minute voice sessions with real-time AI therapy. Natural conversation flow.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Button disabled className="w-full bg-gray-700 text-gray-400 cursor-not-allowed">
                      Coming Soon
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      Voice feature in development
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Safety & Legal */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gray-800/80 border border-gray-600/50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-bold mb-2">Important Safety Information</h3>
                    <div className="space-y-2 text-gray-300 text-sm">
                      <p className="bg-orange-500/10 border border-orange-500/30 p-3 rounded-lg">
                        <strong className="text-orange-400">⚠️ AI companion, not licensed therapy.</strong> If in crisis click Dashboard → Crisis Support.
                      </p>
                      <p>• Conversations are personalized to your attachment style</p>
                      <p>• Self-harm detection → automatic crisis resource recommendations</p>
                      <p>• All conversations are private and encrypted</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </AuthWrapper>
    );
  }

  // Show chat interface
  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => setShowChat(false)}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Therapy</h1>
                <p className="text-sm text-gray-600">Your personal healing companion</p>
              </div>
            </div>
            
            {quotaInfo && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {messagesLeft} / {quotaInfo.total}
                  </div>
                  <div className="text-xs text-gray-500">
                    Reset in {formatTimeUntilReset(quotaInfo.resetAt)}
                  </div>
                </div>
                <div className="w-24">
                  <Progress 
                    value={quotaPercentage} 
                    className={`h-2 ${quotaPercentage > 80 ? 'text-red-500' : 'text-green-500'}`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-4 h-[calc(100vh-80px)] flex">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            <Card className="flex-1 flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Chat Session</CardTitle>
                  {user?.archetype && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {user.archetype} Mode
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.role === 'assistant' && (
                            <Bot className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          )}
                          {message.role === 'user' && (
                            <User className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>
                            <p className={`text-xs mt-1 ${
                              message.role === 'user' ? 'text-purple-200' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-5 w-5 text-purple-600" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-200"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share what's on your mind..."
                    disabled={isLoading || (quotaInfo && quotaInfo.used >= quotaInfo.total)}
                    className="flex-1"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading || (quotaInfo && quotaInfo.used >= quotaInfo.total)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quota Warning */}
                {quotaInfo && quotaInfo.used >= quotaInfo.total && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-red-700">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Message limit reached. Resets in {formatTimeUntilReset(quotaInfo.resetAt)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-80 ml-4 space-y-4">
            {/* Buy Extra Messages */}
            {quotaInfo && quotaInfo.canPurchaseMore && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Extra Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">20 Messages</span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        50 Bytes
                      </Badge>
                    </div>
                    <Button 
                      onClick={purchaseExtraMessages}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      Purchase Now
                    </Button>
                    <p className="text-xs text-gray-500">
                      Extra messages expire with your quota reset
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Voice Oracle Banner */}
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardContent className="p-4">
                <div className="text-center">
                  <Mic className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Voice Oracle</h3>
                  <p className="text-sm text-purple-100 mb-3">
                    Experience guided voice therapy sessions
                  </p>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    disabled
                    className="bg-white text-purple-600 opacity-50"
                  >
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Capabilities */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  What I Can Help With
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Process emotions about your ex</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                    <span>Understand attachment patterns</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span>Build healthy coping strategies</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <span>Plan your healing journey</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Important</h4>
                <p className="text-xs text-yellow-700 leading-relaxed">
                  This AI is trained for emotional support but isn't a replacement for professional therapy. 
                  If you're experiencing severe depression or suicidal thoughts, please contact a crisis hotline immediately.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
