import { getTodaysRitualCompletions } from '@/lib/db/queries';
import { RitualCompletionCard } from './ritual-completion-card';
import { CalendarX } from 'lucide-react';

export async function TodaysRituals() {
  const todaysRituals = await getTodaysRitualCompletions();

  // Until full schema is migrated, show placeholder message
  return (
    <div className="text-center py-8">
      <div className="p-4 bg-blue-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-blue-500/20">
        <CalendarX className="h-8 w-8 text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Rituals feature coming soon</h3>
      <p className="text-blue-100/70">
        Daily ritual tracking will be available once schema migration is complete.
      </p>
    </div>
  );
}
