'use client'

import { useEffect, useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/SimpleNotificationContext';
import { HealingHubProvider } from '@/contexts/HealingHubContext';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Always wrap in providers to prevent hydration mismatch
  // Providers themselves handle SSR/mounting states internally
  return (
    <AuthProvider>
      <NotificationProvider>
        <HealingHubProvider>
          {children}
        </HealingHubProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
