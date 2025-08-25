import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { users } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';

// Force dynamic rendering for auth-protected pages
export const dynamic = 'force-dynamic';

export default async function SysControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();
  
  if (!user) {
    redirect('/sign-in');
  }

  // Check if user is admin
  try {
    const userData = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    const userRecord = userData[0];
    
    if (!userRecord?.isAdmin) {
      // Redirect non-admin users to regular dashboard
      redirect('/dashboard');
    }
  } catch (error) {
    console.error('Admin check error:', error);
    redirect('/dashboard');
  }

  return <>{children}</>;
}
