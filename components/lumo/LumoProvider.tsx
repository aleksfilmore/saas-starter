'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LumoNotification {
  id: string;
  type: 'info' | 'error' | 'warning' | 'success';
  message: string;
  timestamp: string;
  badge?: 'red' | 'blue' | 'amber';
  tooltip?: string;
  action?: () => void;
}

interface LumoContextType {
  open: () => void;
  close: () => void;
  isOpen: boolean;
  persona: 'core' | 'gremlin' | 'analyst';
  setPersona: (persona: 'core' | 'gremlin' | 'analyst') => void;
  quotaLeft: number;
  tier: 'ghost' | 'firewall' | 'cult_leader';
  notify: (type: 'info' | 'error' | 'warning' | 'success', message: string) => void;
  notifications: LumoNotification[];
  clearNotifications: () => void;
  sendMessage: (message: string) => Promise<void>;
  chatHistory: Array<{ role: 'user' | 'lumo'; content: string; timestamp: string }>;
  isLoading: boolean;
}

const LumoContext = createContext<LumoContextType | undefined>(undefined);

interface LumoProviderProps {
  children: React.ReactNode;
  initialQuota?: number;
  userTier?: 'ghost' | 'firewall' | 'cult_leader';
}

export function LumoProvider({ 
  children, 
  initialQuota = 5, 
  userTier = 'ghost' 
}: LumoProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [persona, setPersona] = useState<'core' | 'gremlin' | 'analyst'>('core');
  const [quotaLeft, setQuotaLeft] = useState(initialQuota);
  const [notifications, setNotifications] = useState<LumoNotification[]>([]);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'lumo'; content: string; timestamp: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Check for first-time user
  useEffect(() => {
    const skipOnboard = localStorage.getItem('lumo.skipOnboard');
    const completedOnboard = localStorage.getItem('lumo.completedOnboard');
    
    if (!skipOnboard && !completedOnboard) {
      // Show first-time flow after a brief delay
      setTimeout(() => {
        setIsOpen(true);
        addWelcomeMessage();
      }, 2000);
    }
    
    // Check for contextual nudges
    checkForNudges();
  }, []);

  const addWelcomeMessage = () => {
    const userAlias = localStorage.getItem('user-alias') || 'Warrior';
    setChatHistory([{
      role: 'lumo',
      content: `Welcome, ${userAlias}. I'm Lumo—your break-up co-pilot. Need a hand finishing setup?`,
      timestamp: new Date().toISOString()
    }]);
  };

  const checkForNudges = () => {
    // Mock nudge checks - replace with actual logic
    const streakData = localStorage.getItem('user-streak');
    const lastCheckin = localStorage.getItem('last-checkin');
    
    if (!lastCheckin || isStreakAtRisk()) {
      notify('warning', "Don't lose your streak!");
    }
  };

  const isStreakAtRisk = () => {
    const lastCheckin = localStorage.getItem('last-checkin');
    if (!lastCheckin) return true;
    
    const lastDate = new Date(lastCheckin);
    const now = new Date();
    const hoursSince = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60);
    
    return hoursSince > 20; // Nudge if no checkin for 20+ hours
  };

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const notify = (type: LumoNotification['type'], message: string) => {
    const notification: LumoNotification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date().toISOString(),
      badge: type === 'error' ? 'red' : type === 'warning' ? 'amber' : 'blue'
    };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const clearNotifications = () => setNotifications([]);

  const sendMessage = async (message: string) => {
    if (quotaLeft <= 0 && userTier === 'ghost') {
      notify('error', 'Out of messages! Upgrade to continue chatting.');
      return;
    }

    setIsLoading(true);
    
    // Add user message
    const userMessage = {
      role: 'user' as const,
      content: message,
      timestamp: new Date().toISOString()
    };
    
    setChatHistory(prev => [...prev, userMessage]);

    try {
      // Mock API call - replace with actual Lumo chat endpoint
      const response = await fetch('/api/lumo/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          persona,
          history: chatHistory.slice(-10) // Last 10 messages for context
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      
      // Add Lumo response
      const lumoMessage = {
        role: 'lumo' as const,
        content: data.response,
        timestamp: new Date().toISOString()
      };
      
      setChatHistory(prev => [...prev, lumoMessage]);
      
      // Decrease quota for free users
      if (userTier === 'ghost') {
        setQuotaLeft(prev => Math.max(0, prev - 1));
      }
      
    } catch (error) {
      notify('error', 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: LumoContextType = {
    open,
    close,
    isOpen,
    persona,
    setPersona,
    quotaLeft,
    tier: userTier,
    notify,
    notifications,
    clearNotifications,
    sendMessage,
    chatHistory,
    isLoading
  };

  return (
    <LumoContext.Provider value={contextValue}>
      {children}
    </LumoContext.Provider>
  );
}

export function useLumo() {
  const context = useContext(LumoContext);
  if (context === undefined) {
    throw new Error('useLumo must be used within a LumoProvider');
  }
  return context;
}

export type { LumoContextType, LumoNotification };
