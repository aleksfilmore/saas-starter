"use client";

import React, { useState, useEffect } from 'react';
import { User } from 'lucia';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showDropdown?: boolean;
  onProfileClick?: () => void;
}

interface UserBadge {
  id: string;
  name: string;
  icon_url: string;
}

export function UserAvatar({ 
  user, 
  size = 'md', 
  className = '', 
  showDropdown = false,
  onProfileClick 
}: UserAvatarProps) {
  const [selectedBadge, setSelectedBadge] = useState<UserBadge | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is premium
  const userAny = user as any;
  const isPremium = userAny?.subscription_tier === 'premium' || 
                   userAny?.tier === 'firewall' ||
                   userAny?.ritual_tier === 'firewall';

  useEffect(() => {
    // Only load badge for premium users
    if (isPremium) {
      loadUserBadge();
    } else {
      setLoading(false);
    }
  }, [user.id, isPremium]);

  const loadUserBadge = async () => {
    try {
      const response = await fetch('/api/user/badge');
      const data = await response.json();
      
      if (data.success && data.selectedBadge) {
        setSelectedBadge({
          id: data.selectedBadge.id,
          name: data.selectedBadge.name,
          icon_url: data.selectedBadge.iconUrl
        });
      }
    } catch (error) {
      console.error('Failed to load user badge:', error);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const sizeClass = sizeClasses[size];

  if (loading) {
    return (
      <div className={`${sizeClass} rounded-full bg-slate-700 animate-pulse ${className}`} />
    );
  }

  // For premium users, show badge if available
  if (isPremium && selectedBadge) {
    return (
      <button
        onClick={onProfileClick}
        className={`${sizeClass} rounded-full border-2 border-purple-500/50 hover:border-purple-400 transition-colors ${className}`}
        title={`${selectedBadge.name} - Click to manage profile`}
      >
        <img 
          src={selectedBadge.icon_url} 
          alt={selectedBadge.name}
          className="w-full h-full rounded-full object-cover"
        />
      </button>
    );
  }

  // For Ghost users or premium users without badges, show initials with appropriate styling
  const initials = (user.email || 'U').charAt(0).toUpperCase();
  
  return (
    <button
      onClick={onProfileClick}
      className={`${sizeClass} rounded-full ${
        isPremium 
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400' 
          : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600'
      } flex items-center justify-center text-white font-bold transition-colors ${className}`}
      title={isPremium ? "Premium user - Click to manage badges" : "Ghost user - Upgrade to unlock badges"}
    >
      {initials}
    </button>
  );
}

export default UserAvatar;
