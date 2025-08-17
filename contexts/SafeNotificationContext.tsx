"use client"

import { createContext, useContext, useEffect, useState } from 'react';

interface SafeNotificationContextType {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  requestPermission: () => Promise<boolean>;
  subscribeToPush: () => Promise<boolean>;
  unsubscribeFromPush: () => Promise<boolean>;
  sendTestNotification: () => Promise<void>;
}

const SafeNotificationContext = createContext<SafeNotificationContextType | null>(null);

// Safe fallback values for mobile/unsupported browsers
const fallbackContext: SafeNotificationContextType = {
  isSupported: false,
  permission: 'denied',
  isSubscribed: false,
  requestPermission: async () => false,
  subscribeToPush: async () => false,
  unsubscribeFromPush: async () => false,
  sendTestNotification: async () => {},
};

// Check if notifications are supported without throwing errors
function isNotificationSupported(): boolean {
  try {
    return typeof window !== 'undefined' && 
           'serviceWorker' in navigator && 
           'PushManager' in window && 
           'Notification' in window &&
           typeof Notification !== 'undefined';
  } catch (error) {
    return false;
  }
}

export function useSafeNotifications() {
  const context = useContext(SafeNotificationContext);
  
  // Always return safe fallback on mobile/unsupported browsers
  if (!isNotificationSupported()) {
    return fallbackContext;
  }
  
  if (!context) {
    return fallbackContext;
  }
  
  return context;
}

interface SafeNotificationProviderProps {
  children: React.ReactNode;
}

export function SafeNotificationProvider({ children }: SafeNotificationProviderProps) {
  const [contextValue, setContextValue] = useState<SafeNotificationContextType>(fallbackContext);

  useEffect(() => {
    // Only initialize if notifications are supported
    if (!isNotificationSupported()) {
      setContextValue(fallbackContext);
      return;
    }

    // Lazy load the full notification context only if supported
    import('@/contexts/NotificationContext')
      .then(module => {
        // We'll wrap the actual NotificationProvider here if supported
        setContextValue({
          ...fallbackContext,
          isSupported: true
        });
      })
      .catch(() => {
        setContextValue(fallbackContext);
      });
  }, []);

  return (
    <SafeNotificationContext.Provider value={contextValue}>
      {children}
    </SafeNotificationContext.Provider>
  );
}
