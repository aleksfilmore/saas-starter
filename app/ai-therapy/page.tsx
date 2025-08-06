'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AuthWrapper from '@/components/AuthWrapper';
import { SimplifiedHeader } from '@/components/dashboard/SimplifiedHeader';
import { 
  Send, 
  Bot, 
  User, 
  Mic,
  ShoppingCart,
  AlertTriangle,
  Heart,
  Sparkles,
  Crown,
  Shield,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function SimplifiedAITherapyPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showVoiceBanner, setShowVoiceBanner] = useState(false);
  const [showCapabilities, setShowCapabilities] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUserData();
    fetchQuotaInfo();
    initializeChat();
  }, []);

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

  const initializeChat = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/ai-therapy/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.initialMessage) {
          setMessages([{
            id: 'init',
            content: data.initialMessage,
            role: 'assistant',
            timestamp: new Date()
          }]);
        }
      }
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    if (quotaInfo && quotaInfo.used >= quotaInfo.total) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
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
          message: inputMessage,
          conversationHistory: messages
        })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: Date.now().toString() + '_ai',
          content: data.response,
          role: 'assistant',
          timestamp: new Date(),
          archetype: data.archetype
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        await fetchQuotaInfo();
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + '_error',
        content: 'Sorry, I had trouble processing that. Please try again.',
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

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        
        {/* SimplifiedHeader */}
        <SimplifiedHeader 
          user={{
            username: user?.username || 'User',
            streak: 34,
            bytes: 730,
            level: 3,
            noContactDays: 12
          }}
          hasShield={true}
          onCheckin={() => console.log('Check-in clicked')}
          onBreathing={() => window.location.href = '/breathing'}
          onCrisis={() => window.location.href = '/crisis-support'}
        />
        
        {/* Main Chat Container */}
        <div className="max-w-4xl mx-auto px-4 pb-4">
          
          {/* Page Title with Quota */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white flex items-center">
              🧠 AI Therapy
            </h1>
            {quotaInfo && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm text-purple-300">{messagesLeft} left</div>
                  <div className="text-xs text-gray-400">
                    Reset in {formatTimeUntilReset(quotaInfo.resetAt)}
                  </div>
                </div>
                <div className="w-16">
                  <Progress value={quotaPercentage} className="h-2" />
                </div>
              </div>
            )}
          </div>

          {/* Voice Oracle Banner - Collapsed */}
          <motion.div 
            className="mb-4"
            animate={{ opacity: showVoiceBanner ? 1 : 0.8 }}
          >
            <Card 
              className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 cursor-pointer hover:border-purple-400/50 transition-colors"
              onClick={() => setShowVoiceBanner(!showVoiceBanner)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mic className="h-5 w-5 text-purple-400" />
                    <div>
                      <span className="text-sm font-medium text-white">Voice Oracle</span>
                      <Crown className="h-3 w-3 ml-1 text-yellow-400 inline" />
                      <div className="text-xs text-purple-300">Premium voice sessions coming soon</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                      Soon
                    </Badge>
                    {showVoiceBanner ? <ChevronUp className="h-4 w-4 text-purple-400" /> : <ChevronDown className="h-4 w-4 text-purple-400" />}
                  </div>
                </div>
                
                <AnimatePresence>
                  {showVoiceBanner && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 pt-3 border-t border-purple-500/20"
                    >
                      <p className="text-sm text-purple-200 mb-3">
                        Experience 15-minute guided voice therapy sessions with natural conversation flow.
                      </p>
                      <Button 
                        disabled 
                        size="sm"
                        className="bg-gray-700 text-gray-400 cursor-not-allowed"
                      >
                        Notify When Ready
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Chat Interface */}
          <Card className="bg-gray-800/80 border border-gray-600/50">
            <CardContent className="p-6">
              
              {/* Messages */}
              <div className="h-96 overflow-y-auto space-y-4 mb-4 pr-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : ''}`}>
                      <div
                        className={`p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.role === 'assistant' && (
                            <Bot className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          )}
                          {message.role === 'user' && (
                            <User className="h-5 w-5 text-purple-100 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="whitespace-pre-wrap">{message.content}</p>
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
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share what's on your mind..."
                    disabled={isLoading || Boolean(quotaInfo && quotaInfo.used >= quotaInfo.total)}
                    className="flex-1 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading || Boolean(quotaInfo && quotaInfo.used >= quotaInfo.total)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quota Warning */}
                {quotaInfo && quotaInfo.used >= quotaInfo.total && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-red-400">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Message limit reached. Resets in {formatTimeUntilReset(quotaInfo.resetAt)}
                        </span>
                      </div>
                      {quotaInfo.canPurchaseMore && (
                        <Button 
                          onClick={purchaseExtraMessages}
                          size="sm"
                          className="bg-yellow-600 hover:bg-yellow-700 text-black"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          +20 for 50 Bytes
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Collapsible AI Capabilities */}
          <div className="mt-4">
            <button
              onClick={() => setShowCapabilities(!showCapabilities)}
              className="flex items-center justify-between w-full p-3 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg border border-gray-600/30 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-white">What I Can Help With</span>
              </div>
              {showCapabilities ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            
            <AnimatePresence>
              {showCapabilities && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 p-4 bg-gray-800/30 rounded-lg border border-gray-600/20"
                >
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-red-400" />
                      <span className="text-gray-300">Process emotions about your ex</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-blue-400" />
                      <span className="text-gray-300">Understand attachment patterns</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300">Build healthy coping strategies</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-purple-400" />
                      <span className="text-gray-300">Plan your healing journey</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Shield className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-yellow-300 font-medium mb-1">Important Safety Information</p>
                        <p className="text-xs text-yellow-200 leading-relaxed">
                          This AI is trained for emotional support but isn't a replacement for professional therapy. 
                          If experiencing severe depression or crisis thoughts, use Dashboard → Crisis Support.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </AuthWrapper>
  );
}
