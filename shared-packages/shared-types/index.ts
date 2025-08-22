// Shared TypeScript interfaces and types for web and mobile
// Extracted from existing platform for maximum code reuse

export interface User {
  id: string;
  email: string;
  tier: 'freemium' | 'survivor' | 'warrior' | 'phoenix';
  archetype?: string;
  archetype_details?: any;
  xp: number;
  bytes: number;
  level: number;
  ritual_streak: number;
  no_contact_streak: number;
  last_checkin?: Date;
  last_ritual?: Date;
  is_verified: boolean;
  subscription_status?: string;
  subscription_expires?: Date;
  username?: string;
  avatar?: string;
  onboardingCompleted?: boolean;
  subscriptionTier?: string;
  byteBalance?: number;
  isAdmin?: boolean;
  isBanned?: boolean;
  lastActiveAt?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface DailyRitual {
  id: number;
  user_id: string;
  assigned_date: Date;
  ritual_id: number;
  status: 'pending' | 'completed' | 'skipped';
  completion_notes?: string;
  mood_before?: number;
  mood_after?: number;
  completed_at?: Date;
  streak_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface Badge {
  id: number;
  user_id: string;
  badge_type: string;
  badge_name: string;
  description?: string;
  icon?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  earned_at: Date;
  progress?: number;
  max_progress?: number;
  is_active: boolean;
}

export interface WallPost {
  id: number;
  user_id?: string;
  content: string;
  mood_score?: number;
  is_anonymous: boolean;
  status: 'pending' | 'approved' | 'rejected';
  reaction_counts?: Record<string, number>;
  created_at: Date;
  updated_at: Date;
}

export interface AITherapySession {
  id: number;
  user_id: string;
  session_type: 'text' | 'voice';
  persona: string;
  message_count: number;
  session_data?: any;
  mood_before?: number;
  mood_after?: number;
  duration_minutes?: number;
  created_at: Date;
  updated_at: Date;
}

export interface VoiceSession {
  id: number;
  user_id: string;
  session_type: 'guided' | 'freeform';
  duration_seconds: number;
  transcript?: string;
  mood_before?: number;
  mood_after?: number;
  session_data?: any;
  created_at: Date;
}

export interface NoContactEntry {
  id: number;
  user_id: string;
  entry_date: Date;
  contact_avoided: boolean;
  trigger_level?: number;
  notes?: string;
  mood_score?: number;
  streak_day: number;
  created_at: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
}

// Notification Types
export interface PushNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  scheduled_for?: Date;
  sent_at?: Date;
  type: 'ritual_reminder' | 'streak_milestone' | 'wall_engagement' | 'ai_credits' | 'voice_reminder';
}

// Dashboard Types
export interface DashboardStats {
  currentStreak: number;
  totalRituals: number;
  xpPoints: number;
  byteBalance: number;
  level: number;
  todaysMood?: number;
  weeklyProgress: number[];
}

// Crisis Support Types
export interface CrisisResource {
  id: string;
  name: string;
  phone: string;
  text?: string;
  website?: string;
  description: string;
  country: string;
  available_24_7: boolean;
}

// Subscription Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  stripeProductId: string;
  stripePriceId: string;
}

// Mobile-specific Types
export interface DeviceInfo {
  deviceId: string;
  platform: 'ios' | 'android';
  osVersion: string;
  appVersion: string;
  pushToken?: string;
  biometricEnabled?: boolean;
  timezone: string;
  locale: string;
}

export interface OfflineAction {
  id: string;
  type: string;
  payload: any;
  timestamp: Date;
  synced: boolean;
}

// Form Validation Types
export interface FormError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormError[];
}

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  fonts: {
    regular: string;
    medium: string;
    bold: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
}

// Animation Types
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

// Export commonly used type unions
export type UserTier = 'freemium' | 'survivor' | 'warrior' | 'phoenix';
export type RitualStatus = 'pending' | 'completed' | 'skipped';
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type SessionType = 'text' | 'voice';
export type Platform = 'web' | 'ios' | 'android';
export type NotificationType = 'ritual_reminder' | 'streak_milestone' | 'wall_engagement' | 'ai_credits' | 'voice_reminder';
