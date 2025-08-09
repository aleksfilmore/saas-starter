import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDashboardSnapshot } from '@/lib/dashboard/snapshot';
import { DashboardClient, DashboardServerSnapshot } from '@/components/dashboard/DashboardClient';

export default async function DashboardPage() {
  const { user } = await validateRequest();
  if (!user) redirect('/sign-in');
  const raw = await getDashboardSnapshot(user.id);
  const adapted: DashboardServerSnapshot = {
    user: raw.user,
    level: {
      currentLevel: raw.user.level,
      currentXP: raw.user.xp,
      progressFraction: raw.level.progressFraction,
      nextLevelXP: raw.level.nextThreshold,
    },
    today: raw.today,
  };
  return <DashboardClient initialSnapshot={adapted} />;
}
