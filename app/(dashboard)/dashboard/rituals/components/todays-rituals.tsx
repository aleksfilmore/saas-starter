import { getTodaysRitualCompletions } from '@/lib/db/queries';
import { RitualCompletionCard } from './ritual-completion-card';
import { CalendarX } from 'lucide-react';

export async function TodaysRituals() {
  const todaysRituals = await getTodaysRitualCompletions();

  if (todaysRituals.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="p-4 bg-blue-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-blue-500/20">
          <CalendarX className="h-8 w-8 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No rituals yet</h3>
        <p className="text-blue-100/70">
          Create your first ritual above to start building powerful daily habits.
        </p>
      </div>
    );
  }

  const completedCount = todaysRituals.filter(r => r.completed).length;
  const totalCount = todaysRituals.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-blue-100/70">
          {completedCount} of {totalCount} rituals completed today
        </p>
        <div className="flex items-center gap-2">
          <div className="w-24 bg-gray-700/50 rounded-full h-2 border border-gray-600/30">
            <div 
              className="h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] transition-all duration-300"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
          <span className="text-sm text-blue-400 font-medium">
            {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {todaysRituals.map(({ ritual, completed, completion }) => (
          <RitualCompletionCard
            key={ritual.id}
            ritual={ritual}
            completed={completed}
            completion={completion}
          />
        ))}
      </div>
    </div>
  );
}
