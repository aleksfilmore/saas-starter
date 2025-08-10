"use client";

import { useState, useEffect } from 'react';
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
  const [currentStreak, setCurrentStreak] = useState(14);
  const [totalDays, setTotalDays] = useState(47);
  const [hasCheckedToday, setHasCheckedToday] = useState(false);
  
  // Check if user has already checked in today
  useEffect(() => {
    const today = new Date().toDateString();
    const todayCheckin = localStorage.getItem(`no-contact-checkin-${today}`);
    if (todayCheckin) {
      const checkinData = JSON.parse(todayCheckin);
      setCurrentStreak(checkinData.streak);
      setHasCheckedToday(true);
    }
  }, []);
  
  // Mock recent entries
  const [recentEntries] = useState<NoContactEntry[]>([
    { date: '2024-01-08', status: 'success' },
    { date: '2024-01-07', status: 'success' },
    { date: '2024-01-06', status: 'struggle', note: 'Wanted to text but used breathing exercise' },
    { date: '2024-01-05', status: 'success' },
    { date: '2024-01-04', status: 'success' },
  ]);

  const handleDailyCheckIn = async (status: 'success' | 'struggle' | 'failure') => {
    setHasCheckedToday(true);
    
    let newStreak = currentStreak;
    if (status === 'success' || status === 'struggle') {
      newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
    } else if (status === 'failure') {
      newStreak = 0;
      setCurrentStreak(0);
    }
    
    setTotalDays(prev => prev + 1);

    // Save to localStorage for today
    const today = new Date().toDateString();
    localStorage.setItem(`no-contact-checkin-${today}`, JSON.stringify({
      status,
      streak: newStreak,
      date: today
    }));

    // Here you would typically save to database
    try {
      await fetch('/api/no-contact/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, streak: newStreak })
      });
    } catch (error) {
      console.error('Failed to save check-in:', error);
    }

    onComplete();
  };

  const getStreakColor = () => {
    if (currentStreak < 7) return 'text-yellow-400';
    if (currentStreak < 30) return 'text-orange-400';
    return 'text-green-400';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'struggle':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'failure':
        return <Heart className="h-4 w-4 text-red-400" />;
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
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-400" />
            <span>No Contact Tracker</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${getStreakColor()}`}>
                  {currentStreak}
                </div>
                <div className="text-sm text-gray-400 flex items-center justify-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Current Streak
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {totalDays}
                </div>
                <div className="text-sm text-gray-400 flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Total Days
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Check-in */}
          {!hasCheckedToday ? (
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-center text-lg">How did today go?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleDailyCheckIn('success')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Strong Day - No Contact
                </Button>
                
                <Button
                  onClick={() => handleDailyCheckIn('struggle')}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Challenging - But Stayed Strong
                </Button>
                
                <Button
                  onClick={() => handleDailyCheckIn('failure')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Made Contact - Reset & Restart
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-green-900/20 border-green-600">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-green-400 font-semibold">Today's check-in complete!</div>
                <div className="text-sm text-gray-400">Keep up the amazing work</div>
              </CardContent>
            </Card>
          )}

          {/* Recent History */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Recent History</h3>
            <div className="space-y-2">
              {recentEntries.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(entry.status)}
                    <span className="text-sm">{entry.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {getStatusLabel(entry.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Motivation */}
          <Card className="bg-blue-900/20 border-blue-600">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-blue-400 font-semibold mb-1">
                  {currentStreak >= 30 ? "You're a No Contact Champion!" :
                   currentStreak >= 14 ? "Two weeks strong - incredible progress!" :
                   currentStreak >= 7 ? "One week milestone reached!" :
                   "Every day is progress - keep going!"}
                </div>
                <div className="text-xs text-gray-400">
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
