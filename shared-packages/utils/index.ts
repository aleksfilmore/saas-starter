// Shared utility functions for web and mobile platforms
// Business logic that can be reused across platforms

// NOTE: Adjust path if monorepo alias changes; fallback to relative shared-types
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - shared types resolution may differ in consumer
import { User, UserTier, DailyRitual, Badge } from '@ctrlaltblock/shared-types';

// Date and Time Utilities
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const daysSince = (date: Date): number => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// User and Profile Utilities
export const getUserDisplayName = (user: User): string => {
  return user.username || user.email.split('@')[0];
};

export const getUserTierColor = (tier: UserTier): string => {
  const colors = {
    freemium: '#94A3B8', // Gray
    survivor: '#22C55E',  // Green
    warrior: '#F59E0B',   // Orange
    phoenix: '#EC4899',   // Pink
  };
  return colors[tier] || colors.freemium;
};

export const getUserTierName = (tier: UserTier): string => {
  const names = {
    freemium: 'Ghost Mode',
    survivor: 'Survivor',
    warrior: 'Warrior',
    phoenix: 'Phoenix',
  };
  return names[tier] || 'Ghost Mode';
};

// Bytes milestone utilities (replacing legacy XP level system)
export const getByteMilestone = (bytes: number): number => {
  return Math.floor(bytes / 1000) + 1; // every 1000 bytes advances milestone
};

export const getByteMilestoneProgress = (bytes: number): { milestone: number; progress: number; remaining: number; percent: number } => {
  const milestone = getByteMilestone(bytes);
  const progress = bytes % 1000;
  const remaining = 1000 - progress;
  const percent = Math.min(100, Math.floor((progress / 1000) * 100));
  return { milestone, progress, remaining, percent };
};

// Streak Calculations
export const calculateStreak = (entries: { entry_date: Date; contact_avoided: boolean }[]): number => {
  if (entries.length === 0) return 0;
  
  const sortedEntries = entries
    .filter(entry => entry.contact_avoided)
    .sort((a, b) => b.entry_date.getTime() - a.entry_date.getTime());
  
  if (sortedEntries.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = sortedEntries[i].entry_date;
    const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export const getStreakMilestones = (): number[] => {
  return [1, 3, 7, 14, 30, 60, 90, 180, 365];
};

export const getNextMilestone = (currentStreak: number): number | null => {
  const milestones = getStreakMilestones();
  return milestones.find(milestone => milestone > currentStreak) || null;
};

// Ritual Utilities
export const getRitualStatusColor = (status: string): string => {
  const colors = {
    pending: '#F59E0B',    // Yellow
    completed: '#22C55E',  // Green
    skipped: '#EF4444',    // Red
  };
  return colors[status as keyof typeof colors] || colors.pending;
};

export const getRitualCompletionRate = (rituals: DailyRitual[]): number => {
  if (rituals.length === 0) return 0;
  
  const completed = rituals.filter(ritual => ritual.status === 'completed').length;
  return Math.round((completed / rituals.length) * 100);
};

export const getRitualStreakDays = (rituals: DailyRitual[]): number => {
  const sortedRituals = rituals
    .filter(ritual => ritual.status === 'completed')
    .sort((a, b) => b.assigned_date.getTime() - a.assigned_date.getTime());
  
  let streak = 0;
  const today = new Date();
  
  for (const ritual of sortedRituals) {
    const daysDiff = Math.floor((today.getTime() - ritual.assigned_date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// Badge Utilities
export const getBadgeRarityColor = (rarity: string): string => {
  const colors = {
    common: '#94A3B8',     // Gray
    rare: '#3B82F6',       // Blue
    epic: '#8B5CF6',       // Purple
    legendary: '#F59E0B',  // Gold
  };
  return colors[rarity as keyof typeof colors] || colors.common;
};

export const sortBadgesByRarity = (badges: Badge[]): Badge[] => {
  const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
  
  return badges.sort((a, b) => {
    const aRarity = rarityOrder[a.rarity as keyof typeof rarityOrder] || 0;
    const bRarity = rarityOrder[b.rarity as keyof typeof rarityOrder] || 0;
    return bRarity - aRarity;
  });
};

export const getActiveBadges = (badges: Badge[]): Badge[] => {
  return badges.filter(badge => badge.is_active);
};

// Mood and Analytics
export const getMoodColor = (mood: number): string => {
  if (mood <= 2) return '#EF4444'; // Red - Very sad
  if (mood <= 4) return '#F59E0B'; // Orange - Sad
  if (mood <= 6) return '#EAB308'; // Yellow - Neutral
  if (mood <= 8) return '#84CC16'; // Lime - Good
  return '#22C55E'; // Green - Great
};

export const getMoodEmoji = (mood: number): string => {
  if (mood <= 2) return '😢';
  if (mood <= 4) return '😞';
  if (mood <= 6) return '😐';
  if (mood <= 8) return '🙂';
  return '😊';
};

export const calculateMoodTrend = (moods: number[]): 'improving' | 'declining' | 'stable' => {
  if (moods.length < 2) return 'stable';
  
  const recent = moods.slice(-3);
  const older = moods.slice(-6, -3);
  
  if (recent.length === 0 || older.length === 0) return 'stable';
  
  const recentAvg = recent.reduce((sum, mood) => sum + mood, 0) / recent.length;
  const olderAvg = older.reduce((sum, mood) => sum + mood, 0) / older.length;
  
  const diff = recentAvg - olderAvg;
  
  if (diff > 0.5) return 'improving';
  if (diff < -0.5) return 'declining';
  return 'stable';
};

// Text and Content Utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - remove potentially dangerous tags
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

export const extractMentions = (text: string): string[] => {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  return mentions;
};

// Validation Utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return strongPasswordRegex.test(password);
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 6) return 'weak';
  if (password.length < 8) return 'medium';
  if (isStrongPassword(password)) return 'strong';
  return 'medium';
};

// Platform Detection Utilities
export const getPlatform = (): 'web' | 'ios' | 'android' | 'unknown' => {
  if (typeof window === 'undefined') return 'unknown';
  
  const userAgent = window.navigator.userAgent;
  
  if (/iPad|iPhone|iPod/.test(userAgent)) return 'ios';
  if (/Android/.test(userAgent)) return 'android';
  return 'web';
};

export const isWebPlatform = (): boolean => {
  return getPlatform() === 'web';
};

export const isMobilePlatform = (): boolean => {
  const platform = getPlatform();
  return platform === 'ios' || platform === 'android';
};

// Storage Utilities
export const generateStorageKey = (userId: string, key: string): string => {
  return `ctrlaltblock_${userId}_${key}`;
};

export const serializeData = <T>(data: T): string => {
  return JSON.stringify(data);
};

export const deserializeData = <T>(serializedData: string): T | null => {
  try {
    return JSON.parse(serializedData);
  } catch {
    return null;
  }
};

// Error Handling Utilities
export const createError = (message: string, code?: string): Error & { code?: string } => {
  const error = new Error(message);
  if (code) {
    (error as any).code = code;
  }
  return error;
};

export const isNetworkError = (error: any): boolean => {
  return error?.code === 'NETWORK_ERROR' || 
         error?.message?.includes('fetch') ||
         error?.message?.includes('network');
};

export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return 'An unexpected error occurred';
};

// Animation and UI Utilities
export const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

export const easeInOut = (t: number): number => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const randomInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Export all utilities as a single object for convenience
export const utils = {
  // Date & Time
  formatDate,
  formatTime,
  isToday,
  daysSince,
  
  // User & Profile
  getUserDisplayName,
  getUserTierColor,
  getUserTierName,
  getByteMilestone,
  getByteMilestoneProgress,
  
  // Streaks
  calculateStreak,
  getStreakMilestones,
  getNextMilestone,
  
  // Rituals
  getRitualStatusColor,
  getRitualCompletionRate,
  getRitualStreakDays,
  
  // Badges
  getBadgeRarityColor,
  sortBadgesByRarity,
  getActiveBadges,
  
  // Mood & Analytics
  getMoodColor,
  getMoodEmoji,
  calculateMoodTrend,
  
  // Text & Content
  truncateText,
  sanitizeHtml,
  extractMentions,
  
  // Validation
  isValidEmail,
  isStrongPassword,
  getPasswordStrength,
  
  // Platform
  getPlatform,
  isWebPlatform,
  isMobilePlatform,
  
  // Storage
  generateStorageKey,
  serializeData,
  deserializeData,
  
  // Error Handling
  createError,
  isNetworkError,
  getErrorMessage,
  
  // Animation & UI
  lerp,
  easeInOut,
  clamp,
  randomInRange,
};
