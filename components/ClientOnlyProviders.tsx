'use client'

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import { SafeNotificationProvider } from '@/contexts/SafeNotificationContext';

const AuthProvider = dynamic(
  () => import('@/contexts/AuthContext').then(mod => ({ default: mod.AuthProvider })),
  { ssr: false }
);

interface ClientOnlyProvidersProps {
  children: ReactNode;
}

export function ClientOnlyProviders({ children }: ClientOnlyProvidersProps) {
  return (
    <AuthProvider>
      <SafeNotificationProvider>
        {children}
      </SafeNotificationProvider>
    </AuthProvider>
  );
}
