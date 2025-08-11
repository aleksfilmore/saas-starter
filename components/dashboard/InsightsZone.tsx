"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Brain, Heart, TrendingUp, Calendar, BookOpen } from 'lucide-react';
import { User } from 'lucia';

interface Props {
  dailyInsight: string;
  user: User;
}

export function InsightsZone({ dailyInsight, user }: Props) {
  const currentHour = new Date().getHours();
  
  const getTimeBasedGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getPersonalizedTip = () => {
    const tips = [
      "Your Data Flooder archetype thrives on clear, structured healing approaches.",
      "Breaking overwhelming feelings into smaller, manageable steps works best for your processing style.",
      "Remember: Every boundary you set is teaching your nervous system it's safe to say no.",
      "Your attachment style isn't a limitation—it's valuable insight into your unique healing path.",
      "Progress isn't always linear. Some days maintaining is winning."
    ];
    
    // Rotate based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return tips[dayOfYear % tips.length];
  };

  const getQuickWins = () => [
    { icon: "🌱", text: "Take 3 deep breaths", action: "Try it now" },
    { icon: "💭", text: "Write one thing you're grateful for", action: "Quick note" },
    { icon: "🚀", text: "Send yourself an encouraging text", action: "Do it" },
    { icon: "🎯", text: "Set one tiny boundary today", action: "Plan it" }
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <h2 className="text-2xl font-bold text-white">Daily Insight & Encouragement</h2>

      {/* Personal Greeting */}
      <Card className="bg-gradient-to-r from-purple-900/60 to-pink-800/50 border-purple-700 shadow-[0_0_0_1px_rgba(168,85,247,0.3)]">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-white/10 rounded-full">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium text-lg">
                {getTimeBasedGreeting()}
              </h3>
              <p className="text-purple-200 mt-1">
                You're on day {user.ritual_streak || 0} of your healing journey. Every step counts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Insight */}
      <Card className="bg-gray-800/60 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-400" />
            <span>Today's Insight</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-200 leading-relaxed italic">
              "{dailyInsight}"
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
              <span className="text-gray-400 text-sm">Personalized for your journey</span>
              <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                <BookOpen className="h-4 w-4 mr-1" />
                Learn more
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Archetype-Specific Tip */}
      <Card className="bg-gray-800/60 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Brain className="h-5 w-5 text-cyan-400" />
            <span>Your Archetype Insight</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-200 leading-relaxed">
            {getPersonalizedTip()}
          </p>
        </CardContent>
      </Card>

      {/* Quick Wins */}
      <Card className="bg-gray-800/60 border-gray-700 relative overflow-hidden">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <span>2-Minute Wins</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getQuickWins().map((win, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{win.icon}</span>
                  <span className="text-gray-200">{win.text}</span>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  {win.action}
                </Button>
              </div>
            ))}
            <div className="mt-4 p-4 border border-dashed border-green-500/40 rounded-lg bg-green-500/5 text-center">
              <p className="text-sm text-green-300 mb-2 font-medium">Micro Challenge</p>
              <p className="text-xs text-green-200 mb-3">Share one small win on the wall today to reinforce progress.</p>
              <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white text-xs">Post a Win</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* This Week Focus */}
      <Card className="bg-gray-800/60 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            <span>This Week's Focus</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <h4 className="text-blue-400 font-medium mb-1">Boundary Practice</h4>
              <p className="text-gray-300 text-sm">
                This week, focus on recognizing when you need space and practicing saying "I need time to think about that."
              </p>
            </div>
            <Button 
              variant="outline" 
              className="w-full text-blue-400 border-blue-500/30 hover:bg-blue-500/10"
            >
              See Weekly Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
