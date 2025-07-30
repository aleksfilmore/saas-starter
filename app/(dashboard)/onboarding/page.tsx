import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth';
import { OnboardingFlow } from './components/onboarding-flow';
import { getUserById } from '@/lib/db/queries';

export default async function OnboardingPage() {
  const { user } = await validateRequest();
  
  if (!user) {
    redirect('/sign-in');
  }

  // Check if user has already completed onboarding
  const userData = await getUserById(user.id);
  if (userData?.hasCompletedOnboarding) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-4">
              System Identity Configuration
            </h1>
            <p className="text-gray-300 text-lg">
              Welcome to the faceless protocol. Configure your anonymous identity and begin your healing journey.
            </p>
          </div>
          <OnboardingFlow userId={user.id} />
        </div>
      </div>
    </div>
  );
}
