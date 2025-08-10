import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { HealingHubDashboard } from '@/components/dashboard/HealingHubDashboard';

export default async function DashboardPage() {
  const { user } = await validateRequest();
  if (!user) redirect('/sign-in');
  
  return <HealingHubDashboard user={user} />;
}
