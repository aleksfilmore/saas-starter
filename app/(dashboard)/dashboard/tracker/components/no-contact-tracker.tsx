import { getUserNoContactPeriods } from '@/lib/db/queries';
import { EnhancedPeriodCard } from './enhanced-period-card';
import { Calendar, Clock, User } from 'lucide-react';

export async function NoContactTracker() {
  const periods = await getUserNoContactPeriods();

  if (periods.length === 0) {
    return (
      <div className="bg-gray-900/60 border-2 border-cyan-500/30 rounded-xl p-8 text-center backdrop-blur-sm shadow-[0_0_20px_rgba(6,182,212,0.4)]">
        <div className="p-4 bg-cyan-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-cyan-500/20">
          <Calendar className="h-8 w-8 text-cyan-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No tracking periods yet</h3>
        <p className="text-cyan-100/70">
          Start your first no contact period above to begin your healing journey.
        </p>
      </div>
    );
  }

  const activePeriods = periods.filter(p => p.isActive);
  const pastPeriods = periods.filter(p => !p.isActive);

  return (
    <div className="space-y-8">
      {/* Active Periods */}
      {activePeriods.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
              <Clock className="h-5 w-5 text-green-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Active Periods</h2>
            <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
              <span className="text-green-400 text-sm font-medium">{activePeriods.length}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activePeriods.map((period) => (
              <EnhancedPeriodCard key={period.id} period={period} />
            ))}
          </div>
        </div>
      )}

      {/* Past Periods */}
      {pastPeriods.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <User className="h-5 w-5 text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Completed Periods</h2>
            <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
              <span className="text-blue-400 text-sm font-medium">{pastPeriods.length}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pastPeriods.map((period) => (
              <EnhancedPeriodCard key={period.id} period={period} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
