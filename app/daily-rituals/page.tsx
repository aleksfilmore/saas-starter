/**
 * Daily Rituals Page for Paid Users
 * /daily-rituals - Comprehensive ritual management system
 */

import { DailyRitualDashboard } from '@/components/rituals/DailyRitualDashboard';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function DailyRitualsPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect('/sign-in');
  }

  // Check if user has paid subscription
  // TODO: Add subscription check when payment system is integrated
  // if (user.tier === 'freemium') {
  //   redirect('/pricing');
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:text-purple-400">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              ⚡ Daily Ritual Challenge
            </h1>
            <p className="text-xl text-purple-400">
              Your personalized healing journey - 2 rituals per day
            </p>
          </div>
          
          <DailyRitualDashboard />
        </div>
      </div>
    </div>
  );
}
