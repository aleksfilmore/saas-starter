"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  User, 
  Crown, 
  Target, 
  Calendar, 
  Heart, 
  Brain, 
  Shield, 
  Zap, 
  Star,
  Award,
  Flame,
  TrendingUp,
  Settings,
  Camera,
  Edit3,
  Save,
  X
} from "lucide-react";

interface UserStats {
  totalPoints: number;
  level: number;
  streak: number;
  completedQuests: number;
  aiConversations: number;
  crisisSupportsUsed: number;
  healingMilestones: number;
  wallPosts: number;
}

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  joinDate: Date;
  stats: UserStats;
  badges: string[];
  preferences: {
    aiPersonality: string;
    notificationsEnabled: boolean;
    crisisAlertsEnabled: boolean;
    publicProfile: boolean;
  };
}

interface UserProfileManagerProps {
  user?: UserProfile;
  onProfileUpdate?: (profile: UserProfile) => void;
}

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, 7500];
const PERSONALITY_OPTIONS = [
  { id: 'savage-bestie', name: 'Savage Bestie', description: 'Brutal honesty with love' },
  { id: 'zen-master', name: 'Zen Master', description: 'Calm and mindful guidance' },
  { id: 'therapist', name: 'Professional Therapist', description: 'Clinical and supportive' },
  { id: 'chaos-goblin', name: 'Chaos Goblin', description: 'Chaotic but caring energy' },
  { id: 'brutal-saint', name: 'Brutal Saint', description: 'Tough love with compassion' }
];

const AVAILABLE_BADGES = [
  { id: 'first-steps', name: 'First Steps', icon: '👣', description: 'Completed onboarding' },
  { id: 'mood-tracker', name: 'Mood Master', icon: '😊', description: '30 mood check-ins' },
  { id: 'gratitude-warrior', name: 'Gratitude Warrior', icon: '🙏', description: '50 gratitude entries' },
  { id: 'breath-master', name: 'Breath Master', icon: '🫁', description: '100 breathing exercises' },
  { id: 'mindful-soul', name: 'Mindful Soul', icon: '🧘', description: '75 mindfulness moments' },
  { id: 'streak-legend', name: 'Streak Legend', icon: '🔥', description: '30-day streak' },
  { id: 'ai-friend', name: 'AI Whisperer', icon: '🤖', description: '100 AI conversations' },
  { id: 'crisis-survivor', name: 'Crisis Survivor', icon: '💪', description: 'Used crisis support' },
  { id: 'wall-warrior', name: 'Wall Warrior', icon: '🛡️', description: '50 wall posts' },
  { id: 'oracle-status', name: 'Oracle', icon: '🔮', description: 'Achieved oracle status' }
];

const DEFAULT_PROFILE: UserProfile = {
  id: 'current-user',
  username: 'warrior',
  displayName: 'Healing Warrior',
  bio: 'On a journey of self-discovery and healing. One day at a time.',
  avatar: '🌟',
  joinDate: new Date(),
  stats: {
    totalPoints: 850,
    level: 3,
    streak: 7,
    completedQuests: 12,
    aiConversations: 45,
    crisisSupportsUsed: 2,
    healingMilestones: 8,
    wallPosts: 23
  },
  badges: ['first-steps', 'mood-tracker', 'gratitude-warrior'],
  preferences: {
    aiPersonality: 'savage-bestie',
    notificationsEnabled: true,
    crisisAlertsEnabled: true,
    publicProfile: true
  }
};

export function UserProfileManager({ user = DEFAULT_PROFILE, onProfileUpdate }: UserProfileManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(user);

  const getLevelProgress = () => {
    const currentLevel = user.stats.level;
    const currentPoints = user.stats.totalPoints;
    const currentThreshold = LEVEL_THRESHOLDS[currentLevel] || 0;
    const nextThreshold = LEVEL_THRESHOLDS[currentLevel + 1] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    
    const progress = ((currentPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const handleSaveProfile = () => {
    onProfileUpdate?.(editedProfile);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedProfile(user);
    setIsEditing(false);
  };

  const updatePreference = (key: string, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <User className="w-4 h-4 mr-2" />
          Profile
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl bg-gray-900 border-purple-500/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-400 text-center flex items-center justify-center">
            <Crown className="w-6 h-6 mr-2" />
            Warrior Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="text-6xl">{user.avatar}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{user.displayName}</h2>
                    <p className="text-gray-300">@{user.username}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Warrior since {user.joinDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className={isEditing ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}
                >
                  {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Display Name</label>
                    <Input
                      value={editedProfile.displayName}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, displayName: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Bio</label>
                    <Textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button onClick={handleCancelEdit} className="bg-gray-600 hover:bg-gray-700">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300">{user.bio}</p>
              )}
            </CardContent>
          </Card>

          {/* Level & Progress */}
          <Card className="bg-gray-800/50 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Warrior Level {user.stats.level}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Progress to Level {user.stats.level + 1}</span>
                  <span className="text-purple-400 font-bold">{user.stats.totalPoints} points</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getLevelProgress()}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 text-center">
                  {LEVEL_THRESHOLDS[user.stats.level + 1] - user.stats.totalPoints} points to next level
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gray-800/50 border-orange-500/30">
              <CardContent className="p-4 text-center">
                <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-400">{user.stats.streak}</div>
                <div className="text-xs text-gray-400">Day Streak</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-green-500/30">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">{user.stats.completedQuests}</div>
                <div className="text-xs text-gray-400">Quests Done</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-blue-500/30">
              <CardContent className="p-4 text-center">
                <Brain className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-400">{user.stats.aiConversations}</div>
                <div className="text-xs text-gray-400">AI Chats</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-purple-500/30">
              <CardContent className="p-4 text-center">
                <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-400">{user.stats.wallPosts}</div>
                <div className="text-xs text-gray-400">Wall Posts</div>
              </CardContent>
            </Card>
          </div>

          {/* Badges */}
          <Card className="bg-gray-800/50 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Achievement Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {AVAILABLE_BADGES.map((badge) => {
                  const isEarned = user.badges.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        isEarned
                          ? 'bg-yellow-500/10 border-yellow-500/50'
                          : 'bg-gray-700/30 border-gray-600/50'
                      }`}
                    >
                      <div className={`text-2xl mb-1 ${isEarned ? '' : 'grayscale opacity-50'}`}>
                        {badge.icon}
                      </div>
                      <div className={`text-xs font-medium ${isEarned ? 'text-yellow-400' : 'text-gray-400'}`}>
                        {badge.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {badge.description}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="bg-gray-800/50 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">
                  AI Personality
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {PERSONALITY_OPTIONS.map((personality) => (
                    <button
                      key={personality.id}
                      onClick={() => updatePreference('aiPersonality', personality.id)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        (isEditing ? editedProfile : user).preferences.aiPersonality === personality.id
                          ? 'bg-purple-500/20 border-purple-500/50'
                          : 'bg-gray-700/30 border-gray-600/50 hover:border-purple-500/30'
                      }`}
                      disabled={!isEditing}
                    >
                      <div className="font-medium text-white">{personality.name}</div>
                      <div className="text-xs text-gray-400">{personality.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Notifications Enabled</span>
                  <button
                    onClick={() => updatePreference('notificationsEnabled', !editedProfile.preferences.notificationsEnabled)}
                    disabled={!isEditing}
                    className={`w-12 h-6 rounded-full transition-all ${
                      (isEditing ? editedProfile : user).preferences.notificationsEnabled
                        ? 'bg-green-500'
                        : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${
                      (isEditing ? editedProfile : user).preferences.notificationsEnabled
                        ? 'translate-x-7'
                        : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Crisis Alerts</span>
                  <button
                    onClick={() => updatePreference('crisisAlertsEnabled', !editedProfile.preferences.crisisAlertsEnabled)}
                    disabled={!isEditing}
                    className={`w-12 h-6 rounded-full transition-all ${
                      (isEditing ? editedProfile : user).preferences.crisisAlertsEnabled
                        ? 'bg-red-500'
                        : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${
                      (isEditing ? editedProfile : user).preferences.crisisAlertsEnabled
                        ? 'translate-x-7'
                        : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Public Profile</span>
                  <button
                    onClick={() => updatePreference('publicProfile', !editedProfile.preferences.publicProfile)}
                    disabled={!isEditing}
                    className={`w-12 h-6 rounded-full transition-all ${
                      (isEditing ? editedProfile : user).preferences.publicProfile
                        ? 'bg-blue-500'
                        : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${
                      (isEditing ? editedProfile : user).preferences.publicProfile
                        ? 'translate-x-7'
                        : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Summary */}
          <Card className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-gray-600">
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-white">Healing Journey Summary</h3>
                <div className="flex justify-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="text-purple-400 font-bold">{user.stats.healingMilestones}</div>
                    <div className="text-gray-400">Milestones</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-400 font-bold">{user.stats.crisisSupportsUsed}</div>
                    <div className="text-gray-400">Crisis Supports</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 font-bold">{Math.floor(user.stats.totalPoints / 100)}</div>
                    <div className="text-gray-400">Weeks Active</div>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border-purple-500/50">
                  You're doing amazing. Keep going, warrior. 💪
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
