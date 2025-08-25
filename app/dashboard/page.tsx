import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { UnifiedDashboard } from '@/components/dashboard/UnifiedDashboard';
import DashboardV2 from '@/components/dashboard/DashboardV2';
import { db } from '@/lib/db';
import { users } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';

// Force dynamic rendering for auth-protected pages
export const dynamic = 'force-dynamic';

export default async function DashboardPage({ searchParams }: { searchParams: Record<string,string | string[] | undefined> }) {
  const { user: authUser } = await validateRequest();
  if (!authUser) redirect('/sign-in');
  
  // Get full user data from database
  const [fullUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, authUser.id))
    .limit(1);
    
  if (!fullUser) redirect('/sign-in');
  
  // Always show V2 (legacy switch removed)
  return <DashboardV2 user={fullUser} />;
}
