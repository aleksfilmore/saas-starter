'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLumo } from './LumoProvider';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Send, 
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Persona configurations
const PERSONAS = {
  core: {
    name: 'Lumo-Core',
    avatar: '✨',
    color: 'from-purple-500 to-blue-500',
    description: 'Balanced, gentle guidance'
  },
  gremlin: {
    name: 'Petty Gremlin',
    avatar: '👹',
    color: 'from-red-500 to-orange-500',
    description: 'Savage hype friend'
  },
  analyst: {
    name: 'Void Analyst',
    avatar: '🧠',
    color: 'from-gray-500 to-blue-500',
    description: 'Stoic CBT reframer'
  },
  support: {
    name: 'Customer Support',
    avatar: '💜',
    color: 'from-blue-500 to-purple-500',
    description: 'Platform help & guidance'
  }
};

// LUMO orb component
export function LumoOrb() {
  const { open, notifications } = useLumo();
  const hasNotifications = notifications.length > 0;
  const criticalNotification = notifications.find(n => n.type === 'error');
  const warningNotification = notifications.find(n => n.type === 'warning');

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Notification badge */}
        {hasNotifications && (
          <div className="absolute -top-1 -right-1 z-10">
            <div className={`w-3 h-3 rounded-full animate-pulse ${
              criticalNotification ? 'bg-red-500' : 
              warningNotification ? 'bg-amber-500' : 'bg-blue-500'
            }`}></div>
          </div>
        )}
        
        {/* Tooltip for notifications */}
        {hasNotifications && (
          <div className="absolute bottom-full right-0 mb-2 z-10">
            <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded-lg shadow-lg whitespace-nowrap">
              {criticalNotification?.message || 
               warningNotification?.message || 
               notifications[0]?.message}
            </div>
          </div>
        )}

        {/* Main orb */}
        <motion.button
          onClick={open}
          className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: hasNotifications 
              ? '0 0 20px rgba(168, 85, 247, 0.5)' 
              : '0 0 10px rgba(168, 85, 247, 0.3)'
          }}
        >
          <div className="relative">
            <motion.div
              animate={{ 
                opacity: [0.6, 1, 0.6],
                scale: [0.9, 1, 0.9]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-2xl"
            >
              ✨
            </motion.div>
            
            {/* Pulse effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-purple-400"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.button>
      </div>
    </div>
  );
}

// Main LUMO bubble component
export function LumoBubble() {
  const { 
    isOpen, 
    close, 
    persona, 
    setPersona, 
    quotaLeft, 
    tier,
    sendMessage, 
    chatHistory, 
    isLoading,
    notifications,
    clearNotifications,
    isOnboardingMode,
    setOnboardingComplete
  } = useLumo();
  
  const [message, setMessage] = useState('');
  // Removed unused drag state (not yet implemented)
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, close]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const messageToSend = message;
    setMessage('');
    await sendMessage(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentPersona = PERSONAS[persona];
  
  // LUMO customer support is unlimited for all users
  const isUnlimited = true;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-20 right-6 z-50 w-80 max-h-96"
        ref={bubbleRef}
      >
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={close}
        />
        
        <Card className="bg-gray-900/95 border-purple-500/50 shadow-2xl backdrop-blur-sm">
          {/* Draggable header */}
          <CardHeader 
            className="pb-2 border-b border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${currentPersona.color} flex items-center justify-center text-sm`}>
                  {currentPersona.avatar}
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setShowPersonaDropdown(!showPersonaDropdown)}
                    className="flex items-center space-x-1 text-white hover:text-purple-300 transition-colors"
                  >
                    <span className="font-medium">{currentPersona.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {/* Persona dropdown */}
                  {showPersonaDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-40">
                      {Object.entries(PERSONAS).map(([key, p]) => (
                        <button
                          key={key}
                          onClick={() => {
                            setPersona(key as 'core' | 'gremlin' | 'analyst' | 'support');
                            setShowPersonaDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors ${
                            key === persona ? 'bg-gray-700' : ''
                          }`}
                          disabled={false} // All users can access all support personas
                        >
                          <div className="flex items-center space-x-2">
                            <span>{p.avatar}</span>
                            <div>
                              <div className="text-white text-sm">{p.name}</div>
                              <div className="text-gray-400 text-xs">{p.description}</div>
                            </div>
                            {key === 'support' && (
                              <Badge variant="default" className="ml-auto text-xs bg-blue-600">Free</Badge>
                            )}
                            {/* All personas available for customer support */}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={close}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Chat area */}
            <div className="max-h-64 overflow-y-auto p-4 space-y-3">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-200'
                    }`}
                  >
                    <div className="font-medium text-xs mb-1 opacity-75">
                      {msg.role === 'user' ? 'YOU' : currentPersona.name.toUpperCase()}
                    </div>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-200 p-2 rounded-lg text-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>
            
            {/* Input area */}
            <div className="border-t border-gray-700 p-4 space-y-3">
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${currentPersona.name}...`}
                  className="bg-gray-800 border-gray-600 text-white flex-1"
                  maxLength={280}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Quota bar */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">
                    ∞ customer support messages
                  </span>
                </div>
                
                {/* Remove buy button since LUMO support is unlimited */}
              </div>

              {/* Onboarding completion */}
              {isOnboardingMode && (
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <div className="text-sm text-purple-300 text-center mb-2">
                    Setup complete? Let me switch to support mode!
                  </div>
                  <Button 
                    onClick={setOnboardingComplete}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm"
                  >
                    ✓ Complete Onboarding
                  </Button>
                </div>
              )}
              
              <div className="text-xs text-gray-500 text-center">
                {message.length}/280 chars
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

// Combined LUMO component
export default function Lumo() {
  return (
    <>
      <LumoOrb />
      <LumoBubble />
    </>
  );
}
