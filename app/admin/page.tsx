import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import ComingSoonPage from '../page';

// Force dynamic rendering for auth-protected pages
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const { user } = await validateRequest();
  
  if (!user) {
    // Non-authenticated users see the homepage/coming soon page
    return <ComingSoonPage />;
  }

  // Check if user is admin
  try {
    const userData = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    const userRecord = userData[0];
    
    if (userRecord?.isAdmin) {
      // Redirect admin users to the secure admin panel
      redirect('/sys-control');
    } else {
      // Redirect non-admin authenticated users to regular dashboard
      redirect('/dashboard');
    }
  } catch (error) {
    console.error('Admin check error:', error);
    redirect('/dashboard');
  }
}
