'use client';

import { useState, useEffect } from 'react';
import { endNoContactPeriod, recordBreach } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DailyCheckIn from './daily-check-in';
import StreakShield from './streak-shield';
import { 
  Calendar, 
  Clock, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Phone, 
  MessageCircle, 
  Users, 
  MapPin,
  MoreHorizontal,
  Plus,
  Shield,
  Heart,
  TrendingUp
} from 'lucide-react';

interface Period {
  id: string;
  contactName: string;
  startDate: Date;
  targetDays: number;
  isActive: boolean;
  createdAt: Date;
  streakShieldsUsed?: number;
  maxStreakShieldsPerWeek?: number;
}

interface PeriodCardProps {
  period: Period;
}

interface DailyCheckIn {
  id: string;
  checkInDate: Date;
  didTextTrash: boolean;
  mood: number;
  hadIntrusiveThoughts: boolean;
  notes?: string;
}

export function EnhancedPeriodCard({ period }: PeriodCardProps) {
  const [showBreachForm, setShowBreachForm] = useState(false);
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [todaysCheckIn, setTodaysCheckIn] = useState<DailyCheckIn | null>(null);
  const [recentCheckIns, setRecentCheckIns] = useState<DailyCheckIn[]>([]);
  const [streakShieldData, setStreakShieldData] = useState({
    streakShieldsUsed: period.streakShieldsUsed || 0,
    maxStreakShieldsPerWeek: period.maxStreakShieldsPerWeek || 1,
  });

  const daysSinceStart = Math.floor(
    (new Date().getTime() - new Date(period.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const progress = Math.min((daysSinceStart / period.targetDays) * 100, 100);
  const isCompleted = daysSinceStart >= period.targetDays;

  // Check if user has checked in today
  useEffect(() => {
    if (period.isActive) {
      fetchTodaysCheckIn();
      fetchRecentCheckIns();
    }
  }, [period.id, period.isActive]);

  const fetchTodaysCheckIn = async () => {
    try {
      const response = await fetch(`/api/tracker/daily-checkin?periodId=${period.id}`);
      if (response.ok) {
        const data = await response.json();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayCheckIn = data.checkIns.find((checkIn: any) => {
          const checkInDate = new Date(checkIn.checkInDate);
          checkInDate.setHours(0, 0, 0, 0);
          return checkInDate.getTime() === today.getTime();
        });
        
        setTodaysCheckIn(todayCheckIn || null);
      }
    } catch (error) {
      console.error('Error fetching today\'s check-in:', error);
    }
  };

  const fetchRecentCheckIns = async () => {
    try {
      const response = await fetch(`/api/tracker/daily-checkin?periodId=${period.id}`);
      if (response.ok) {
        const data = await response.json();
        setRecentCheckIns(data.checkIns.slice(0, 7)); // Last 7 days
      }
    } catch (error) {
      console.error('Error fetching recent check-ins:', error);
    }
  };

  async function handleEndPeriod() {
    setIsSubmitting(true);
    try {
      await endNoContactPeriod(period.id);
    } catch (error) {
      console.error('Failed to end period:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRecordBreach(formData: FormData) {
    setIsSubmitting(true);
    try {
      formData.append('periodId', period.id);
      await recordBreach(formData);
      setShowBreachForm(false);
    } catch (error) {
      console.error('Failed to record breach:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCheckInComplete = () => {
    setShowDailyCheckIn(false);
    fetchTodaysCheckIn();
    fetchRecentCheckIns();
  };

  const handleShieldUsed = () => {
    setStreakShieldData(prev => ({
      ...prev,
      streakShieldsUsed: prev.streakShieldsUsed + 1
    }));
  };

  const breachTypes = [
    { value: 'call', label: 'Phone Call', icon: Phone },
    { value: 'text', label: 'Text Message', icon: MessageCircle },
    { value: 'social_media', label: 'Social Media', icon: Users },
    { value: 'in_person', label: 'In Person', icon: MapPin },
    { value: 'other', label: 'Other', icon: MoreHorizontal },
  ];

  // Calculate mood trend from recent check-ins
  const moodTrend = recentCheckIns.length >= 3 ? (() => {
    const recentMoods = recentCheckIns.slice(0, 3).map(c => c.mood);
    const average = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;
    return average >= 3.5 ? 'up' : average <= 2.5 ? 'down' : 'stable';
  })() : 'stable';

  return (
    <div className={`bg-gray-900/60 border-2 rounded-xl p-6 backdrop-blur-sm transition-all duration-300 ${
      period.isActive 
        ? 'border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]' 
        : 'border-gray-600/30 shadow-[0_0_20px_rgba(107,114,128,0.4)]'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">{period.contactName}</h3>
          <div className="flex items-center gap-2 text-sm text-cyan-100/70">
            <Calendar className="h-4 w-4" />
            Started {new Date(period.startDate).toLocaleDateString()}
          </div>
        </div>
        <div className="flex gap-2">
          {period.isActive && moodTrend !== 'stable' && (
            <div className={`px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${
              moodTrend === 'up' 
                ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                : 'bg-red-500/20 border-red-500/30 text-red-400'
            }`}>
              <TrendingUp className={`h-3 w-3 inline mr-1 ${moodTrend === 'down' ? 'rotate-180' : ''}`} />
              Mood {moodTrend === 'up' ? '↗' : '↘'}
            </div>
          )}
          <div className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${
            period.isActive
              ? isCompleted
                ? 'bg-green-500/20 border-green-500/30 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                : 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
              : 'bg-gray-500/20 border-gray-500/30 text-gray-400'
          }`}>
            {period.isActive 
              ? isCompleted ? 'Goal Reached!' : 'Active'
              : 'Completed'
            }
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-cyan-100/70">Progress</span>
          </div>
          <span className="text-sm font-medium text-white">
            {daysSinceStart} / {period.targetDays} days
          </span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2 border border-gray-600/30">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isCompleted ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-cyan-100/50">
          {isCompleted 
            ? `🎉 Congratulations! You've reached your ${period.targetDays}-day goal!`
            : `${period.targetDays - daysSinceStart} days remaining`
          }
        </p>
      </div>

      {/* Daily Check-in Status */}
      {period.isActive && (
        <div className="mb-4">
          {todaysCheckIn ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">Today's Check-in Complete</span>
              </div>
              <div className="text-xs text-green-200/70">
                Contact: {todaysCheckIn.didTextTrash ? '❌ Yes' : '✅ No'} | 
                Mood: {['😢', '😔', '😐', '🙂', '😊'][todaysCheckIn.mood - 1]} | 
                Intrusive thoughts: {todaysCheckIn.hadIntrusiveThoughts ? 'Yes' : 'No'}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-400">Daily Check-in Pending</span>
                  </div>
                  <p className="text-xs text-yellow-200/70">How are you doing today?</p>
                </div>
                <Button
                  onClick={() => setShowDailyCheckIn(true)}
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Check In
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Streak Shield */}
      {period.isActive && (
        <div className="mb-4">
          <StreakShield
            periodId={period.id}
            streakShieldsUsed={streakShieldData.streakShieldsUsed}
            maxStreakShieldsPerWeek={streakShieldData.maxStreakShieldsPerWeek}
            onShieldUsed={handleShieldUsed}
          />
        </div>
      )}

      {/* Daily Check-in Modal */}
      {showDailyCheckIn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full">
            <DailyCheckIn
              periodId={period.id}
              onCheckInComplete={handleCheckInComplete}
            />
            <div className="mt-4 text-center">
              <Button
                onClick={() => setShowDailyCheckIn(false)}
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {period.isActive && (
        <div className="space-y-3">
          {!showBreachForm ? (
            <div className="flex gap-2">
              <Button
                onClick={() => setShowBreachForm(true)}
                variant="outline"
                size="sm"
                className="flex-1 border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Record Breach
              </Button>
              {isCompleted && (
                <Button
                  onClick={handleEndPeriod}
                  disabled={isSubmitting}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete
                </Button>
              )}
            </div>
          ) : (
            <form action={handleRecordBreach} className="space-y-3 p-4 bg-gray-800/60 rounded-lg border-2 border-orange-500/30 backdrop-blur-sm shadow-[0_0_15px_rgba(249,115,22,0.4)]">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-orange-400">Record Breach</h4>
                <Button
                  type="button"
                  onClick={() => setShowBreachForm(false)}
                  variant="outline"
                  size="sm"
                  className="border-gray-500/30"
                >
                  Cancel
                </Button>
              </div>
              
              <div>
                <Label className="text-sm text-gray-300 mb-2 block">Breach Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {breachTypes.map((type) => (
                    <label key={type.value} className="flex items-center gap-2 p-2 border-2 border-gray-600/30 rounded-lg hover:bg-gray-700/30 cursor-pointer transition-all duration-200 hover:border-cyan-500/30 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                      <input
                        type="radio"
                        name="breachType"
                        value={type.value}
                        required
                        className="text-cyan-500"
                      />
                      <type.icon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-300">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm text-gray-300 mb-2 block">
                  Notes (optional)
                </Label>
                <Input
                  id="notes"
                  name="notes"
                  placeholder="What happened? How are you feeling?"
                  className="bg-gray-700/50 border-gray-600/30 text-white placeholder:text-gray-400"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Recording...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Record Breach
                  </div>
                )}
              </Button>
            </form>
          )}
        </div>
      )}

      {/* Completed Badge */}
      {!period.isActive && (
        <div className="text-center py-2">
          <div className="inline-flex items-center gap-2 text-sm text-gray-400">
            <CheckCircle className="h-4 w-4" />
            Period completed
          </div>
        </div>
      )}
    </div>
  );
}

// Keep the original PeriodCard for backward compatibility
export { PeriodCard } from './period-card';
