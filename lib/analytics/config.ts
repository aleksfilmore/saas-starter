// Analytics configuration and enhanced tracking
export const ANALYTICS_CONFIG = {
  GA_MEASUREMENT_ID: 'G-XC7EY4PTX0',
  
  // Define custom events for better tracking
  EVENTS: {
    // User engagement
    PAGE_VIEW: 'page_view',
    EMAIL_SIGNUP: 'email_signup',
    QUIZ_START: 'quiz_start',
    QUIZ_COMPLETE: 'quiz_complete',
    
    // Healing journey
    RITUAL_START: 'ritual_start',
    RITUAL_COMPLETE: 'ritual_complete',
    AI_THERAPY_START: 'ai_therapy_start',
    WALL_POST: 'wall_post',
    NO_CONTACT_MILESTONE: 'no_contact_milestone',
    
    // User flow
    SIGN_UP_START: 'sign_up_start',
    SIGN_UP_COMPLETE: 'sign_up_complete',
    LOGIN: 'login',
    LOGOUT: 'logout',
    
    // Conversion
    SUBSCRIPTION_START: 'subscription_start',
    SUBSCRIPTION_COMPLETE: 'subscription_complete',
    UPGRADE: 'upgrade',
    
    // Engagement
    FEATURE_CLICK: 'feature_click',
    CTA_CLICK: 'cta_click',
    SOCIAL_SHARE: 'social_share',
  },
  
  // Enhanced ecommerce tracking for subscriptions
  ECOMMERCE: {
    CURRENCY: 'USD',
    PLANS: {
      FREE: { id: 'free', price: 0, name: 'Free Plan' },
      PREMIUM: { id: 'premium', price: 9.99, name: 'Premium Plan' },
      PRO: { id: 'pro', price: 19.99, name: 'Pro Plan' },
    }
  }
};

// Enhanced tracking with user properties
export const trackUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', ANALYTICS_CONFIG.GA_MEASUREMENT_ID, {
      user_properties: properties
    });
  }
};

// Track healing journey progress
export const trackHealingMilestone = (milestone: string, value?: number) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'healing_milestone', {
      event_category: 'progress',
      event_label: milestone,
      value: value,
      custom_parameter_milestone: milestone
    });
  }
};

// Track subscription events with enhanced ecommerce
export const trackSubscriptionEvent = (
  event: 'begin_checkout' | 'purchase',
  plan: keyof typeof ANALYTICS_CONFIG.ECOMMERCE.PLANS
) => {
  const planData = ANALYTICS_CONFIG.ECOMMERCE.PLANS[plan];
  
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, {
      currency: ANALYTICS_CONFIG.ECOMMERCE.CURRENCY,
      value: planData.price,
      items: [{
        item_id: planData.id,
        item_name: planData.name,
        category: 'subscription',
        quantity: 1,
        price: planData.price
      }]
    });
  }
};

// Track page views with custom parameters
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', ANALYTICS_CONFIG.GA_MEASUREMENT_ID, {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    });
  }
};

// Track outbound link clicks
export const trackOutboundLink = (url: string, linkText?: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'click', {
      event_category: 'outbound',
      event_label: url,
      transport_type: 'beacon',
      custom_parameter_link_text: linkText
    });
  }
};
