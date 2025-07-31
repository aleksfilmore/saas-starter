import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth';
import { OnboardingClient } from './components/onboarding-client';
import { getUserById } from '@/lib/db/queries';

export default async function OnboardingPage() {
  const { user } = await validateRequest();
  
  if (!user) {
    redirect('/sign-in');
  }

  // Check if user has already completed onboarding
  // const userData = await getUserById(user.id);
  // if (userData?.hasCompletedOnboarding) {
  //   redirect('/dashboard/enhanced');
  // }

  return <OnboardingClient userId={user.id} />;
}
