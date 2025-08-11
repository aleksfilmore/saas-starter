"use client";

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Send, Minimize2, Maximize2 } from 'lucide-react';

interface Props {
  onClose: () => void;
  onFirstUserMessage?: () => void; // callback to mark daily task completion
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function AITherapyModal({ onClose, onFirstUserMessage }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm your AI therapy companion. How are you feeling today? I'm here to listen and help you process whatever is on your mind.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    // Fire first user message callback exactly once
    if (!messages.some(m => m.sender === 'user')) {
      onFirstUserMessage?.();
    }

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "I hear that you're going through something difficult. It takes courage to reach out. Can you tell me more about what's weighing on your mind?",
        "Thank you for sharing that with me. Your feelings are completely valid. How long have you been feeling this way?",
        "It sounds like you're dealing with a lot right now. Remember that healing isn't linear - some days are harder than others, and that's okay.",
        "I can sense the strength in you, even if it doesn't feel that way right now. What's one small thing that has brought you comfort recently?",
        "You're showing incredible self-awareness by recognizing these patterns. That's actually a huge step in your healing journey."
      ];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className={`bg-gray-800 border-gray-700 text-white transition-all duration-300 ${
        isMinimized ? 'max-w-md h-20' : 'max-w-2xl h-[600px]'
      }`}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-400" />
            <span>AI Therapy Chat</span>
          </DialogTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0"
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </DialogHeader>

        {!isMinimized && (
          <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <Card className={`max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-purple-600 border-purple-500'
                      : 'bg-gray-700 border-gray-600'
                  }`}>
                    <CardContent className="p-3">
                      <p className="text-white text-sm leading-relaxed">
                        {message.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <Card className="bg-gray-700 border-gray-600">
                    <CardContent className="p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-400 mt-2 text-center">
              This is AI support, not professional therapy. For crisis situations, please contact emergency services.
            </p>
          </div>
        )}

        {isMinimized && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">AI Therapy Chat</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
