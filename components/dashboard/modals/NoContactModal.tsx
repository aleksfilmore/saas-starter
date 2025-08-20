"use client";

import { useState, useEffect } from 'react';
import { useHealingHub } from '@/contexts/HealingHubContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface Props {
  onClose: () => void;
  onComplete: () => void;
}

interface NoContactEntry {
  date: string;
  status: 'success' | 'struggle' | 'failure';
  note?: string;
}

export function NoContactModal({ onClose, onComplete }: Props) {
  const { noContact, checkInNoContact } = useHealingHub();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [hasCheckedToday, setHasCheckedToday] = useState(false);

  useEffect(() => {
    if (noContact) {
      setCurrentStreak(noContact.currentStreak);
      setHasCheckedToday(noContact.status === 'checked_in_today' || noContact.status === 'ok');
    }
  }, [noContact]);
  
  // Mock recent entries
  const [recentEntries] = useState<NoContactEntry[]>([
    { date: '2024-01-08', status: 'success' },
    { date: '2024-01-07', status: 'success' },
    { date: '2024-01-06', status: 'struggle', note: 'Wanted to text but used breathing exercise' },
    { date: '2024-01-05', status: 'success' },
    { date: '2024-01-04', status: 'success' },
  ]);

  const handleDailyCheckIn = async (status: 'success' | 'struggle' | 'failure') => {
    // For now treat all as PATCH check-in (server only supports success path). Failure handling to be added separately.
    if (status === 'failure') {
      // Placeholder: could call a future endpoint to reset
      setCurrentStreak(0);
      setHasCheckedToday(true);
      onComplete();
      return;
    }
    const ok = await checkInNoContact();
    if (ok) {
      setHasCheckedToday(true);
      setCurrentStreak(prev => prev + 1);
      setTotalDays(prev => prev + 1);
      onComplete();
    }
  };

  const getStreakColor = () => {
    if (currentStreak < 7) return 'text-amber-400';
    if (currentStreak < 30) return 'text-emerald-400';
    return 'text-cyan-400';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case 'struggle':
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case 'failure':
        return <Heart className="h-4 w-4 text-rose-400" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success':
        return 'Strong Day';
      case 'struggle':
        return 'Challenging';
      case 'failure':
        return 'Reset Day';
      default:
        return '';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-cyan-400" />
            <span>No Contact Tracker</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-slate-800 border-slate-600">
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${getStreakColor()}`}>
                  {currentStreak}
                </div>
                <div className="text-sm text-slate-400 flex items-center justify-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Current Streak
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-600">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  {totalDays}
                </div>
                <div className="text-sm text-slate-400 flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Total Days
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Check-in */}
    {!hasCheckedToday ? (
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-center text-lg">How did today go?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleDailyCheckIn('success')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
      disabled={!noContact?.canCheckIn}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Strong Day - No Contact
                </Button>
                
                <Button
                  onClick={() => handleDailyCheckIn('struggle')}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
      disabled={!noContact?.canCheckIn}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Challenging - But Stayed Strong
                </Button>
                
                <Button
                  onClick={() => handleDailyCheckIn('failure')}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white"
      disabled={!noContact?.canCheckIn}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Made Contact - Reset & Restart
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-emerald-900/30 border-emerald-600">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                <div className="text-emerald-400 font-semibold">Today's check-in complete!</div>
                <div className="text-sm text-slate-400">Keep up the amazing work</div>
              </CardContent>
            </Card>
          )}

          {/* Motivation */}
          <Card className="bg-cyan-900/30 border-cyan-600">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-cyan-400 font-semibold mb-1">
                  {currentStreak >= 30 ? "You're a No Contact Champion!" :
                   currentStreak >= 14 ? "Two weeks strong - incredible progress!" :
                   currentStreak >= 7 ? "One week milestone reached!" :
                   "Every day is progress - keep going!"}
                </div>
                <div className="text-xs text-slate-400">
                  Remember: Each day of no contact is a step toward healing and self-respect.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
