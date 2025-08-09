import { Card, CardContent } from '@/components/ui/card';
import { Flame } from 'lucide-react';
import { getEngagementSummary } from '@/lib/dashboard/snapshot';

export async function EngagementSummary({ streak }: { streak?: number }) {
  const engagement = await getEngagementSummary('today');
  const posts = engagement.totals.posts;
  const reactions = engagement.totals.reactions;
  const comments = engagement.totals.comments;

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold mb-3 text-white">Engagement Pulse</h3>
        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-indigo-300 text-lg font-bold">{posts}</div>
            <div className="text-[10px] text-gray-400">Posts</div>
          </div>
            <div>
            <div className="text-pink-300 text-lg font-bold">{reactions}</div>
            <div className="text-[10px] text-gray-400">Reacts</div>
          </div>
          <div>
            <div className="text-emerald-300 text-lg font-bold">{comments}</div>
            <div className="text-[10px] text-gray-400">Comments</div>
          </div>
          <div>
            <div className="text-orange-300 text-lg font-bold flex items-center justify-center"><Flame className="w-4 h-4 mr-1" />{streak ?? 0}</div>
            <div className="text-[10px] text-gray-400">Streak</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
