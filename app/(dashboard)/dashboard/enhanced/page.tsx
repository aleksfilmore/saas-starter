"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TodaysRecommendedActivities from '@/components/dashboard/TodaysRecommendedActivities';

interface User {
  id: string;
  username: string;
  alias: string;
  xp: number;
  week: number;
  tier: 'free' | 'firewall' | 'cult-leader';
  dailyXP: number;
  weeklyXPTarget: number;
  emotionalTone: 'numb' | 'vengeance' | 'logic' | 'helpOthers';
  streakDays: number;
  totalSessions: number;
  joinedAt: Date;
  lastActive: Date;
  completedTasks: string[];
  protocolType: '30-day' | '90-day';
}

const mockUser: User = {
  id: 'user_123',
  username: 'healing_seeker',
  alias: 'DigitalPhoenix',
  xp: 847,
  week: 3,
  tier: 'firewall',
  dailyXP: 127,
  weeklyXPTarget: 500,
  emotionalTone: 'logic',
  streakDays: 12,
  totalSessions: 18,
  joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  lastActive: new Date(),
  completedTasks: ['day-15', 'day-16', 'day-14', 'day-13'],
  protocolType: '30-day'
};

export default function EnhancedDashboard() {
  const [user, setUser] = useState<User>(mockUser);
  const [activeTab, setActiveTab] = useState('overview');

  const handleCompleteTask = (taskId: string, xp: number) => {
    setUser(prev => ({
      ...prev,
      xp: prev.xp + xp,
      dailyXP: prev.dailyXP + xp,
      completedTasks: [...prev.completedTasks, taskId]
    }));
  };

  const progressPercentage = (user.dailyXP / user.weeklyXPTarget) * 100;
  const tierColor = user.tier === 'free' ? 'text-blue-400' : 
                   user.tier === 'firewall' ? 'text-orange-400' : 'text-purple-400';
  
  const daysSinceJoined = Math.floor((Date.now() - user.joinedAt.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-blue-900/40 border-2 border-purple-500/50">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div>
                <CardTitle className="text-3xl font-black text-white">
                  Welcome back, {user.alias} 🔥
                </CardTitle>
                <p className="text-purple-400 text-lg mt-2">
                  Week {user.week} • Day {daysSinceJoined} of your healing journey
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-lg px-3 py-1">
                  {user.xp.toLocaleString()} XP
                </Badge>
                <Badge className={`bg-orange-500/20 border-orange-500/50 text-lg px-3 py-1 ${tierColor}`}>
                  {user.tier.toUpperCase()} TIER
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 text-lg px-3 py-1">
                  {user.streakDays} Day Streak 🔥
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-800/50 border border-green-500/30">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{user.dailyXP}</div>
                <div className="text-sm text-gray-400">Daily XP</div>
                <Progress value={progressPercentage} className="mt-2 h-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border border-blue-500/30">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{user.totalSessions}</div>
                <div className="text-sm text-gray-400">Sessions Completed</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border border-purple-500/30">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">2</div>
                <div className="text-sm text-gray-400">Achievements</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border border-pink-500/30">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">{daysSinceJoined}</div>
                <div className="text-sm text-gray-400">Days on Platform</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-gray-600">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500">
              📊 Overview
            </TabsTrigger>
            <TabsTrigger value="activities" className="data-[state=active]:bg-purple-500">
              📅 Today's Tasks
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-purple-500">
              🏆 Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Quick Session Access */}
              <Card className="bg-gray-800/50 border border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-400">🎯 Quick Start</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => setActiveTab('activities')}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    📅 View Today's Tasks
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('progress')}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    🏆 View Progress & Achievements
                  </Button>
                </CardContent>
              </Card>

              {/* Today's Quick Tasks Preview */}
              <Card className="bg-gray-800/50 border border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-purple-400">📅 Today's Protocol Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">🎯</div>
                        <div>
                          <div className="font-medium text-white">Day {daysSinceJoined} Task</div>
                          <div className="text-sm text-gray-400">Week {user.week} • REPROGRAMMING</div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => setActiveTab('activities')}
                        size="sm"
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        View All
                      </Button>
                    </div>
                    
                    <div className="text-center">
                      <Button 
                        onClick={() => setActiveTab('activities')}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        📋 View Today's Recommended Activities
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Emotional Tone Selector */}
            <Card className="bg-gray-800/50 border border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-xl text-purple-400">🎛️ Current Emotional Tone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(['numb', 'vengeance', 'logic', 'helpOthers'] as const).map((tone) => (
                    <Button
                      key={tone}
                      onClick={() => setUser(prev => ({ ...prev, emotionalTone: tone }))}
                      variant={user.emotionalTone === tone ? 'default' : 'outline'}
                      className={`p-4 h-auto flex-col space-y-2 ${
                        user.emotionalTone === tone 
                          ? 'bg-purple-500 text-white' 
                          : 'border-gray-600 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      <div className="text-2xl">
                        {tone === 'numb' ? '😶' : 
                         tone === 'vengeance' ? '😤' : 
                         tone === 'logic' ? '🤖' : '🤝'}
                      </div>
                      <div className="capitalize font-medium">{tone.replace('helpOthers', 'Help Others')}</div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities">
            <TodaysRecommendedActivities
              userDay={daysSinceJoined}
              userWeek={user.week}
              emotionalTone={user.emotionalTone}
              completedTasks={user.completedTasks}
              onCompleteTask={handleCompleteTask}
              protocolType={user.protocolType}
            />
          </TabsContent>

          <TabsContent value="progress">
            <Card className="bg-gray-800/50 border border-green-500/30">
              <CardHeader>
                <CardTitle className="text-xl text-green-400">📊 Protocol Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">{user.protocolType.toUpperCase()} Protocol</span>
                      <span className="text-white">Day {daysSinceJoined} of {user.protocolType === '30-day' ? '30' : '90'}</span>
                    </div>
                    <Progress 
                      value={(daysSinceJoined / (user.protocolType === '30-day' ? 30 : 90)) * 100} 
                      className="h-3" 
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tasks Completed:</span>
                    <span className="text-green-400">{user.completedTasks.length}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current Week:</span>
                    <span className="text-white">Week {user.week} • REPROGRAMMING</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
