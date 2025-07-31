import { getUserRituals } from '@/lib/db/queries';
import { RitualCard } from './ritual-card';
import { Calendar } from 'lucide-react';

export async function RitualsList() {
  const rituals = await getUserRituals();

  // Until full schema is migrated, rituals are not available
  // Show a placeholder message
  return (
    <div className="text-center py-8">
      <div className="p-4 bg-cyan-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-cyan-500/20">
        <Calendar className="h-8 w-8 text-cyan-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Rituals feature coming soon</h3>
      <p className="text-cyan-100/70">
        Rituals functionality is being updated and will be available once schema migration is complete.
      </p>
    </div>
  );
}
