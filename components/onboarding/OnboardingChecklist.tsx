'use client';

// Interactive Onboarding Checklist & Support
// Reduces churn with clear guidance and help access

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Circle, 
  Play, 
  HelpCircle, 
  Users, 
  BookOpen,
  MessageCircle,
  Star,
  ChevronRight,
  Sparkles,
  Target,
  Heart,
  Zap
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  isUnlocked: boolean;
  actionLabel: string;
  actionUrl?: string;
  points: number;
  category: 'essential' | 'engagement' | 'community' | 'advanced';
}

interface OnboardingChecklistProps {
  userId: string;
  onItemComplete?: (itemId: string) => void;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Essential Items
  {
    id: 'identity_assigned',
    title: 'Identity Assigned',
    description: 'Your secure codename and avatar are configured',
    icon: <CheckCircle className="h-5 w-5" />,
    isCompleted: true,
    isUnlocked: true,
    actionLabel: 'Completed',
    points: 50,
    category: 'essential'
  },
  {
    id: 'first_ritual',
    title: 'First Ritual Completed',
    description: 'Complete your first healing ritual or AI therapy session',
    icon: <Heart className="h-5 w-5" />,
    isCompleted: false,
    isUnlocked: true,
    actionLabel: 'Start First Ritual',
    actionUrl: '/dashboard/enhanced',
    points: 100,
    category: 'essential'
  },
  {
    id: 'explore_dashboard',
    title: 'Explore Dashboard',
    description: 'Familiarize yourself with your enhanced control center',
    icon: <Target className="h-5 w-5" />,
    isCompleted: false,
    isUnlocked: true,
    actionLabel: 'Explore Dashboard',
    actionUrl: '/dashboard/enhanced',
    points: 25,
    category: 'essential'
  },

  // Engagement Items
  {
    id: 'first_story_posted',
    title: 'First Story Posted',
    description: 'Share your journey on the Wall of Wounds (anonymous)',
    icon: <MessageCircle className="h-5 w-5" />,
    isCompleted: false,
    isUnlocked: false,
    actionLabel: 'Share Your Story',
    actionUrl: '/wall',
    points: 75,
    category: 'engagement'
  },
  {
    id: 'protocol_ghost_chat',
    title: 'Talk to Protocol Ghost',
    description: 'Have your first conversation with our AI companion',
    icon: <Sparkles className="h-5 w-5" />,
    isCompleted: false,
    isUnlocked: false,
    actionLabel: 'Start Chat',
    actionUrl: '/ai-therapy-demo',
    points: 50,
    category: 'engagement'
  },
  {
    id: 'streak_started',
    title: '3-Day Streak Started',
    description: 'Build momentum with consistent daily engagement',
    icon: <Zap className="h-5 w-5" />,
    isCompleted: false,
    isUnlocked: false,
    actionLabel: 'Continue Streak',
    actionUrl: '/dashboard/enhanced',
    points: 150,
    category: 'engagement'
  },

  // Community Items
  {
    id: 'community_intro',
    title: 'Community Introduction',
    description: 'Introduce yourself to the healing community',
    icon: <Users className="h-5 w-5" />,
    isCompleted: false,
    isUnlocked: false,
    actionLabel: 'Join Community',
    actionUrl: '/wall',
    points: 50,
    category: 'community'
  },
  {
    id: 'support_someone',
    title: 'Support Someone',
    description: 'Leave an encouraging comment or reaction',
    icon: <Heart className="h-5 w-5" />,
    isCompleted: false,
    isUnlocked: false,
    actionLabel: 'Spread Support',
    actionUrl: '/wall',
    points: 100,
    category: 'community'
  }
];

export function OnboardingChecklist({ userId, onItemComplete }: OnboardingChecklistProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(CHECKLIST_ITEMS);
  const [showHelp, setShowHelp] = useState(false);

  // Calculate progress
  const totalItems = checklist.length;
  const completedItems = checklist.filter(item => item.isCompleted).length;
  const totalPoints = checklist.reduce((sum, item) => sum + (item.isCompleted ? item.points : 0), 0);
  const maxPoints = checklist.reduce((sum, item) => sum + item.points, 0);
  const progressPercent = (completedItems / totalItems) * 100;

  // Unlock logic
  useEffect(() => {
    const updatedChecklist = [...checklist];
    let hasChanges = false;

    // Unlock engagement items after first ritual
    if (checklist.find(item => item.id === 'first_ritual')?.isCompleted) {
      ['first_story_posted', 'protocol_ghost_chat'].forEach(id => {
        const item = updatedChecklist.find(item => item.id === id);
        if (item && !item.isUnlocked) {
          item.isUnlocked = true;
          hasChanges = true;
        }
      });
    }

    // Unlock community items after exploring dashboard
    if (checklist.find(item => item.id === 'explore_dashboard')?.isCompleted) {
      ['community_intro'].forEach(id => {
        const item = updatedChecklist.find(item => item.id === id);
        if (item && !item.isUnlocked) {
          item.isUnlocked = true;
          hasChanges = true;
        }
      });
    }

    // Unlock advanced items after community engagement
    if (checklist.find(item => item.id === 'community_intro')?.isCompleted) {
      ['support_someone', 'streak_started'].forEach(id => {
        const item = updatedChecklist.find(item => item.id === id);
        if (item && !item.isUnlocked) {
          item.isUnlocked = true;
          hasChanges = true;
        }
      });
    }

    if (hasChanges) {
      setChecklist(updatedChecklist);
    }
  }, [checklist]);

  const handleItemAction = (item: ChecklistItem) => {
    if (item.actionUrl) {
      window.location.href = item.actionUrl;
    }
    
    // Mark as completed (in real app, this would be tracked on backend)
    if (!item.isCompleted && item.isUnlocked) {
      const updatedChecklist = checklist.map(checklistItem =>
        checklistItem.id === item.id 
          ? { ...checklistItem, isCompleted: true }
          : checklistItem
      );
      setChecklist(updatedChecklist);
      onItemComplete?.(item.id);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'essential': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'engagement': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'community': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'advanced': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const categoryTitles = {
    essential: '🎯 Essential First Steps',
    engagement: '🚀 Build Momentum',
    community: '👥 Join the Community',
    advanced: '⭐ Advanced Features'
  };

  const groupedItems = checklist.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {} as Record<string, ChecklistItem[]>);

  return (
    <Card className="bg-gray-900/80 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-white flex items-center">
              <CheckCircle className="h-6 w-6 mr-2 text-green-400" />
              Getting Started Checklist
            </CardTitle>
            <p className="text-gray-400 mt-1">
              Complete these steps to unlock your full healing potential
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {completedItems}/{totalItems}
            </div>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
              {totalPoints} XP
            </Badge>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="space-y-2">
          <Progress value={progressPercent} className="h-3 bg-gray-800" />
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Just Started</span>
            <span className="text-purple-400 font-mono">
              {Math.round(progressPercent)}% Complete
            </span>
            <span className="text-gray-400">Fully Onboarded</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Checklist Items by Category */}
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center">
              {categoryTitles[category as keyof typeof categoryTitles]}
            </h3>
            
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    item.isCompleted
                      ? 'bg-green-500/10 border-green-500/50'
                      : item.isUnlocked
                      ? 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 cursor-pointer'
                      : 'bg-gray-800/30 border-gray-700/50 opacity-60'
                  }`}
                  onClick={() => item.isUnlocked && handleItemAction(item)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        item.isCompleted
                          ? 'bg-green-500/20 text-green-400'
                          : item.isUnlocked
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-gray-700/50 text-gray-500'
                      }`}>
                        {item.isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          item.icon
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{item.title}</h4>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className={getCategoryColor(item.category)}>
                        +{item.points} XP
                      </Badge>
                      
                      {item.isCompleted ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                          ✓ Done
                        </Badge>
                      ) : item.isUnlocked ? (
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <Play className="h-4 w-4 mr-1" />
                          {item.actionLabel}
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          Locked
                        </Badge>
                      )}
                      
                      {item.isUnlocked && !item.isCompleted && (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Help & Support Section */}
        <Card className="bg-gray-800/50 border-gray-600">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-blue-400" />
              Need Help Getting Started?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                className="justify-start border-gray-600 hover:bg-gray-700"
                onClick={() => setShowHelp(!showHelp)}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Guide
              </Button>
              <Button 
                variant="outline" 
                className="justify-start border-gray-600 hover:bg-gray-700"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Support Chat
              </Button>
              <Button 
                variant="outline" 
                className="justify-start border-gray-600 hover:bg-gray-700"
              >
                <Users className="h-4 w-4 mr-2" />
                Community
              </Button>
            </div>
            
            {showHelp && (
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h4 className="font-semibold text-blue-400 mb-2">Quick Start Tips:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Start with your first ritual to unlock more features</li>
                  <li>• Explore the dashboard to familiarize yourself with tools</li>
                  <li>• Join the community when you're ready to connect</li>
                  <li>• Build daily streaks for maximum healing benefits</li>
                </ul>
              </div>
            )}
            
            <p className="text-gray-400 text-sm mt-3">
              🔒 Your journey is private and secure. Take your time and go at your own pace.
            </p>
          </CardContent>
        </Card>

        {/* Completion Celebration */}
        {progressPercent === 100 && (
          <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/50">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-green-400 mb-2">
                🎉 Congratulations! You're Fully Onboarded!
              </h3>
              <p className="text-gray-300 mb-4">
                You've completed all essential steps and unlocked the full CTRL+ALT+BLOCK™ experience.
              </p>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-lg px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                Onboarding Master - {maxPoints} XP Earned
              </Badge>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
