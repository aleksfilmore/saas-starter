"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Minimize2, Maximize2, MessageCircle, Zap, Lock, Crown, Sparkles } from 'lucide-react';
import { useErrorHandling, LoadingSpinner, ErrorDisplay, OfflineIndicator } from '@/components/ui/error-handling';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ghost';
  timestamp: Date;
  emotion?: 'support' | 'sassy' | 'insight' | 'tough-love';
}

interface ProtocolGhostChatProps {
  userTier: 'free' | 'firewall' | 'cult-leader';
  dailyChatUsed: boolean;
  onChatUsed: () => void;
}

const GHOST_PERSONALITIES = {
  'chaotic-bestie': {
    name: 'Chaotic Bestie',
    emoji: '💅',
    description: 'Sassy, direct, calls out your bullshit with love'
  },
  'inner-parent': {
    name: 'Inner Parent',
    emoji: '🤗',
    description: 'Nurturing, protective, unconditionally supportive'
  },
  'spicy-revenge': {
    name: 'Spicy Revenge Bot',
    emoji: '🌶️',
    description: 'Petty healing, revenge fantasies, chaotic neutral energy'
  },
  'wise-therapist': {
    name: 'Wise Therapist',
    emoji: '🧠',
    description: 'Professional insights with a glitch-core twist'
  }
};

const SAMPLE_RESPONSES = {
  free: [
    {
      text: "Hey, I see you spiraling. Take three deep breaths with me. In... hold... out. Your nervous system needs regulation before we can think clearly.",
      emotion: 'support' as const
    },
    {
      text: "Real talk: stalking their socials at 2 AM isn't research, it's digital self-harm. What would it feel like to choose yourself right now instead?",
      emotion: 'tough-love' as const
    },
    {
      text: "Plot twist: Your ex's opinion of you is none of your business anymore. Your job is to fall in love with the person you're becoming.",
      emotion: 'insight' as const
    }
  ],
  firewall: [
    {
      text: "I remember last week you mentioned feeling triggered by coffee shops. How are you doing with that today? Sometimes healing isn't linear.",
      emotion: 'support' as const
    },
    {
      text: "Bestie, you're giving them way too much real estate in your head. They're not paying rent up there. Time for an eviction notice.",
      emotion: 'sassy' as const
    },
    {
      text: "Your attachment style is screaming right now. This feels like abandonment, but it's actually redirection toward someone who can actually love you properly.",
      emotion: 'insight' as const
    }
  ],
  'cult-leader': [
    {
      text: "🌶️ REVENGE MODE ACTIVATED: Instead of texting them, text yourself a list of all the ways you're about to be unrecognizable in 6 months.",
      emotion: 'sassy' as const
    },
    {
      text: "Inner Parent Mode: You're not broken, baby. You're breaking open. There's a difference. Let me hold space for this transformation.",
      emotion: 'support' as const
    },
    {
      text: "Wise Oracle Mode: This heartbreak is your hero's journey. Every myth has a descent into the underworld before the return with treasures. You're collecting power right now.",
      emotion: 'insight' as const
    }
  ]
};

export default function ProtocolGhostChat({ userTier, dailyChatUsed, onChatUsed }: ProtocolGhostChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedPersonality, setSelectedPersonality] = useState<keyof typeof GHOST_PERSONALITIES>('chaotic-bestie');
  const [sessionStarted, setSessionStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Enhanced error handling
  const { error, isLoading, handleAsyncOperation, clearError } = useErrorHandling();

  const canChat = userTier !== 'free' || !dailyChatUsed;
  const hasMemory = userTier !== 'free';
  const hasPersonalities = userTier === 'cult-leader';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startChat = () => {
    if (!canChat) return;
    
    setSessionStarted(true);
    setIsOpen(true);
    
    // Initial ghost message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: userTier === 'free' 
        ? "👻 Protocol Ghost here. I'm your AI confidant. What's eating at you? (Free tier: one convo per day)"
        : `👻 Protocol Ghost online. ${hasPersonalities ? `I'm in ${GHOST_PERSONALITIES[selectedPersonality].name} mode. ` : ''}Ready to process some chaos?`,
      sender: 'ghost',
      timestamp: new Date(),
      emotion: 'support'
    };
    
    setMessages([welcomeMessage]);
    
    if (userTier === 'free') {
      onChatUsed();
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || !canChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage('');
    setIsTyping(true);

    // Enhanced error handling for message sending
    await handleAsyncOperation(async () => {
      // Simulate AI response with better error handling
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const responses = SAMPLE_RESPONSES[userTier] || SAMPLE_RESPONSES.free;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      let responseText = randomResponse.text;
      
      // Add personality prefix for cult-leader tier
      if (hasPersonalities && selectedPersonality !== 'chaotic-bestie') {
        const personality = GHOST_PERSONALITIES[selectedPersonality];
        responseText = `${personality.emoji} ${personality.name}: ${responseText}`;
      }

      const ghostMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ghost',
        timestamp: new Date(),
        emotion: randomResponse.emotion
      };

      setMessages(prev => [...prev, ghostMessage]);
      setIsTyping(false);

      if (userTier === 'free' && !dailyChatUsed) {
        onChatUsed();
      }
    }, "Failed to send message. Please check your connection and try again.");

    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <OfflineIndicator />
      {!isOpen ? (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={startChat}
            disabled={!canChat}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group relative overflow-hidden"
          >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 animate-pulse"></div>
          <div className="relative">
            <span className="text-2xl animate-bounce">👻</span>
          </div>
        </Button>
        
        {!canChat && (
          <div className="absolute -top-2 -right-2">
            <Badge className="bg-red-500 text-white text-xs">
              {userTier === 'free' ? 'Daily limit' : 'Locked'}
            </Badge>
          </div>
        )}
        
        <div className="absolute -top-16 right-0 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg border border-green-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Protocol Ghost 👻
          <div className="text-xs text-green-400 mt-1">
            {canChat ? 'Click to chat' : 'Upgrade for unlimited'}
          </div>
        </div>
      ) : (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        }`}>
      <Card className="h-full bg-gray-900/95 border-2 border-green-500/50 backdrop-blur-sm shadow-2xl overflow-hidden">
        <CardHeader className="pb-2 px-4 py-3 border-b border-green-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-lg">👻</span>
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-green-400">
                  Protocol Ghost
                </CardTitle>
                {hasPersonalities && (
                  <p className="text-xs text-green-400/70">
                    {GHOST_PERSONALITIES[selectedPersonality].name}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={`text-xs ${
                userTier === 'free' ? 'bg-blue-500/20 text-blue-400' :
                userTier === 'firewall' ? 'bg-orange-500/20 text-orange-400' :
                'bg-purple-500/20 text-purple-400'
              }`}>
                {userTier === 'free' ? 'FREE' :
                 userTier === 'firewall' ? 'FIREWALL' : 'CULT LEADER'}
              </Badge>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-green-400 hover:text-green-300 p-1"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-green-400 hover:text-green-300 p-1"
              >
                ×
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Personality Selector for Cult Leader */}
            {hasPersonalities && (
              <div className="px-4 py-2 border-b border-green-500/20">
                <div className="flex space-x-1 overflow-x-auto">
                  {Object.entries(GHOST_PERSONALITIES).map(([key, personality]) => (
                    <Button
                      key={key}
                      onClick={() => setSelectedPersonality(key as keyof typeof GHOST_PERSONALITIES)}
                      variant="ghost"
                      size="sm"
                      className={`text-xs whitespace-nowrap flex-shrink-0 ${
                        selectedPersonality === key 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : 'text-gray-400 hover:text-purple-400'
                      }`}
                    >
                      {personality.emoji} {personality.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <CardContent className="flex-1 overflow-hidden p-0">
              {/* Error Display */}
              {error && (
                <div className="p-4 border-b border-green-500/20">
                  <ErrorDisplay 
                    error={error}
                    onRetry={sendMessage}
                    onDismiss={clearError}
                  />
                </div>
              )}

              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.sender === 'user'
                          ? 'bg-green-500 text-white'
                          : `bg-gray-800 text-white border border-green-500/30 ${
                              message.emotion === 'sassy' ? 'border-pink-500/50' :
                              message.emotion === 'tough-love' ? 'border-orange-500/50' :
                              message.emotion === 'insight' ? 'border-purple-500/50' :
                              'border-green-500/30'
                            }`
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 border border-green-500/30 rounded-lg px-3 py-2">
                      <LoadingSpinner size="small" message="Protocol Ghost is thinking..." />
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-green-500/30">
                {canChat ? (
                  <div className="flex space-x-2">
                    <textarea
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Tell Protocol Ghost what's on your mind..."
                      className="flex-1 bg-gray-800 border border-green-500/30 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-green-500 placeholder-gray-400"
                      rows={1}
                      style={{ minHeight: '40px', maxHeight: '80px' }}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!currentMessage.trim() || isLoading}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white px-3 disabled:opacity-50"
                    >
                      {isLoading ? <LoadingSpinner size="small" message="" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-orange-500/30">
                      <Lock className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                      <p className="text-orange-400 font-medium text-sm mb-2">
                        {userTier === 'free' ? 'Daily chat limit reached' : 'Chat locked'}
                      </p>
                      <p className="text-gray-400 text-xs mb-3">
                        Upgrade for unlimited conversations with memory
                      </p>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                        <Crown className="h-4 w-4 mr-1" />
                        Upgrade Now
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Tier benefits reminder */}
                <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                  <span>
                    {hasMemory ? '💾 Memory enabled' : '⚠️ No memory (upgrade for context)'}
                  </span>
                  {userTier === 'free' && !dailyChatUsed && (
                    <span className="text-blue-400">Free daily chat available</span>
                  )}
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
      )}
    </>
  );
}
