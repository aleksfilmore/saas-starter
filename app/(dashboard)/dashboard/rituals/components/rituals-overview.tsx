import { getUserRituals } from '@/lib/db/queries';
import { CheckCircle, Clock, Target, Zap } from 'lucide-react';

export async function RitualsOverview() {
  const rituals = await getUserRituals();
  
  const totalRituals = rituals.length;
  const morningRituals = rituals.filter(r => r.category === 'morning').length;
  const eveningRituals = rituals.filter(r => r.category === 'evening').length;
  const dailyRituals = rituals.filter(r => r.targetFrequency === 'daily').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gray-900/60 border-2 border-purple-500/30 rounded-xl p-6 backdrop-blur-sm shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <Zap className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="text-purple-100/70 text-sm">Total Rituals</p>
            <p className="text-2xl font-bold text-white">{totalRituals}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/60 border-2 border-orange-500/30 rounded-xl p-6 backdrop-blur-sm shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
            <Clock className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <p className="text-orange-100/70 text-sm">Morning Rituals</p>
            <p className="text-2xl font-bold text-white">{morningRituals}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/60 border-2 border-indigo-500/30 rounded-xl p-6 backdrop-blur-sm shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <Target className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-indigo-100/70 text-sm">Evening Rituals</p>
            <p className="text-2xl font-bold text-white">{eveningRituals}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/60 border-2 border-green-500/30 rounded-xl p-6 backdrop-blur-sm shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <p className="text-green-100/70 text-sm">Daily Goals</p>
            <p className="text-2xl font-bold text-white">{dailyRituals}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
