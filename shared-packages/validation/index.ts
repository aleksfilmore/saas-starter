// Shared validation schemas using Zod
// Reused across web and mobile platforms for consistent validation

import { z } from 'zod';

// Authentication Schemas
export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const RegisterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// User Profile Schemas
export const UserProfileSchema = z.object({
  email: z.string().email('Please enter a valid email address').optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters').optional(),
  archetype: z.string().optional(),
  avatar: z.string().url('Please enter a valid URL').optional(),
});

export const UserTierSchema = z.object({
  tier: z.enum(['freemium', 'survivor', 'warrior', 'phoenix']),
});

// Daily Ritual Schemas
export const CompleteRitualSchema = z.object({
  completion_notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  mood_before: z.number().min(1).max(10).optional(),
  mood_after: z.number().min(1).max(10).optional(),
});

export const RitualPreferencesSchema = z.object({
  preferred_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)').optional(),
  difficulty_level: z.enum(['easy', 'medium', 'hard']).optional(),
  categories: z.array(z.string()).optional(),
});

// Wall of Wounds Schemas
export const CreateWallPostSchema = z.object({
  content: z.string()
    .min(10, 'Post must be at least 10 characters')
    .max(1000, 'Post must be less than 1000 characters'),
  is_anonymous: z.boolean().default(true),
  mood_score: z.number().min(1).max(10).optional(),
});

export const ReactToPostSchema = z.object({
  reaction: z.enum(['heart', 'hug', 'strength', 'solidarity', 'hope']),
});

// AI Therapy Schemas
export const StartAISessionSchema = z.object({
  persona: z.enum(['supportive-guide', 'tough-love-coach', 'wise-mentor', 'playful-friend']),
  initial_mood: z.number().min(1).max(10).optional(),
});

export const SendAIMessageSchema = z.object({
  message: z.string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message must be less than 2000 characters'),
  mood_context: z.number().min(1).max(10).optional(),
});

// Voice Therapy Schemas
export const StartVoiceSessionSchema = z.object({
  type: z.enum(['guided', 'freeform']),
  duration_preference: z.number().min(60).max(1800).optional(), // 1 minute to 30 minutes
});

export const CompleteVoiceSessionSchema = z.object({
  duration_seconds: z.number().min(1),
  transcript: z.string().max(10000).optional(),
  mood_before: z.number().min(1).max(10).optional(),
  mood_after: z.number().min(1).max(10).optional(),
  quality_rating: z.number().min(1).max(5).optional(),
});

// No-Contact Tracker Schemas
export const AddNoContactEntrySchema = z.object({
  contact_avoided: z.boolean(),
  trigger_level: z.number().min(1).max(10).optional(),
  notes: z.string().max(500).optional(),
  mood_score: z.number().min(1).max(10).optional(),
  entry_date: z.string().optional(), // ISO date string
});

export const NoContactGoalSchema = z.object({
  goal_days: z.number().min(1).max(365),
  motivation: z.string().max(200).optional(),
});

// Crisis Support Schemas
export const CrisisReportSchema = z.object({
  message: z.string()
    .min(10, 'Please provide more details about your situation')
    .max(1000, 'Message must be less than 1000 characters'),
  urgency: z.number().min(1).max(10),
  contact_preference: z.enum(['none', 'email', 'phone']).optional(),
  location: z.string().max(100).optional(),
});

// Subscription Schemas
export const CreateSubscriptionSchema = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
  payment_method_id: z.string().optional(),
});

export const UpdateSubscriptionSchema = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
  proration: z.boolean().default(true),
});

// Mobile-Specific Schemas
export const DeviceRegistrationSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required'),
  platform: z.enum(['ios', 'android']),
  osVersion: z.string().min(1, 'OS version is required'),
  appVersion: z.string().min(1, 'App version is required'),
  pushToken: z.string().optional(),
  biometricEnabled: z.boolean().optional(),
  timezone: z.string().min(1, 'Timezone is required'),
  locale: z.string().min(1, 'Locale is required'),
});

export const PushTokenUpdateSchema = z.object({
  token: z.string().min(1, 'Push token is required'),
  platform: z.enum(['ios', 'android']),
});

export const OfflineActionSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  payload: z.any(),
  timestamp: z.string().datetime(),
  synced: z.boolean().default(false),
});

export const SyncActionsSchema = z.object({
  actions: z.array(OfflineActionSchema),
  device_id: z.string().min(1),
});

// Analytics Schemas
export const TrackEventSchema = z.object({
  event: z.string().min(1, 'Event name is required'),
  properties: z.record(z.any()).optional(),
  timestamp: z.string().datetime().optional(),
  user_id: z.string().optional(),
});

export const ProgressAnalyticsSchema = z.object({
  timeframe: z.enum(['week', 'month', 'year']).default('month'),
  metrics: z.array(z.string()).optional(),
});

// Settings Schemas
export const NotificationSettingsSchema = z.object({
  ritual_reminders: z.boolean().default(true),
  streak_alerts: z.boolean().default(true),
  wall_activity: z.boolean().default(true),
  ai_credits: z.boolean().default(true),
  voice_reminders: z.boolean().default(true),
  marketing: z.boolean().default(false),
  quiet_hours_start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).default('22:00'),
  quiet_hours_end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).default('08:00'),
});

export const PrivacySettingsSchema = z.object({
  data_retention_days: z.enum(['0', '30', '90']).default('30'),
  anonymous_analytics: z.boolean().default(true),
  crash_reporting: z.boolean().default(true),
  personalized_content: z.boolean().default(true),
});

export const BiometricSettingsSchema = z.object({
  enabled: z.boolean(),
  fallback_to_passcode: z.boolean().default(true),
});

// Onboarding Schemas
export const OnboardingStepSchema = z.object({
  step: z.enum(['welcome', 'archetype', 'goals', 'notifications', 'complete']),
  data: z.any().optional(),
});

export const ArchetypeSelectionSchema = z.object({
  archetype: z.enum(['the-healer', 'the-warrior', 'the-phoenix', 'the-sage']),
  details: z.record(z.any()).optional(),
});

export const GoalSettingSchema = z.object({
  primary_goal: z.enum(['no_contact', 'self_worth', 'healing', 'growth']),
  target_streak: z.number().min(1).max(365).optional(),
  motivation: z.string().max(200).optional(),
});

// Form validation helpers
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return {
      isValid: true,
      data: result.data,
      errors: [],
    };
  }
  
  return {
    isValid: false,
    data: null,
    errors: result.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    })),
  };
};

// Export all schemas for easy import
export const schemas = {
  // Auth
  login: LoginSchema,
  register: RegisterSchema,
  forgotPassword: ForgotPasswordSchema,
  resetPassword: ResetPasswordSchema,
  
  // User
  userProfile: UserProfileSchema,
  userTier: UserTierSchema,
  
  // Rituals
  completeRitual: CompleteRitualSchema,
  ritualPreferences: RitualPreferencesSchema,
  
  // Wall
  createWallPost: CreateWallPostSchema,
  reactToPost: ReactToPostSchema,
  
  // AI Therapy
  startAISession: StartAISessionSchema,
  sendAIMessage: SendAIMessageSchema,
  
  // Voice Therapy
  startVoiceSession: StartVoiceSessionSchema,
  completeVoiceSession: CompleteVoiceSessionSchema,
  
  // No Contact
  addNoContactEntry: AddNoContactEntrySchema,
  noContactGoal: NoContactGoalSchema,
  
  // Crisis
  crisisReport: CrisisReportSchema,
  
  // Subscription
  createSubscription: CreateSubscriptionSchema,
  updateSubscription: UpdateSubscriptionSchema,
  
  // Mobile
  deviceRegistration: DeviceRegistrationSchema,
  pushTokenUpdate: PushTokenUpdateSchema,
  offlineAction: OfflineActionSchema,
  syncActions: SyncActionsSchema,
  
  // Analytics
  trackEvent: TrackEventSchema,
  progressAnalytics: ProgressAnalyticsSchema,
  
  // Settings
  notificationSettings: NotificationSettingsSchema,
  privacySettings: PrivacySettingsSchema,
  biometricSettings: BiometricSettingsSchema,
  
  // Onboarding
  onboardingStep: OnboardingStepSchema,
  archetypeSelection: ArchetypeSelectionSchema,
  goalSetting: GoalSettingSchema,
};

// Type exports for TypeScript users
export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type UserProfileFormData = z.infer<typeof UserProfileSchema>;
export type CompleteRitualFormData = z.infer<typeof CompleteRitualSchema>;
export type CreateWallPostFormData = z.infer<typeof CreateWallPostSchema>;
export type SendAIMessageFormData = z.infer<typeof SendAIMessageSchema>;
export type DeviceRegistrationData = z.infer<typeof DeviceRegistrationSchema>;
export type NotificationSettingsData = z.infer<typeof NotificationSettingsSchema>;
