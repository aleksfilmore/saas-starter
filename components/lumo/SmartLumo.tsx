'use client';

import React, { useEffect } from 'react';
import { useLumo } from './LumoProvider';
import { useHealingHub } from '@/contexts/HealingHubContext';

interface SmartLumoProps {
  // Props to trigger specific Lumo behaviors
  onRitualCompleted?: boolean;
  onCheckInCompleted?: boolean;
  onStreakBroken?: boolean;
  onFirstVisit?: boolean;
}

export function SmartLumo({
  onRitualCompleted,
  onCheckInCompleted,
  onStreakBroken,
  onFirstVisit
}: SmartLumoProps) {
  const { notify, open, chatHistory, sendMessage } = useLumo();
  const { noContact } = useHealingHub();

  // Auto-trigger Lumo based on context
  useEffect(() => {
    if (onRitualCompleted) {
      notify('success', 'Great work on your ritual!');
      
      // Auto-send congratulatory message
      setTimeout(() => {
        if (chatHistory.length === 0) {
          sendMessage('I just completed a ritual!');
        }
      }, 1000);
    }
  }, [onRitualCompleted, notify, chatHistory.length, sendMessage]);

  useEffect(() => {
    if (onCheckInCompleted) {
      notify('success', 'Daily check-in complete!');
    }
  }, [onCheckInCompleted, notify]);

  useEffect(() => {
    if (onStreakBroken) {
      notify('warning', 'Streak broken - but you can start fresh!');
      
      // Open Lumo for support
      setTimeout(() => {
        open();
      }, 2000);
    }
  }, [onStreakBroken, notify, open]);

  useEffect(() => {
    if (onFirstVisit) {
      notify('info', 'Welcome! I\'m here to help with your healing journey.');
      
      // Open welcome flow
      setTimeout(() => {
        open();
      }, 3000);
    }
  }, [onFirstVisit, notify, open]);

  // Context-aware notifications based on user state
  useEffect(() => {
    if (!noContact) return;

    // Check for streak at risk
    if (noContact.status === 'threatened') {
      notify('warning', 'Your no-contact streak is at risk!');
    }

  }, [noContact, notify]);

  // Smart nudges based on time patterns
  useEffect(() => {
    const checkTimeBasedNudges = () => {
      const hour = new Date().getHours();
      const today = new Date().toDateString();
      
      // Morning nudge (8-10 AM)
      if (hour >= 8 && hour <= 10) {
        const lastCheckin = localStorage.getItem('last-checkin');
        
        if (!lastCheckin || new Date(lastCheckin).toDateString() !== today) {
          notify('info', 'Good morning! Ready for your daily check-in?');
        }
      }
      
      // Evening reflection nudge (7-9 PM)
      if (hour >= 19 && hour <= 21) {
        const completedRitual = localStorage.getItem(`ritual-completed-${today}`);
        if (!completedRitual) {
          notify('info', 'Evening is perfect for healing rituals ✨');
        }
      }
    };

    // Check immediately and then every hour
    checkTimeBasedNudges();
    const interval = setInterval(checkTimeBasedNudges, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [notify]);

  // This component doesn't render anything visible - it's purely for smart behavior
  return null;
}

export default SmartLumo;