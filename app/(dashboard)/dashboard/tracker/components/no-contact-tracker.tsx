import { getUserNoContactPeriods } from '@/lib/db/queries';
import { EnhancedPeriodCard } from './enhanced-period-card';
import { Calendar, Clock, User } from 'lucide-react';

export async function NoContactTracker() {
  const periods = await getUserNoContactPeriods();

  // Until full schema is migrated, show placeholder message
  return (
    <div className="bg-gray-900/60 border-2 border-cyan-500/30 rounded-xl p-8 text-center backdrop-blur-sm shadow-[0_0_20px_rgba(6,182,212,0.4)]">
      <div className="p-4 bg-cyan-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-cyan-500/20">
        <Calendar className="h-8 w-8 text-cyan-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Tracker feature coming soon</h3>
      <p className="text-cyan-100/70">
        No-contact tracking will be available once schema migration is complete.
      </p>
    </div>
  );
}
