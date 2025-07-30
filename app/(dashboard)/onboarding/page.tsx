'use client';

import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { getUserById } from '@/lib/db/queries';
import { useRouter } from 'next/navigation';

function OnboardingClient({ userId }: { userId: string }) {
  const router = useRouter();
  
  const handleComplete = () => {
    // Redirect to dashboard when onboarding is complete - now with AI therapy!
    router.push('/dashboard');
  };

  return <OnboardingFlow userId={userId} onComplete={handleComplete} />;
}

export default async function OnboardingPage() {
  const { user } = await validateRequest();
  
  if (!user) {
    redirect('/sign-in');
  }

  // Check if user has already completed onboarding
  // const userData = await getUserById(user.id);
  // if (userData?.hasCompletedOnboarding) {
  //   redirect('/dashboard');
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-4" 
                style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
              CTRL+ALT+BLOCK™ Initialization
            </h1>
            <p className="text-gray-300 text-lg font-medium mb-2">
              Configure your AI-powered healing journey
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <span className="text-purple-400">🎮</span>
                <span className="text-gray-400">AI Therapy Sessions</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-green-400">👻</span>
                <span className="text-gray-400">Protocol Ghost Chat</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-orange-400">💬</span>
                <span className="text-gray-400">Wall of Wounds</span>
              </div>
            </div>
          </div>
          <OnboardingClient userId={user.id} />
        </div>
      </div>
    </div>
  );
}
