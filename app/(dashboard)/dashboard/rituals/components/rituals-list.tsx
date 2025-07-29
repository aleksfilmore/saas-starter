import { getUserRituals } from '@/lib/db/queries';
import { RitualCard } from './ritual-card';
import { Calendar } from 'lucide-react';

export async function RitualsList() {
  const rituals = await getUserRituals();

  if (rituals.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="p-4 bg-cyan-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-cyan-500/20">
          <Calendar className="h-8 w-8 text-cyan-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No rituals created yet</h3>
        <p className="text-cyan-100/70">
          Create your first ritual above to start building empowering daily habits.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {rituals.map((ritual) => (
        <RitualCard key={ritual.id} ritual={ritual} />
      ))}
    </div>
  );
}
