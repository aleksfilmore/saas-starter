'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  Calendar, 
  TrendingUp, 
  Heart, 
  Award, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Target, 
  Flame,
  Zap,
  Star,
  BookOpen,
  MessageSquare,
  BarChart3,
  Settings,
  Plus,
  Edit
} from 'lucide-react';

interface NoContactPeriod {
  id: string;
  userId: string;
  contactName: string;
  startDate: Date;
  targetDays: number;
  isActive: boolean;
  streakShieldsUsed: number;
  maxStreakShieldsPerWeek: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DailyCheckIn {
  id: string;
  checkInDate: Date;
  mood: number;
  didTextTrash: boolean;
  hadIntrusiveThoughts: boolean;
  notes?: string;
}

interface StreakShieldStatus {
  streakShieldsUsed: number;
  maxStreakShieldsPerWeek: number;
  remaining: number;
}

export default function NoContactPage() {
  const [currentPeriod, setCurrentPeriod] = useState<NoContactPeriod | null>(null);
  const [dailyCheckIns, setDailyCheckIns] = useState<DailyCheckIn[]>([]);
  const [streakShieldStatus, setStreakShieldStatus] = useState<StreakShieldStatus>({
    streakShieldsUsed: 0,
    maxStreakShieldsPerWeek: 2,
    remaining: 2
  });
  const [currentStreak, setCurrentStreak] = useState(0);
  const [showNewPeriodForm, setShowNewPeriodForm] = useState(false);
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newPeriodData, setNewPeriodData] = useState({
    contactName: '',
    targetDays: 30,
    startDate: new Date().toISOString().split('T')[0]
  });

  const [checkInData, setCheckInData] = useState({
    mood: 5,
    didTextTrash: false,
    hadIntrusiveThoughts: false,
    notes: ''
  });

  useEffect(() => {
    fetchNoContactData();
  }, []);

  const fetchNoContactData = async () => {
    try {
      setLoading(true);
      // Fetch current active period
      // const periodsResponse = await fetch('/api/tracker/no-contact/periods');
      // const periods = await periodsResponse.json();
      
      // Mock data for now since APIs are not fully implemented
      const mockPeriod: NoContactPeriod = {
        id: 'period-1',
        userId: 'user-1',
        contactName: 'Ex-Partner',
        startDate: new Date(Date.now() - (47 * 24 * 60 * 60 * 1000)), // 47 days ago
        targetDays: 90,
        isActive: true,
        streakShieldsUsed: 1,
        maxStreakShieldsPerWeek: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setCurrentPeriod(mockPeriod);
      setCurrentStreak(47);
      setStreakShieldStatus({
        streakShieldsUsed: 1,
        maxStreakShieldsPerWeek: 2,
        remaining: 1
      });

      // Mock recent check-ins
      const mockCheckIns: DailyCheckIn[] = [
        {
          id: 'checkin-1',
          checkInDate: new Date(),
          mood: 8,
          didTextTrash: false,
          hadIntrusiveThoughts: false,
          notes: 'Feeling strong today'
        },
        {
          id: 'checkin-2',
          checkInDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
          mood: 6,
          didTextTrash: false,
          hadIntrusiveThoughts: true,
          notes: 'Had some difficult moments but stayed strong'
        }
      ];
      
      setDailyCheckIns(mockCheckIns);
    } catch (error) {
      console.error('Error fetching no-contact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysRemaining = () => {
    if (!currentPeriod) return 0;
    return Math.max(0, currentPeriod.targetDays - currentStreak);
  };

  const calculateProgress = () => {
    if (!currentPeriod) return 0;
    return Math.min(100, (currentStreak / currentPeriod.targetDays) * 100);
  };

  const handleNewPeriodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to create new period
      // await fetch('/api/tracker/no-contact/periods', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newPeriodData)
      // });
      
      setShowNewPeriodForm(false);
      fetchNoContactData();
    } catch (error) {
      console.error('Error creating new period:', error);
    }
  };

  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to submit daily check-in
      // await fetch('/api/tracker/daily-checkin', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...checkInData, periodId: currentPeriod?.id })
      // });
      
      setShowCheckInForm(false);
      setCheckInData({
        mood: 5,
        didTextTrash: false,
        hadIntrusiveThoughts: false,
        notes: ''
      });
      fetchNoContactData();
    } catch (error) {
      console.error('Error submitting check-in:', error);
    }
  };

  const handleUseStreakShield = async () => {
    try {
      // TODO: Implement streak shield usage
      // await fetch('/api/tracker/streak-shield', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ periodId: currentPeriod?.id })
      // });
      
      fetchNoContactData();
    } catch (error) {
      console.error('Error using streak shield:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-lg">Loading your no-contact tracker...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Shield className="h-10 w-10 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">No-Contact Tracker</h1>
          </div>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Track your healing journey and build unbreakable strength through consistent no-contact discipline.
          </p>
        </div>

        {!currentPeriod && !showNewPeriodForm && (
          <Card className="bg-white/10 backdrop-blur-md border-blue-500/30 max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Start Your No-Contact Journey</CardTitle>
              <p className="text-blue-200">
                Begin tracking your healing progress and building mental strength.
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => setShowNewPeriodForm(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Start New No-Contact Period
              </Button>
            </CardContent>
          </Card>
        )}

        {showNewPeriodForm && (
          <Card className="bg-white/10 backdrop-blur-md border-blue-500/30 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-white">New No-Contact Period</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNewPeriodSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="contactName" className="text-white">Contact Name (Optional)</Label>
                  <Input
                    id="contactName"
                    value={newPeriodData.contactName}
                    onChange={(e) => setNewPeriodData({...newPeriodData, contactName: e.target.value})}
                    placeholder="Ex-partner, friend, etc."
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Label htmlFor="targetDays" className="text-white">Target Days</Label>
                  <Input
                    id="targetDays"
                    type="number"
                    value={newPeriodData.targetDays}
                    onChange={(e) => setNewPeriodData({...newPeriodData, targetDays: parseInt(e.target.value)})}
                    min="1"
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="startDate" className="text-white">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newPeriodData.startDate}
                    onChange={(e) => setNewPeriodData({...newPeriodData, startDate: e.target.value})}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>
                <div className="flex space-x-3">
                  <Button type="submit" className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 flex-1">
                    Start Tracking
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowNewPeriodForm(false)}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {currentPeriod && (
          <>
            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Current Streak */}
              <Card className="bg-white/10 backdrop-blur-md border-blue-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-200">Current Streak</CardTitle>
                  <Flame className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{currentStreak}</div>
                  <p className="text-xs text-blue-200 mt-1">
                    days strong
                  </p>
                </CardContent>
              </Card>

              {/* Progress */}
              <Card className="bg-white/10 backdrop-blur-md border-blue-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-200">Progress</CardTitle>
                  <Target className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{Math.round(calculateProgress())}%</div>
                  <Progress value={calculateProgress()} className="mt-2" />
                  <p className="text-xs text-blue-200 mt-1">
                    {calculateDaysRemaining()} days remaining
                  </p>
                </CardContent>
              </Card>

              {/* Streak Shields */}
              <Card className="bg-white/10 backdrop-blur-md border-blue-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-200">Streak Shields</CardTitle>
                  <Zap className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{streakShieldStatus.remaining}</div>
                  <p className="text-xs text-blue-200 mt-1">
                    available this week
                  </p>
                  {streakShieldStatus.remaining > 0 && (
                    <Button 
                      size="sm" 
                      className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-black"
                      onClick={handleUseStreakShield}
                    >
                      Use Shield
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Target Goal */}
              <Card className="bg-white/10 backdrop-blur-md border-blue-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-200">Target Goal</CardTitle>
                  <Award className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{currentPeriod.targetDays}</div>
                  <p className="text-xs text-blue-200 mt-1">
                    days total goal
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Daily Check-In */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Check-In Form */}
              <Card className="bg-white/10 backdrop-blur-md border-blue-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-white">Daily Check-In</CardTitle>
                    <Button 
                      size="sm"
                      onClick={() => setShowCheckInForm(!showCheckInForm)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      {showCheckInForm ? 'Cancel' : 'Check In'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showCheckInForm ? (
                    <form onSubmit={handleCheckInSubmit} className="space-y-4">
                      <div>
                        <Label className="text-white">Mood (1-10)</Label>
                        <Input
                          type="range"
                          min="1"
                          max="10"
                          value={checkInData.mood}
                          onChange={(e) => setCheckInData({...checkInData, mood: parseInt(e.target.value)})}
                          className="w-full"
                        />
                        <div className="text-center text-white text-2xl font-bold">{checkInData.mood}/10</div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={checkInData.didTextTrash}
                            onChange={(e) => setCheckInData({...checkInData, didTextTrash: e.target.checked})}
                            className="rounded"
                          />
                          <span className="text-white">I felt tempted to reach out</span>
                        </label>
                        
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={checkInData.hadIntrusiveThoughts}
                            onChange={(e) => setCheckInData({...checkInData, hadIntrusiveThoughts: e.target.checked})}
                            className="rounded"
                          />
                          <span className="text-white">I had intrusive thoughts</span>
                        </label>
                      </div>
                      
                      <div>
                        <Label className="text-white">Notes (Optional)</Label>
                        <Textarea
                          value={checkInData.notes}
                          onChange={(e) => setCheckInData({...checkInData, notes: e.target.value})}
                          placeholder="How are you feeling today?"
                          className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                        />
                      </div>
                      
                      <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                        Submit Check-In
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                      <p className="text-white">
                        Complete your daily check-in to track your progress and stay accountable.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Check-Ins */}
              <Card className="bg-white/10 backdrop-blur-md border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Recent Check-Ins</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dailyCheckIns.slice(0, 5).map((checkIn) => (
                      <div key={checkIn.id} className="border-b border-white/20 pb-3">
                        <div className="flex items-center justify-between">
                          <div className="text-white font-medium">
                            {checkIn.checkInDate.toLocaleDateString()}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Heart className="h-4 w-4 text-red-400" />
                            <span className="text-white">{checkIn.mood}/10</span>
                          </div>
                        </div>
                        {checkIn.notes && (
                          <p className="text-blue-200 text-sm mt-1">{checkIn.notes}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-2">
                          {checkIn.didTextTrash && (
                            <Badge variant="destructive" className="text-xs">
                              Tempted
                            </Badge>
                          )}
                          {checkIn.hadIntrusiveThoughts && (
                            <Badge variant="outline" className="text-xs">
                              Intrusive Thoughts
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Motivational Section */}
            <Card className="bg-white/10 backdrop-blur-md border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-400" />
                  Healing Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg border ${currentStreak >= 7 ? 'bg-green-500/20 border-green-500' : 'bg-white/5 border-white/20'}`}>
                    <div className="text-center">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-green-400" />
                      <h3 className="text-white font-semibold">7 Days</h3>
                      <p className="text-sm text-blue-200">Chemical detox begins</p>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${currentStreak >= 30 ? 'bg-blue-500/20 border-blue-500' : 'bg-white/5 border-white/20'}`}>
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                      <h3 className="text-white font-semibold">30 Days</h3>
                      <p className="text-sm text-blue-200">Emotional stability</p>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${currentStreak >= 90 ? 'bg-purple-500/20 border-purple-500' : 'bg-white/5 border-white/20'}`}>
                    <div className="text-center">
                      <Award className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                      <h3 className="text-white font-semibold">90 Days</h3>
                      <p className="text-sm text-blue-200">Full psychological reset</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="bg-white/10 border border-white/30 text-white hover:bg-white/20 h-20 flex-col">
                <BarChart3 className="h-6 w-6 mb-2" />
                View Analytics
              </Button>
              
              <Button className="bg-white/10 border border-white/30 text-white hover:bg-white/20 h-20 flex-col">
                <BookOpen className="h-6 w-6 mb-2" />
                Healing Resources
              </Button>
              
              <Button className="bg-white/10 border border-white/30 text-white hover:bg-white/20 h-20 flex-col">
                <MessageSquare className="h-6 w-6 mb-2" />
                Support Community
              </Button>
              
              <Button className="bg-white/10 border border-white/30 text-white hover:bg-white/20 h-20 flex-col">
                <Settings className="h-6 w-6 mb-2" />
                Tracker Settings
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}