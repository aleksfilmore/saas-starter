"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, Clock, CheckCircle, Target, Zap, Star, 
  AlertTriangle, Heart, Brain, Shield, Sparkles
} from 'lucide-react';

interface ProtocolDay {
  day: number;
  task: string;
  week: number;
  theme: string;
  type: 'daily' | 'therapy' | 'emergency' | 'bonus';
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  estimatedTime: string;
  emotionalFocus: ('numb' | 'vengeance' | 'logic' | 'helpOthers')[];
}

interface RecommendedActivitiesProps {
  userDay: number;
  userWeek: number;
  emotionalTone: 'numb' | 'vengeance' | 'logic' | 'helpOthers';
  completedTasks: string[];
  onCompleteTask: (taskId: string, xp: number) => void;
  protocolType: '30-day' | '90-day';
}

// Protocol data based on the provided reformat protocol
const PROTOCOL_DATA: Record<number, ProtocolDay[]> = {
  1: [
    {
      day: 1,
      task: "Delete the chat thread. Block the number. Burn the evidence.",
      week: 1,
      theme: "SYSTEM SHOCK",
      type: 'daily',
      difficulty: 'hard',
      xpReward: 100,
      estimatedTime: "15 mins",
      emotionalFocus: ['numb', 'vengeance']
    },
    {
      day: 2,
      task: "Make a private audio note: 60 seconds of raw rage or grief. Delete it.",
      week: 1,
      theme: "SYSTEM SHOCK",
      type: 'daily',
      difficulty: 'medium',
      xpReward: 75,
      estimatedTime: "5 mins",
      emotionalFocus: ['numb', 'vengeance']
    },
    {
      day: 3,
      task: "Screenshot your worst message sent to them. Then delete it.",
      week: 1,
      theme: "SYSTEM SHOCK",
      type: 'daily',
      difficulty: 'medium',
      xpReward: 75,
      estimatedTime: "10 mins",
      emotionalFocus: ['logic', 'numb']
    },
    {
      day: 4,
      task: "Emergency Ritual: \"Did you stalk their profile today?\" If yes → meltdown protocol.",
      week: 1,
      theme: "SYSTEM SHOCK",
      type: 'emergency',
      difficulty: 'easy',
      xpReward: 50,
      estimatedTime: "5 mins",
      emotionalFocus: ['numb', 'logic']
    },
    {
      day: 5,
      task: "Clean your space like you're exorcising their scent.",
      week: 1,
      theme: "SYSTEM SHOCK",
      type: 'daily',
      difficulty: 'medium',
      xpReward: 100,
      estimatedTime: "30 mins",
      emotionalFocus: ['logic', 'vengeance']
    },
    {
      day: 6,
      task: "\"I Miss Them\" Script Rewrite — Replace that longing with sarcasm or truth.",
      week: 1,
      theme: "SYSTEM SHOCK",
      type: 'daily',
      difficulty: 'medium',
      xpReward: 75,
      estimatedTime: "20 mins",
      emotionalFocus: ['logic', 'vengeance']
    },
    {
      day: 7,
      task: "AI Therapy: \"Unplug Protocol\" — What if you never get closure?",
      week: 1,
      theme: "SYSTEM SHOCK",
      type: 'therapy',
      difficulty: 'hard',
      xpReward: 200,
      estimatedTime: "45 mins",
      emotionalFocus: ['numb', 'logic', 'helpOthers']
    }
  ],
  2: [
    {
      day: 8,
      task: "List 5 \"brainworms\" they planted (e.g., \"You're too much\") — and challenge them.",
      week: 2,
      theme: "MALWARE SCAN",
      type: 'daily',
      difficulty: 'medium',
      xpReward: 75,
      estimatedTime: "15 mins",
      emotionalFocus: ['logic', 'vengeance']
    },
    {
      day: 9,
      task: "Trigger Map — Identify what sets off spirals (songs, places, Instagram filters).",
      week: 2,
      theme: "MALWARE SCAN",
      type: 'daily',
      difficulty: 'medium',
      xpReward: 100,
      estimatedTime: "20 mins",
      emotionalFocus: ['logic', 'numb']
    },
    {
      day: 10,
      task: "Install a mental firewall: What's one boundary you're now enforcing?",
      week: 2,
      theme: "MALWARE SCAN",
      type: 'daily',
      difficulty: 'medium',
      xpReward: 100,
      estimatedTime: "15 mins",
      emotionalFocus: ['logic', 'helpOthers']
    },
    {
      day: 11,
      task: "Emergency Ritual: \"Run Mind Virus Cleanser\" — Write a 'WTF was I thinking?' list.",
      week: 2,
      theme: "MALWARE SCAN",
      type: 'emergency',
      difficulty: 'easy',
      xpReward: 50,
      estimatedTime: "10 mins",
      emotionalFocus: ['vengeance', 'logic']
    },
    {
      day: 12,
      task: "Notice the loop: What memory keeps replaying? Rename it like a bad file.",
      week: 2,
      theme: "MALWARE SCAN",
      type: 'daily',
      difficulty: 'medium',
      xpReward: 75,
      estimatedTime: "15 mins",
      emotionalFocus: ['logic', 'numb']
    },
    {
      day: 13,
      task: "Block a mutual. Yep, even their mom.",
      week: 2,
      theme: "MALWARE SCAN",
      type: 'daily',
      difficulty: 'hard',
      xpReward: 100,
      estimatedTime: "5 mins",
      emotionalFocus: ['vengeance', 'logic']
    },
    {
      day: 14,
      task: "AI Therapy: \"Cognitive Cleanup Crew\" — Investigate your thought distortions.",
      week: 2,
      theme: "MALWARE SCAN",
      type: 'therapy',
      difficulty: 'hard',
      xpReward: 200,
      estimatedTime: "45 mins",
      emotionalFocus: ['logic', 'helpOthers']
    }
  ],
  3: [
    {
      day: 15,
      task: "Start a new ritual: every morning, speak out your codename and one core value.",
      week: 3,
      theme: "REPROGRAMMING",
      type: 'daily',
      difficulty: 'easy',
      xpReward: 75,
      estimatedTime: "5 mins",
      emotionalFocus: ['logic', 'helpOthers']
    },
    {
      day: 16,
      task: "Do one thing your ex hated (the food, the playlist, the lipstick). Revel in it.",
      week: 3,
      theme: "REPROGRAMMING",
      type: 'daily',
      difficulty: 'medium',
      xpReward: 100,
      estimatedTime: "30 mins",
      emotionalFocus: ['vengeance', 'logic']
    },
    {
      day: 17,
      task: "Anchor a memory — wear something bold, then take a self-portrait and name it.",
      week: 3,
      theme: "REPROGRAMMING",
      type: 'daily',
      difficulty: 'medium',
      xpReward: 100,
      estimatedTime: "20 mins",
      emotionalFocus: ['logic', 'helpOthers']
    },
    {
      day: 18,
      task: "Emergency Ritual: \"Run Joy Surge\" — find a song that makes you dance like a glitch.",
      week: 3,
      theme: "REPROGRAMMING",
      type: 'emergency',
      difficulty: 'easy',
      xpReward: 75,
      estimatedTime: "10 mins",
      emotionalFocus: ['logic', 'helpOthers']
    },
    {
      day: 19,
      task: "Introduce a new mantra. Examples: \"Emotion ≠ truth\" or \"He's not texting for a reason.\"",
      week: 3,
      theme: "REPROGRAMMING",
      type: 'daily',
      difficulty: 'easy',
      xpReward: 50,
      estimatedTime: "10 mins",
      emotionalFocus: ['logic', 'numb']
    },
    {
      day: 20,
      task: "Perform a small act of rebellion. Document it. Bonus: Post it anonymously to the Wall.",
      week: 3,
      theme: "REPROGRAMMING",
      type: 'daily',
      difficulty: 'medium',
      xpReward: 100,
      estimatedTime: "25 mins",
      emotionalFocus: ['vengeance', 'helpOthers']
    },
    {
      day: 21,
      task: "AI Therapy: \"Identity Update.exe\" — Start designing who you are without them.",
      week: 3,
      theme: "REPROGRAMMING",
      type: 'therapy',
      difficulty: 'hard',
      xpReward: 250,
      estimatedTime: "50 mins",
      emotionalFocus: ['logic', 'helpOthers']
    }
  ],
  4: [
    {
      day: 22,
      task: "No Contact Check-in — Day count, current risk level, do you need reinforcement?",
      week: 4,
      theme: "SYSTEM STABILIZED",
      type: 'daily',
      difficulty: 'medium',
      xpReward: 100,
      estimatedTime: "15 mins",
      emotionalFocus: ['logic', 'numb']
    },
    {
      day: 23,
      task: "Reflect: Who are you becoming that they couldn't handle? Celebrate it.",
      week: 4,
      theme: "SYSTEM STABILIZED",
      type: 'daily',
      difficulty: 'medium',
      xpReward: 100,
      estimatedTime: "20 mins",
      emotionalFocus: ['logic', 'helpOthers']
    },
    {
      day: 24,
      task: "Declutter your feeds. Add 3 creators who represent the version of you you're building.",
      week: 4,
      theme: "SYSTEM STABILIZED",
      type: 'daily',
      difficulty: 'easy',
      xpReward: 75,
      estimatedTime: "15 mins",
      emotionalFocus: ['logic', 'helpOthers']
    },
    {
      day: 25,
      task: "Emergency Ritual: \"Red Alert Mode\" — Pre-write a message you won't send.",
      week: 4,
      theme: "SYSTEM STABILIZED",
      type: 'emergency',
      difficulty: 'medium',
      xpReward: 75,
      estimatedTime: "10 mins",
      emotionalFocus: ['vengeance', 'logic']
    },
    {
      day: 26,
      task: "Burn a bridge — symbolic or real. Make it cathartic.",
      week: 4,
      theme: "SYSTEM STABILIZED",
      type: 'daily',
      difficulty: 'hard',
      xpReward: 150,
      estimatedTime: "30 mins",
      emotionalFocus: ['vengeance', 'logic']
    },
    {
      day: 27,
      task: "Write a list titled \"The Standards I Refuse to Lower Again.\"",
      week: 4,
      theme: "SYSTEM STABILIZED",
      type: 'daily',
      difficulty: 'medium',
      xpReward: 100,
      estimatedTime: "20 mins",
      emotionalFocus: ['logic', 'helpOthers']
    },
    {
      day: 28,
      task: "AI Therapy: \"Reintegration Run\" — Simulate a future interaction and decode your reactions.",
      week: 4,
      theme: "SYSTEM STABILIZED",
      type: 'therapy',
      difficulty: 'hard',
      xpReward: 250,
      estimatedTime: "45 mins",
      emotionalFocus: ['logic', 'helpOthers', 'numb']
    },
    {
      day: 29,
      task: "Create your Soft Launch Post — write or design your personal comeback message.",
      week: 4,
      theme: "SYSTEM STABILIZED",
      type: 'daily',
      difficulty: 'medium',
      xpReward: 150,
      estimatedTime: "30 mins",
      emotionalFocus: ['helpOthers', 'logic']
    },
    {
      day: 30,
      task: "Final Badge Unlocked: \"System Rebooted.\" Celebrate. Tease entry into Deep Reset.",
      week: 4,
      theme: "SYSTEM STABILIZED",
      type: 'bonus',
      difficulty: 'easy',
      xpReward: 300,
      estimatedTime: "Variable",
      emotionalFocus: ['helpOthers', 'logic']
    }
  ]
};

export default function TodaysRecommendedActivities({
  userDay,
  userWeek,
  emotionalTone,
  completedTasks,
  onCompleteTask,
  protocolType
}: RecommendedActivitiesProps) {
  const [selectedTask, setSelectedTask] = useState<ProtocolDay | null>(null);

  // Get today's tasks
  const todaysTasks = PROTOCOL_DATA[userWeek]?.filter(task => 
    task.day === userDay
  ) || [];

  // Get suggested tasks based on emotional tone
  const suggestedTasks = PROTOCOL_DATA[userWeek]?.filter(task => 
    task.emotionalFocus.includes(emotionalTone) && task.day !== userDay
  ).slice(0, 2) || [];

  // Get emergency tasks
  const emergencyTasks = PROTOCOL_DATA[userWeek]?.filter(task => 
    task.type === 'emergency'
  ) || [];

  const getTaskIcon = (type: string, difficulty: string) => {
    if (type === 'therapy') return <Brain className="w-5 h-5" />;
    if (type === 'emergency') return <AlertTriangle className="w-5 h-5" />;
    if (type === 'bonus') return <Sparkles className="w-5 h-5" />;
    if (difficulty === 'hard') return <Shield className="w-5 h-5" />;
    if (difficulty === 'medium') return <Target className="w-5 h-5" />;
    return <Heart className="w-5 h-5" />;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 border-green-500/50 bg-green-500/20';
      case 'medium': return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/20';
      case 'hard': return 'text-red-400 border-red-500/50 bg-red-500/20';
      default: return 'text-gray-400 border-gray-500/50 bg-gray-500/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'therapy': return 'text-purple-400 border-purple-500/50 bg-purple-500/20';
      case 'emergency': return 'text-orange-400 border-orange-500/50 bg-orange-500/20';
      case 'bonus': return 'text-pink-400 border-pink-500/50 bg-pink-500/20';
      default: return 'text-blue-400 border-blue-500/50 bg-blue-500/20';
    }
  };

  const TaskCard = ({ task, isCompleted = false, isSuggested = false }: { 
    task: ProtocolDay; 
    isCompleted?: boolean; 
    isSuggested?: boolean; 
  }) => (
    <Card className={`border transition-all duration-300 hover:scale-105 ${
      isCompleted 
        ? 'bg-green-900/20 border-green-500/50' 
        : isSuggested
        ? 'bg-purple-900/20 border-purple-500/50'
        : 'bg-gray-800/50 border-gray-600'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getTaskIcon(task.type, task.difficulty)}
            <div>
              <CardTitle className="text-sm font-medium text-white">
                Day {task.day} • {task.theme}
              </CardTitle>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <Badge className={getDifficultyColor(task.difficulty)}>
              {task.difficulty.toUpperCase()}
            </Badge>
            <Badge className={getTypeColor(task.type)}>
              {task.type.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-300 text-sm leading-relaxed">
          {task.task}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{task.estimatedTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400" />
            <span className="text-yellow-400">+{task.xpReward} XP</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {isCompleted ? (
            <Button disabled className="bg-green-500/20 text-green-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              Completed
            </Button>
          ) : (
            <Button 
              onClick={() => onCompleteTask(`day-${task.day}`, task.xpReward)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {task.type === 'therapy' ? 'Start Session' : 'Mark Complete'}
            </Button>
          )}
          
          {isSuggested && (
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
              Suggested for {emotionalTone}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-pink-900/40 border-2 border-blue-500/50">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-white text-center">
            📅 TODAY'S RECOMMENDED ACTIVITIES
          </CardTitle>
          <p className="text-blue-400 text-center">
            Week {userWeek} • Day {userDay} • {PROTOCOL_DATA[userWeek]?.[0]?.theme || 'Protocol Active'}
          </p>
          <div className="flex justify-center">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
              {protocolType === '30-day' ? '30-Day Reformat Protocol™' : '90-Day Deep Reset Protocol™'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Today's Main Tasks */}
      {todaysTasks.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-400" />
            Today's Tasks
          </h3>
          <div className="grid gap-4">
            {todaysTasks.map((task) => (
              <TaskCard 
                key={`today-${task.day}`}
                task={task} 
                isCompleted={completedTasks.includes(`day-${task.day}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Emotional Tone Suggestions */}
      {suggestedTasks.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-purple-400" />
            Suggested for Your Current Mood ({emotionalTone})
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {suggestedTasks.map((task) => (
              <TaskCard 
                key={`suggested-${task.day}`}
                task={task} 
                isCompleted={completedTasks.includes(`day-${task.day}`)}
                isSuggested={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Emergency Protocols */}
      {emergencyTasks.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-400" />
            Emergency Protocols (Use When Needed)
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {emergencyTasks.map((task) => (
              <TaskCard 
                key={`emergency-${task.day}`}
                task={task} 
                isCompleted={completedTasks.includes(`day-${task.day}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Protocol Progress */}
      <Card className="bg-gray-800/50 border border-green-500/30">
        <CardHeader>
          <CardTitle className="text-lg text-green-400">📊 Protocol Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Week {userWeek} Progress</span>
                <span className="text-white">Day {userDay} of {protocolType === '30-day' ? '30' : '90'}</span>
              </div>
              <Progress 
                value={(userDay / (protocolType === '30-day' ? 30 : 90)) * 100} 
                className="h-3" 
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Tasks Completed This Week:</span>
              <span className="text-green-400">
                {completedTasks.filter(t => t.startsWith(`day-`)).length} / {PROTOCOL_DATA[userWeek]?.length || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
