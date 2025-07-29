import { Suspense } from 'react';
import { getUserNoContactPeriods } from '@/lib/db/queries';
import { NoContactTracker } from './components/no-contact-tracker';
import { CreatePeriodForm } from './components/create-period-form';
import { Shield, Clock, Target } from 'lucide-react';

export default async function TrackerPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-cyan-500/20 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
            <Shield className="h-6 w-6 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">No Contact Tracker</h1>
        </div>
        <p className="text-cyan-100/70 text-lg">
          Take control of your healing journey. Track your progress, celebrate milestones, and build healthier boundaries.
        </p>
      </div>

      {/* Stats Overview */}
      <Suspense fallback={<StatsLoading />}>
        <StatsOverview />
      </Suspense>

      {/* Create New Period */}
      <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-5 w-5 text-cyan-400" />
          <h2 className="text-xl font-semibold text-white">Start New No Contact Period</h2>
        </div>
        <CreatePeriodForm />
      </div>

      {/* Active & Past Periods */}
      <Suspense fallback={<TrackerLoading />}>
        <NoContactTracker />
      </Suspense>
    </div>
  );
}

async function StatsOverview() {
  const periods = await getUserNoContactPeriods();
  
  const activePeriods = periods.filter(p => p.isActive);
  const completedPeriods = periods.filter(p => !p.isActive);
  const totalDaysTracked = periods.reduce((total, period) => {
    const daysSinceStart = Math.floor(
      (new Date().getTime() - new Date(period.startDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    return total + Math.min(daysSinceStart, period.targetDays);
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
            <Shield className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <p className="text-green-100/70 text-sm">Active Periods</p>
            <p className="text-2xl font-bold text-white">{activePeriods.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Target className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-blue-100/70 text-sm">Completed Goals</p>
            <p className="text-2xl font-bold text-white">{completedPeriods.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <Clock className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="text-purple-100/70 text-sm">Total Days Tracked</p>
            <p className="text-2xl font-bold text-white">{totalDaysTracked}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-500/10 rounded-lg border border-gray-500/20">
              <div className="h-5 w-5 bg-gray-600 rounded animate-pulse" />
            </div>
            <div>
              <div className="h-4 w-20 bg-gray-600 rounded animate-pulse mb-2" />
              <div className="h-6 w-8 bg-gray-600 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TrackerLoading() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
        <div className="h-6 w-32 bg-gray-600 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-600 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-600 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
