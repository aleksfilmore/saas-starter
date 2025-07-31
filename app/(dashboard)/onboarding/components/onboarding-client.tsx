'use client';

import { SystemBootOnboarding } from '@/components/onboarding/SystemBootOnboarding';
import { useRouter } from 'next/navigation';

interface OnboardingClientProps {
  userId: string;
}

export function OnboardingClient({ userId }: OnboardingClientProps) {
  const router = useRouter();
  
  const handleComplete = () => {
    // Redirect to enhanced dashboard when onboarding is complete
    router.push('/dashboard/glow-up-console');
  };

  return <SystemBootOnboarding userId={userId} onComplete={handleComplete} />;
}
