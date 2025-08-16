import React from 'react';
import { toast } from 'sonner';
import { Star, Trophy, Zap } from 'lucide-react';

interface BadgeNotificationData {
  badge: {
    id: string;
    name: string;
    description: string;
    category: string;
  };
  isNewBadge: boolean;
}

export const showBadgeNotification = (data: BadgeNotificationData) => {
  const { badge, isNewBadge } = data;
  
  if (isNewBadge) {
    // New badge earned
    toast.success(
      React.createElement('div', { className: 'flex items-center gap-3' }, [
        React.createElement('div', { 
          key: 'icon',
          className: 'w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center' 
        }, React.createElement(Trophy, { className: 'h-5 w-5 text-white' })),
        React.createElement('div', { key: 'content' }, [
          React.createElement('div', { key: 'title', className: 'font-semibold text-white' }, '🎉 New Badge Earned!'),
          React.createElement('div', { key: 'name', className: 'text-sm text-gray-200' }, badge.name),
          React.createElement('div', { key: 'desc', className: 'text-xs text-gray-400' }, badge.description)
        ])
      ]),
      {
        duration: 4000,
        className: 'bg-gradient-to-r from-purple-900 to-blue-900 border-purple-500/50',
      }
    );
  } else {
    // Progress toward badge
    toast.info(
      React.createElement('div', { className: 'flex items-center gap-3' }, [
        React.createElement('div', { 
          key: 'icon',
          className: 'w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center' 
        }, React.createElement(Zap, { className: 'h-4 w-4 text-white' })),
        React.createElement('div', { key: 'content' }, [
          React.createElement('div', { key: 'title', className: 'font-medium text-white' }, 'Badge Progress'),
          React.createElement('div', { key: 'name', className: 'text-sm text-gray-200' }, `Working toward: ${badge.name}`)
        ])
      ]),
      {
        duration: 2000,
        className: 'bg-slate-800 border-slate-600',
      }
    );
  }
};

export const showArchetypeUnlocked = (archetype: string) => {
  const archetypeNames: Record<string, string> = {
    'DF': 'Data Flooder',
    'FB': 'Firewall Builder', 
    'GS': 'Ghost in the Shell',
    'SN': 'Secure Node'
  };
  
  const archetypeIcons: Record<string, string> = {
    'DF': '🌊',
    'FB': '🛡️',
    'GS': '👻', 
    'SN': '🔐'
  };
  
  toast.success(
    React.createElement('div', { className: 'flex items-center gap-3' }, [
      React.createElement('div', { key: 'icon', className: 'text-2xl' }, archetypeIcons[archetype] || '⚡'),
      React.createElement('div', { key: 'content' }, [
        React.createElement('div', { key: 'title', className: 'font-bold text-white' }, '🔥 Archetype Unlocked!'),
        React.createElement('div', { key: 'name', className: 'text-sm text-gray-200' }, archetypeNames[archetype] || 'Unknown Archetype'),
        React.createElement('div', { key: 'desc', className: 'text-xs text-gray-400' }, 'Your pathway to specialized badges')
      ])
    ]),
    {
      duration: 5000,
      className: 'bg-gradient-to-r from-orange-900 to-red-900 border-orange-500/50',
    }
  );
};
