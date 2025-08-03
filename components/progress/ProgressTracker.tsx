"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award, 
  BarChart3, 
  Activity,
  Heart,
  Brain,
  Zap,
  Shield,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
  Trophy
} from "lucide-react";

interface DailyProgress {
  date: string;
  moodScore: number | null;
  gratitudeEntries: number;
  breathingMinutes: number;
  mindfulnessMinutes: number;
  aiConversations: number;
  wallPosts: number;
  crisisSupport: boolean;
  completed: boolean;
}

interface WeeklyGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  category: 'mental' | 'social' | 'spiritual' | 'emotional';
  icon: React.ReactNode;
}

interface Milestone {
  id: string;
  name: string;
  description: string;
  requirement: string;
  achieved: boolean;
  achievedDate?: Date;
  progress: number;
  category: string;
  icon: string;
  reward: number;
}

interface ProgressTrackerProps {
  onGoalUpdate?: (goalId: string, progress: number) => void;
  onMilestoneAchieved?: (milestoneId: string) => void;
}

// Mock data for the last 30 days
const generateMockProgress = (): DailyProgress[] => {
  const progress: DailyProgress[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const hasActivity = Math.random() > 0.2; // 80% chance of activity
    
    progress.push({
      date: date.toISOString().split('T')[0],
      moodScore: hasActivity ? Math.floor(Math.random() * 5) + 1 : null,
      gratitudeEntries: hasActivity ? Math.floor(Math.random() * 3) : 0,
      breathingMinutes: hasActivity ? Math.floor(Math.random() * 20) : 0,
      mindfulnessMinutes: hasActivity ? Math.floor(Math.random() * 15) : 0,
      aiConversations: hasActivity ? Math.floor(Math.random() * 3) : 0,
      wallPosts: Math.random() > 0.7 ? Math.floor(Math.random() * 2) + 1 : 0,
      crisisSupport: Math.random() > 0.95,
      completed: hasActivity
    });
  }
  
  return progress;
};

const WEEKLY_GOALS: WeeklyGoal[] = [
  {
    id: 'mood-checkins',
    name: 'Mood Check-ins',
    target: 7,
    current: 5,
    unit: 'times',
    category: 'emotional',
    icon: <Heart className="w-4 h-4" />
  },
  {
    id: 'gratitude-entries',
    name: 'Gratitude Entries',
    target: 10,
    current: 7,
    unit: 'entries',
    category: 'spiritual',
    icon: <Star className="w-4 h-4" />
  },
  {
    id: 'breathing-minutes',
    name: 'Breathing Practice',
    target: 60,
    current: 35,
    unit: 'minutes',
    category: 'mental',
    icon: <Brain className="w-4 h-4" />
  },
  {
    id: 'mindfulness-minutes',
    name: 'Mindfulness Time',
    target: 45,
    current: 28,
    unit: 'minutes',
    category: 'mental',
    icon: <Zap className="w-4 h-4" />
  },
  {
    id: 'ai-conversations',
    name: 'AI Conversations',
    target: 5,
    current: 8,
    unit: 'chats',
    category: 'social',
    icon: <Activity className="w-4 h-4" />
  }
];

const MILESTONES: Milestone[] = [
  {
    id: 'first-week',
    name: 'First Week Warrior',
    description: 'Complete 7 consecutive days of activities',
    requirement: '7 day streak',
    achieved: true,
    achievedDate: new Date('2024-01-15'),
    progress: 100,
    category: 'Consistency',
    icon: '🔥',
    reward: 100
  },
  {
    id: 'mood-master',
    name: 'Mood Master',
    description: 'Log your mood 30 times',
    requirement: '30 mood check-ins',
    achieved: true,
    achievedDate: new Date('2024-01-20'),
    progress: 100,
    category: 'Self-Awareness',
    icon: '😊',
    reward: 150
  },
  {
    id: 'gratitude-guru',
    name: 'Gratitude Guru',
    description: 'Write 50 gratitude entries',
    requirement: '50 gratitude entries',
    achieved: false,
    progress: 78,
    category: 'Mindfulness',
    icon: '🙏',
    reward: 200
  },
  {
    id: 'breath-master',
    name: 'Breath Master',
    description: 'Complete 100 breathing exercises',
    requirement: '100 breathing sessions',
    achieved: false,
    progress: 65,
    category: 'Wellness',
    icon: '🫁',
    reward: 250
  },
  {
    id: 'ai-friend',
    name: 'AI Companion',
    description: 'Have 100 meaningful AI conversations',
    requirement: '100 AI conversations',
    achieved: false,
    progress: 45,
    category: 'Connection',
    icon: '🤖',
    reward: 300
  },
  {
    id: 'community-builder',
    name: 'Community Builder',
    description: 'Make 50 posts on the Wall of Wounds',
    requirement: '50 wall posts',
    achieved: false,
    progress: 46,
    category: 'Community',
    icon: '🛡️',
    reward: 350
  }
];

export function ProgressTracker({ onGoalUpdate, onMilestoneAchieved }: ProgressTrackerProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month'>('week');
  const [progressData, setProgressData] = useState<DailyProgress[]>([]);
  const [currentStreak, setCurrentStreak] = useState(7);

  useEffect(() => {
    setProgressData(generateMockProgress());
  }, []);

  const getStreakData = () => {
    let streak = 0;
    let maxStreak = 0;
    let currentStreak = 0;
    
    // Count from most recent backwards
    for (let i = progressData.length - 1; i >= 0; i--) {
      if (progressData[i].completed) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        if (i === progressData.length - 1) {
          // If today is incomplete, streak is 0
          streak = 0;
        } else {
          streak = currentStreak;
        }
        currentStreak = 0;
      }
    }
    
    return { current: streak || currentStreak, max: maxStreak };
  };

  const getWeeklyStats = () => {
    const lastWeek = progressData.slice(-7);
    return {
      activeDays: lastWeek.filter(day => day.completed).length,
      totalMoodCheckins: lastWeek.reduce((sum, day) => sum + (day.moodScore ? 1 : 0), 0),
      totalGratitude: lastWeek.reduce((sum, day) => sum + day.gratitudeEntries, 0),
      totalBreathing: lastWeek.reduce((sum, day) => sum + day.breathingMinutes, 0),
      totalMindfulness: lastWeek.reduce((sum, day) => sum + day.mindfulnessMinutes, 0),
      totalAIChats: lastWeek.reduce((sum, day) => sum + day.aiConversations, 0)
    };
  };

  const getGoalProgress = (goalId: string) => {
    const goal = WEEKLY_GOALS.find(g => g.id === goalId);
    if (!goal) return 0;
    return Math.min(100, (goal.current / goal.target) * 100);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emotional': return 'text-pink-400 border-pink-500/50';
      case 'mental': return 'text-blue-400 border-blue-500/50';
      case 'spiritual': return 'text-purple-400 border-purple-500/50';
      case 'social': return 'text-green-400 border-green-500/50';
      default: return 'text-gray-400 border-gray-500/50';
    }
  };

  const streakData = getStreakData();
  const weeklyStats = getWeeklyStats();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <TrendingUp className="w-4 h-4 mr-2" />
          Progress
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl bg-gray-900 border-green-500/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-400 text-center flex items-center justify-center">
            <BarChart3 className="w-6 h-6 mr-2" />
            Healing Progress Tracker
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Streak & Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
              <CardContent className="p-4 text-center">
                <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-orange-400">{streakData.current}</div>
                <div className="text-sm text-gray-300">Current Streak</div>
                <div className="text-xs text-gray-400 mt-1">Max: {streakData.max} days</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-400">{weeklyStats.activeDays}</div>
                <div className="text-sm text-gray-300">Active Days</div>
                <div className="text-xs text-gray-400 mt-1">This Week</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border-green-500/30">
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-green-400">{MILESTONES.filter(m => m.achieved).length}</div>
                <div className="text-sm text-gray-300">Milestones</div>
                <div className="text-xs text-gray-400 mt-1">Achieved</div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Goals */}
          <Card className="bg-gray-800/50 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Weekly Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {WEEKLY_GOALS.map((goal) => {
                const progress = getGoalProgress(goal.id);
                const isCompleted = goal.current >= goal.target;
                
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1 rounded ${getCategoryColor(goal.category)}`}>
                          {goal.icon}
                        </div>
                        <span className="text-white font-medium">{goal.name}</span>
                        {isCompleted && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">
                          {goal.current} / {goal.target} {goal.unit}
                        </div>
                        <div className="text-xs text-gray-400">
                          {Math.round(progress)}% complete
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isCompleted 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-500'
                        }`}
                        style={{ width: `${Math.min(100, progress)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Activity Calendar */}
          <Card className="bg-gray-800/50 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Activity Calendar (Last 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-10 gap-1">
                {progressData.map((day, index) => {
                  const date = new Date(day.date);
                  const isToday = day.date === new Date().toISOString().split('T')[0];
                  
                  return (
                    <div
                      key={index}
                      className={`aspect-square rounded text-xs flex items-center justify-center transition-all hover:scale-110 ${
                        day.completed
                          ? 'bg-green-500 text-white'
                          : day.moodScore || day.gratitudeEntries || day.breathingMinutes
                          ? 'bg-yellow-500/50 text-yellow-200'
                          : 'bg-gray-700 text-gray-400'
                      } ${isToday ? 'ring-2 ring-blue-400' : ''}`}
                      title={`${date.toLocaleDateString()}: ${day.completed ? 'Active' : 'Partial/Inactive'}`}
                    >
                      {date.getDate()}
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-700 rounded"></div>
                  <span className="text-gray-400">Inactive</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500/50 rounded"></div>
                  <span className="text-gray-400">Partial</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-400">Complete</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-400 rounded ring-1 ring-blue-400"></div>
                  <span className="text-gray-400">Today</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card className="bg-gray-800/50 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Achievement Milestones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {MILESTONES.map((milestone) => (
                <div 
                  key={milestone.id}
                  className={`p-4 rounded-lg border transition-all ${
                    milestone.achieved
                      ? 'bg-yellow-500/10 border-yellow-500/50'
                      : 'bg-gray-700/30 border-gray-600/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className={`text-2xl ${milestone.achieved ? '' : 'grayscale opacity-50'}`}>
                        {milestone.icon}
                      </div>
                      <div>
                        <h4 className={`font-bold ${milestone.achieved ? 'text-yellow-400' : 'text-gray-300'}`}>
                          {milestone.name}
                        </h4>
                        <p className="text-sm text-gray-400">{milestone.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{milestone.requirement}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {milestone.achieved ? (
                        <div>
                          <CheckCircle2 className="w-6 h-6 text-yellow-400 mx-auto" />
                          <div className="text-xs text-gray-400 mt-1">
                            {milestone.achievedDate?.toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-lg font-bold text-white">{milestone.progress}%</div>
                          <div className="text-xs text-gray-400">Complete</div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!milestone.achieved && (
                    <div className="space-y-2">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${milestone.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-3">
                    <Badge className={`${milestone.achieved ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 'bg-gray-600/20 text-gray-400 border-gray-600/50'}`}>
                      {milestone.category}
                    </Badge>
                    <div className="text-sm">
                      <span className="text-gray-400">Reward: </span>
                      <span className="text-purple-400 font-bold">+{milestone.reward} points</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weekly Summary */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-4 text-center">This Week's Healing Journey</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-pink-400">{weeklyStats.totalMoodCheckins}</div>
                  <div className="text-xs text-gray-400">Mood Check-ins</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">{weeklyStats.totalGratitude}</div>
                  <div className="text-xs text-gray-400">Gratitude Entries</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">{weeklyStats.totalBreathing}m</div>
                  <div className="text-xs text-gray-400">Breathing Practice</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">{weeklyStats.totalMindfulness}m</div>
                  <div className="text-xs text-gray-400">Mindfulness Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">{weeklyStats.totalAIChats}</div>
                  <div className="text-xs text-gray-400">AI Conversations</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-400">{weeklyStats.activeDays}/7</div>
                  <div className="text-xs text-gray-400">Active Days</div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border-purple-500/50">
                  {weeklyStats.activeDays >= 5 
                    ? "🔥 Incredible consistency this week!" 
                    : weeklyStats.activeDays >= 3 
                    ? "💪 Good progress, keep it up!" 
                    : "🌱 Every step counts, you're growing!"
                  }
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
