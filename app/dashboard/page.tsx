import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { UnifiedDashboard } from '@/components/dashboard/UnifiedDashboard';

// Force dynamic rendering for auth-protected pages
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { user } = await validateRequest();
  if (!user) redirect('/sign-in');
  
  return <UnifiedDashboard user={user} />;
}
