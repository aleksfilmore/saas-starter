import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import BadgeManager from './BadgeManager';

export const dynamic = 'force-dynamic';

export default async function BadgesPage(){
  const { user } = await validateRequest();
  if(!user) redirect('/login');
  return <BadgeManager userId={user.id} />;
}
