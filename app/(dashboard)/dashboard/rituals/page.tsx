import { Suspense } from 'react';
import { getUserRituals, getTodaysRitualCompletions, getTodaysPrescribedRitual } from '@/lib/db/queries';
import { RitualsOverview } from './components/rituals-overview';
import { CreateRitualForm } from './components/create-ritual-form';
import { TodaysRituals } from './components/todays-rituals';
import { RitualsList } from './components/rituals-list';
import { PrescribedRitualCard } from './components/prescribed-ritual-card';
import { Zap, Plus, Calendar, Target, Sparkles } from 'lucide-react';

export default async function RitualsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-purple-500/20 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 backdrop-blur-sm">
            <Zap className="h-6 w-6 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Daily Rituals</h1>
        </div>
        <p className="text-purple-100/70 text-lg">
          Replace toxic patterns with empowering daily rituals that rebuild your confidence and self-worth.
        </p>
      </div>

      {/* Stats Overview */}
      <Suspense fallback={<StatsLoading />}>
        <RitualsOverview />
      </Suspense>

      {/* Prescribed Ritual */}
      <div className="bg-gray-900/60 border-2 border-purple-500/30 rounded-xl p-6 backdrop-blur-sm shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Daily Prescribed Ritual</h2>
        </div>
        <Suspense fallback={<PrescribedLoading />}>
          <PrescribedRitualWrapper />
        </Suspense>
      </div>

      {/* Today's Focus */}
      <div className="bg-gray-900/60 border-2 border-blue-500/30 rounded-xl p-6 backdrop-blur-sm shadow-[0_0_20px_rgba(59,130,246,0.4)]">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="h-5 w-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Your Personal Rituals</h2>
        </div>
        <Suspense fallback={<TodaysLoading />}>
          <TodaysRituals />
        </Suspense>
      </div>

      {/* Create New Ritual */}
      <div className="bg-gray-900/60 border-2 border-green-500/30 rounded-xl p-6 backdrop-blur-sm shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <Plus className="h-5 w-5 text-green-400" />
          <h2 className="text-xl font-semibold text-white">Create Personal Ritual</h2>
        </div>
        <CreateRitualForm />
      </div>

      {/* All Rituals */}
      <div className="bg-gray-900/60 border-2 border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm shadow-[0_0_20px_rgba(6,182,212,0.4)]">
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-5 w-5 text-cyan-400" />
          <h2 className="text-xl font-semibold text-white">Your Rituals</h2>
        </div>
        <Suspense fallback={<RitualsLoading />}>
          <RitualsList />
        </Suspense>
      </div>
    </div>
  );
}

async function PrescribedRitualWrapper() {
  const prescription = await getTodaysPrescribedRitual();
  return <PrescribedRitualCard initialPrescription={prescription} />;
}

function StatsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-gray-900/60 border-2 border-gray-500/30 rounded-xl p-6 backdrop-blur-sm">
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

function PrescribedLoading() {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 backdrop-blur-sm">
      <div className="text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto animate-pulse" />
        </div>
        <div className="h-6 w-48 bg-gray-600 rounded animate-pulse mb-2 mx-auto" />
        <div className="h-4 w-64 bg-gray-600 rounded animate-pulse mb-6 mx-auto" />
        <div className="h-10 w-40 bg-gray-600 rounded animate-pulse mx-auto" />
      </div>
    </div>
  );
}

function TodaysLoading() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-800/60 rounded-lg p-4 border border-blue-500/20">
          <div className="h-4 w-3/4 bg-gray-600 rounded animate-pulse mb-2" />
          <div className="h-3 w-1/2 bg-gray-600 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function RitualsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-gray-800/60 rounded-lg p-4 border border-cyan-500/20">
          <div className="h-5 w-3/4 bg-gray-600 rounded animate-pulse mb-3" />
          <div className="h-3 w-full bg-gray-600 rounded animate-pulse mb-2" />
          <div className="h-3 w-2/3 bg-gray-600 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
