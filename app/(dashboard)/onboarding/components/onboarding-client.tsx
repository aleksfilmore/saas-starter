'use client';

import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { useRouter } from 'next/navigation';

interface OnboardingClientProps {
  userId: string;
}

export function OnboardingClient({ userId }: OnboardingClientProps) {
  const router = useRouter();
  
  const handleComplete = () => {
    // Redirect to dashboard when onboarding is complete - now with AI therapy!
    router.push('/dashboard');
  };

  return <OnboardingFlow userId={userId} onComplete={handleComplete} />;
}
