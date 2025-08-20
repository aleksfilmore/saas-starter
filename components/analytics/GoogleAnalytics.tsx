'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { CookieConsent, useCookieConsent } from '@/components/privacy/CookieConsent';

const GA_MEASUREMENT_ID = 'G-XC7EY4PTX0';

export function GoogleAnalytics() {
  const { hasConsent, giveConsent, revokeConsent } = useCookieConsent();
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    if (hasConsent === null) {
      setShowConsent(true);
    }
  }, [hasConsent]);

  // Only load analytics if user has consented
  if (hasConsent !== true) {
    return (
      <>
        {showConsent && (
          <CookieConsent
            onAccept={() => {
              giveConsent();
              setShowConsent(false);
            }}
            onDecline={() => {
              revokeConsent();
              setShowConsent(false);
            }}
            onCustomize={() => {
              // Handle customization
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
            anonymize_ip: true,
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        `}
      </Script>
    </>
  );
}

// Custom event tracking functions for better analytics
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      send_to: GA_MEASUREMENT_ID
    });
  }
};

// Specific tracking functions for your platform
export const trackSignUp = (method: string) => {
  trackEvent('sign_up', 'authentication', method);
  
  // Enhanced ecommerce tracking for sign ups
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'sign_up', {
      method: method
    });
  }
};

export const trackLogin = (method: string) => {
  trackEvent('login', 'authentication', method);
  
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'login', {
      method: method
    });
  }
};

export const trackQuizStart = () => {
  trackEvent('quiz_start', 'engagement', 'healing_archetype_quiz');
  
  // Track as conversion event
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: 0,
      items: [{
        item_id: 'healing_quiz',
        item_name: 'Healing Archetype Quiz',
        category: 'assessment',
        quantity: 1,
        price: 0
      }]
    });
  }
};

export const trackQuizComplete = (archetype: string) => {
  trackEvent('quiz_complete', 'engagement', archetype);
  
  // Track as purchase (free)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'purchase', {
      transaction_id: `quiz_${Date.now()}`,
      currency: 'USD',
      value: 0,
      items: [{
        item_id: 'healing_quiz_complete',
        item_name: `Quiz Complete - ${archetype}`,
        category: 'assessment',
        quantity: 1,
        price: 0
      }]
    });
  }
};

export const trackRitualComplete = (ritualType: string) => {
  trackEvent('ritual_complete', 'healing', ritualType);
};

export const trackAITherapySession = () => {
  trackEvent('ai_therapy_start', 'engagement', 'therapy_session');
};

export const trackWallPost = () => {
  trackEvent('wall_post', 'community', 'wall_of_wounds');
};

export const trackNoContactStreak = (days: number) => {
  trackEvent('no_contact_streak', 'progress', 'streak_milestone', days);
  
  // Track milestone achievements
  const milestones = [1, 7, 14, 30, 60, 90, 180, 365];
  if (milestones.includes(days)) {
    trackEvent('achievement_unlocked', 'gamification', `no_contact_${days}_days`, days);
  }
};

export const trackSubscription = (plan: string, value: number) => {
  trackEvent('purchase', 'conversion', plan, value);
  
  // Enhanced ecommerce tracking
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'purchase', {
      transaction_id: `sub_${Date.now()}`,
      currency: 'USD',
      value: value,
      items: [{
        item_id: plan.toLowerCase(),
        item_name: `${plan} Subscription`,
        category: 'subscription',
        quantity: 1,
        price: value
      }]
    });
  }
};

// Track user journey stages
export const trackUserJourneyStage = (stage: 'visitor' | 'signup' | 'quiz_complete' | 'active_user' | 'subscriber') => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      user_properties: {
        journey_stage: stage
      }
    });
  }
};

// Track healing progress
export const trackHealingProgress = (progressData: {
  streakDays: number;
  ritualsCompleted: number;
  archetype: string;
  healingScore?: number;
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'healing_progress_update', {
      event_category: 'progress',
      custom_map: {
        'dimension1': progressData.archetype,
        'dimension2': progressData.streakDays.toString(),
        'dimension3': progressData.ritualsCompleted.toString(),
      },
      value: progressData.healingScore || 0
    });
  }
};
