import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdaptiveDashboardWithProvider } from '@/components/dashboard/AdaptiveDashboard';

export default async function DashboardPage() {
  const { user } = await validateRequest();
  if (!user) redirect('/sign-in');
  
  return <AdaptiveDashboardWithProvider user={user} />;
}
