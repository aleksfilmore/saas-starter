// Wall of Wounds Test Page
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import WallOfWounds from '@/components/wall/WallOfWounds';

export default async function WallTestPage() {
  const { user } = await validateRequest();
  
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div>
      <WallOfWounds />
    </div>
  );
}
