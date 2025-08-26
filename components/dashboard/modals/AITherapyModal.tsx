'use client';

import React, { useState, useRef, useEffect } from 'react';
import { emitBytesUpdate } from '@/lib/bytes/emit';
import { BytesEventSource } from '@/lib/bytes/sources';
import { trackEvent } from '@/lib/analytics/client';
import { AnalyticsEvents } from '@/lib/analytics/events';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Sparkles, Heart, Brain, MessageSquare } from 'lucide-react';

// Persona configuration
const PERSONA_CONFIG = {
  'supportive-guide': {
    name: 'Supportive Guide',
    icon: Heart,
    color: 'bg-pink-500',
    textColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
    welcome: "I'm here to offer gentle support and encouragement as you navigate your healing journey. 💕",
    conversationStarters: [
      "I'm feeling overwhelmed today...",
      "How can I practice more self-compassion?",
      "I need some emotional support right now"
    ]
  },
  'strategic-analyst': {
    name: 'Strategic Analyst',
    icon: Brain,
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    welcome: "Let's work together to analyze your situation and develop practical strategies for your growth. 🧠",
    conversationStarters: [
      "I want to understand my patterns better",
      "Help me create a plan for moving forward",
      "What strategies work best for emotional healing?"
    ]
  },
  'emotional-healer': {
    name: 'Emotional Healer',
    icon: Sparkles,
    color: 'bg-purple-500',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    welcome: "I'm here to help you process emotions and find inner peace through your healing journey. ✨",
    conversationStarters: [
      "I'm struggling with difficult emotions",
      "How can I release this pain I'm carrying?",
      "I want to find peace with my past"
    ]
  }
};

interface AITherapyModalProps {
  onClose: () => void;
  onFirstUserMessage: () => void; // parent daily action completion (may already award bytes)
  selectedPersona?: string;
  disableInternalBytesAward?: boolean; // guard flag to prevent fallback emission
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AITherapyModal({ onClose, onFirstUserMessage, selectedPersona = 'supportive-guide', disableInternalBytesAward }: AITherapyModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStartedConversation, setHasStartedConversation] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const persona = PERSONA_CONFIG[selectedPersona as keyof typeof PERSONA_CONFIG] || PERSONA_CONFIG['supportive-guide'];
  const PersonaIcon = persona.icon;

  useEffect(() => {
    // Add welcome message when modal opens
    const welcomeMessage: Message = {
      id: 'welcome',
      text: persona.welcome,
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [selectedPersona, persona.welcome]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    // Mark first user message for gamification
    if (!hasStartedConversation) {
      onFirstUserMessage();
      // Only emit if internal award not disabled (parent may already perform emission)
      if(!disableInternalBytesAward){
        emitBytesUpdate({ source: BytesEventSource.AI_CHAT, delta: 5 });
  trackEvent(AnalyticsEvents.BYTES_EARNED_AI_CHAT, { delta:5, source: BytesEventSource.AI_CHAT, modality: 'text' });
      }
      trackEvent(AnalyticsEvents.AI_THERAPY_SESSION_STARTED, { persona: selectedPersona });
      setHasStartedConversation(true);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-therapy/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          persona: selectedPersona,
          chatHistory: messages.slice(-10) // Last 10 messages for context
        }),
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        sender: 'ai',
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
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${persona.color} text-white`}>
              <PersonaIcon className="w-5 h-5" />
            </div>
            AI Therapy: {persona.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-semibold ${
                      message.sender === 'ai' ? persona.color + ' text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {message.sender === 'ai' ? <PersonaIcon className="w-4 h-4" /> : 'You'}
                    </div>
                    <div
                      className={`px-4 py-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : `${persona.bgColor} ${persona.textColor}`
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${persona.color} text-white`}>
                      <PersonaIcon className="w-4 h-4" />
                    </div>
                    <div className={`px-4 py-3 rounded-lg ${persona.bgColor}`}>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Conversation Starters (shown only at beginning) */}
          {messages.length <= 1 && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-3">Get started with:</p>
              <div className="flex flex-wrap gap-2">
                {persona.conversationStarters.map((starter, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendMessage(starter)}
                    className="text-left h-auto p-2 text-sm"
                    disabled={isLoading}
                  >
                    {starter}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="flex gap-2 pt-4 border-t">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${persona.name}...`}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
