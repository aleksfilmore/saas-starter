"use client";

import { useState, useEffect } from 'react';
import { User } from 'lucia';
import { useDailyTasks } from '@/hooks/useDailyTasks';
import { useAuth } from '@/contexts/AuthContext';
import { HealingHubProvider, useHealingHub } from '@/contexts/HealingHubContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  Heart, 
  Shield, 
  Zap, 
  RefreshCw, 
  Play, 
  MessageSquare,
  Mic,
  Crown,
  Settings,
  User as UserIcon,
  Flame,
  Target,
  Calendar,
  TrendingUp,
  MessageCircle,
  Send,
  Clock,
  CheckCircle2,
  Lock,
  Coins,
  Star,
  Eye,
  Wind,
  AlertTriangle,
  LogOut
} from 'lucide-react';
import { BreathingExercise } from '@/components/quick-actions/BreathingExercise';
import { RitualModal } from '@/components/dashboard/modals/RitualModal';
import { CheckInModal } from '@/components/dashboard/modals/CheckInModal';
import { AITherapyModal } from '@/components/dashboard/modals/AITherapyModal';
import { NoContactModal } from '@/components/dashboard/modals/NoContactModal';
import { UpgradeModal } from './modals/UpgradeModal';
import { VoiceTherapyModal } from './modals/VoiceTherapyModal';

interface Props {
  user: User;
}

const AI_PERSONAS = [
  { id: 'supportive', name: 'Supportive Guide', icon: '🌟', description: 'Gentle, encouraging companion' },
  { id: 'analytical', name: 'Strategic Analyst', icon: '🧠', description: 'Data-driven insights & patterns' },
  { id: 'empathetic', name: 'Emotional Healer', icon: '💝', description: 'Deep emotional understanding' }
];

function AdaptiveDashboard({ user }: Props) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<string>('supportive');
  const { tasks, markTask, progressFraction } = useDailyTasks();
  const { user: authUser } = useAuth();
  const { 
    hubLoading, 
    streaks, 
    ritual, 
    dailyInsight, 
    wallPosts, 
    completeRitual, 
    rerollRitual, 
    rerollCooldownHoursLeft 
  } = useHealingHub();

  const isPremium = authUser?.subscriptionTier === 'premium' || 
                     authUser?.tier === 'premium' || 
                     (user as any)?.subscription_tier === 'premium' || 
                     (user as any)?.tier === 'premium' ||
                     (user as any)?.tier === 'firewall' ||
                     (user as any)?.ritual_tier === 'firewall';
  const canReroll = rerollCooldownHoursLeft === 0;
  const completedToday = Object.values(tasks).filter(Boolean).length;
  const totalTasks = Object.keys(tasks).length;

  // Handle sign out functionality
  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        // Clear any local storage
        localStorage.clear();
        // Redirect to homepage
        window.location.href = '/';
      } else {
        console.error('Logout failed');
        alert('Failed to sign out. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Enhanced Header */}
      <header className="border-b border-purple-500/20 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-8xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Left side - Branding */}
            <div className="flex items-center">
              <div className="flex items-center gap-1 text-xl sm:text-2xl font-extrabold tracking-tight">
                <span className="text-white">CTRL</span>
                <span className="text-gray-400">+</span>
                <span className="text-white">ALT</span>
                <span className="text-gray-400">+</span>
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BLOCK</span>
                <span className="text-gray-400 mx-2">–</span>
                <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Healing Hub
                </span>
              </div>
            </div>
            
            {/* Right side - Actions and User */}
            <div className="flex items-center space-x-3">
              
              {/* User Tier Badge */}
              <div className="hidden sm:flex">
                {isPremium ? (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1">
                    <Crown className="h-3 w-3 mr-1" />
                    FIREWALL
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-gray-400 text-gray-300 px-3 py-1">
                    GHOST
                  </Badge>
                )}
              </div>
              
              {/* Breathing Exercise Button */}
              <BreathingExercise onComplete={(pattern, cycles) => {
                console.log(`Completed ${pattern.name} breathing exercise with ${cycles} cycles`);
              }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-teal-300 hover:text-teal-200 hover:bg-teal-500/10 flex items-center gap-2"
                >
                  <Wind className="h-4 w-4" />
                  <span className="hidden sm:inline">Breathing</span>
                </Button>
              </BreathingExercise>
              
              {/* Crisis Center Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/crisis-support'}
                className="text-red-300 hover:text-red-200 hover:bg-red-500/10 flex items-center gap-2"
              >
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Crisis Center</span>
              </Button>
              
              {/* Settings Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveModal('settings')}
                className="text-purple-300 hover:text-white flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
              
              {/* Sign Out Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-gray-300 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-8xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Sidebar - Key Metrics */}
          <div className="xl:col-span-3 space-y-6">
            {/* Daily Activities Tracker */}
            <Card className="bg-gradient-to-br from-purple-900/50 to-slate-800/50 border-purple-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-400" />
                  Today's Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">{completedToday}/{totalTasks}</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    {Math.round(progressFraction * 100)}% Complete
                  </Badge>
                </div>
                <Progress value={progressFraction * 100} className="h-3" />
                <div className="space-y-2 text-sm">
                  <TaskItem label="Daily Ritual" completed={tasks.ritual} />
                  <TaskItem label="Check-In" completed={tasks.checkIn} />
                  <TaskItem label="AI Therapy" completed={tasks.aiTherapy} premium={!isPremium} />
                  <TaskItem label="No-Contact Check" completed={tasks.noContact} />
                  <TaskItem label="Wall Interaction" completed={tasks.community} />
                </div>
              </CardContent>
            </Card>

            {/* Streak Counter */}
            <Card className="bg-gradient-to-br from-emerald-900/50 to-slate-800/50 border-emerald-500/30">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <Shield className="h-12 w-12 mx-auto text-emerald-400" />
                  <div>
                    <div className="text-3xl font-bold text-white">{streaks?.noContact || 0}</div>
                    <div className="text-sm text-emerald-300">Days No Contact</div>
                  </div>
                  <Button 
                    onClick={() => setActiveModal('no-contact')}
                    size="sm" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    Update Streak
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-slate-800/50 border-slate-600/30">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{streaks?.rituals || 0}</div>
                    <div className="text-xs text-slate-400">Ritual Streak</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-pink-400">L{user.level || 1}</div>
                    <div className="text-xs text-slate-400">Current Level</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-6 space-y-8">
            
            {/* Daily Rituals Section */}
            <Card className="bg-gradient-to-br from-purple-900/60 to-pink-900/40 border-purple-500/40 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="h-6 w-6 text-orange-400" />
                    Today's Healing Ritual
                  </div>
                  {isPremium && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/40">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {ritual ? (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-white">{ritual.title}</h3>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-purple-500/20 text-purple-300">
                            {ritual.difficulty}
                          </Badge>
                          <span className="text-sm text-slate-300 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {ritual.estimatedTime || '5-10'} min
                          </span>
                        </div>
                      </div>
                      {ritual.isCompleted ? (
                        <div className="flex items-center gap-2 text-emerald-400">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                      ) : null}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setActiveModal(`ritual-${ritual.id}`)}
                        disabled={ritual.isCompleted}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {ritual.isCompleted ? 'Completed' : 'Start Ritual'}
                      </Button>
                      <Button
                        onClick={() => rerollRitual()}
                        disabled={!canReroll}
                        variant="outline"
                        className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                      >
                        <RefreshCw className="h-4 w-4" />
                        {!canReroll && (rerollCooldownHoursLeft || 0) > 0 ? `${rerollCooldownHoursLeft}h` : ''}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Loading your personalized ritual...</p>
                  </div>
                )}

                {/* Premium Ritual Slot */}
                {isPremium && (
                  <div className="border-t border-purple-500/20 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-purple-300">Bonus Ritual (Premium)</span>
                      <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">+1</Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-dashed border-purple-500/50 text-purple-300"
                      onClick={() => setActiveModal('ritual-bonus')}
                    >
                      Choose Additional Ritual
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Therapy Section */}
            <Card className="bg-gradient-to-br from-indigo-900/50 to-slate-800/50 border-indigo-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-6 w-6 text-indigo-400" />
                  AI Therapy & Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {AI_PERSONAS.map((persona) => (
                    <Button
                      key={persona.id}
                      onClick={() => {
                        setSelectedPersona(persona.id);
                        setActiveModal('ai-therapy');
                      }}
                      variant={selectedPersona === persona.id ? "default" : "outline"}
                      className="h-auto p-4 flex flex-col items-center text-center space-y-2"
                    >
                      <span className="text-2xl">{persona.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{persona.name}</div>
                        <div className="text-xs opacity-75">{persona.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>

                {/* Voice AI Therapy */}
                <div className="border-t border-indigo-500/20 pt-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-lg border border-indigo-500/30">
                    <div className="flex items-center gap-3">
                      <Mic className="h-6 w-6 text-indigo-400" />
                      <div>
                        <div className="font-medium text-white">Voice AI Therapy</div>
                        <div className="text-sm text-indigo-300">Real-time voice session</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">$9.99</div>
                      <div className="text-xs text-slate-400">per 15 min</div>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => setActiveModal('voice-therapy')}
                  >
                    Start Voice Session
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => setActiveModal('checkin')}
                className="h-20 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 flex flex-col items-center justify-center space-y-1"
              >
                <MessageSquare className="h-6 w-6" />
                <span className="font-medium">Daily Check-In</span>
                <span className="text-xs opacity-75">How are you today?</span>
              </Button>
              
              <Button
                onClick={() => setActiveModal('upgrade')}
                variant="outline"
                className="h-20 border-yellow-500/50 bg-yellow-500/10 hover:bg-yellow-500/20 flex flex-col items-center justify-center space-y-1"
              >
                <Crown className="h-6 w-6 text-yellow-400" />
                <span className="font-medium text-yellow-400">Upgrade</span>
                <span className="text-xs opacity-75">Unlock Premium</span>
              </Button>
            </div>
          </div>

          {/* Right Sidebar - Wall of Wounds */}
          <div className="xl:col-span-3 space-y-6">
            <Card className="bg-slate-800/50 border-slate-600/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-pink-400" />
                    Wall of Wounds
                  </div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Post (Premium) */}
                {isPremium ? (
                  <div className="space-y-3">
                    <textarea
                      placeholder="Share your healing journey..."
                      className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 text-sm resize-none"
                      rows={3}
                    />
                    <Button size="sm" className="w-full bg-pink-600 hover:bg-pink-700">
                      <Send className="h-4 w-4 mr-2" />
                      Share Anonymously
                    </Button>
                  </div>
                ) : (
                  <div className="p-3 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-lg border border-pink-500/30 text-center">
                    <Lock className="h-6 w-6 mx-auto mb-2 text-pink-400" />
                    <p className="text-sm text-pink-300 mb-2">Posting requires Premium</p>
                    <Button size="sm" variant="outline" className="border-pink-500/50 text-pink-300">
                      Upgrade to Share
                    </Button>
                  </div>
                )}

                {/* Recent Posts */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {wallPosts?.slice(0, 5).map((post) => (
                    <div key={post.id} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-purple-500/20 text-purple-300 text-xs">
                          {post.archetype}
                        </Badge>
                        <span className="text-xs text-slate-400">{post.timeAgo}</span>
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed">{post.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-slate-400 hover:text-pink-400 text-xs"
                          onClick={() => markTask('community')}
                        >
                          <Heart className="h-3 w-3 mr-1" />
                          {post.reactions}
                        </Button>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-6 text-slate-400">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Community is quiet right now</p>
                    </div>
                  )}
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-slate-600/50 text-slate-300"
                >
                  View All Posts
                </Button>
              </CardContent>
            </Card>

            {/* Daily Insight */}
            <Card className="bg-gradient-to-br from-amber-900/30 to-slate-800/50 border-amber-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-amber-400" />
                  Today's Insight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-100 leading-relaxed italic">
                  "{dailyInsight || 'Loading your personalized insight...'}"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modals */}
      {activeModal?.startsWith('ritual-') && ritual && (
        <RitualModal 
          ritualId={ritual.id}
          rituals={[{
            id: ritual.id,
            title: ritual.title,
            difficulty: (ritual.difficulty as any) || 'easy',
            completed: ritual.isCompleted || false,
            duration: typeof ritual.estimatedTime === 'number' ? `${ritual.estimatedTime} min` : (ritual.estimatedTime || '—'),
            icon: '🌀',
            steps: ritual.steps as any
          }]}
          onClose={() => setActiveModal(null)}
          onComplete={async (ritualId: string) => {
            const success = await completeRitual(ritualId, ritual.difficulty as any);
            if (success) {
              markTask('ritual');
              setActiveModal(null);
            }
            return success;
          }}
        />
      )}

      {activeModal === 'checkin' && (
        <CheckInModal 
          onClose={() => setActiveModal(null)}
          onComplete={() => {
            markTask('checkIn');
            setActiveModal(null);
          }}
        />
      )}

      {activeModal === 'ai-therapy' && (
        <AITherapyModal 
          onClose={() => setActiveModal(null)}
          onFirstUserMessage={() => markTask('aiTherapy')}
        />
      )}

      {activeModal === 'no-contact' && (
        <NoContactModal 
          onClose={() => setActiveModal(null)}
          onComplete={() => {
            markTask('noContact');
            setActiveModal(null);
          }}
        />
      )}

      {activeModal === 'upgrade' && (
        <UpgradeModal onClose={() => setActiveModal(null)} />
      )}
      
      {activeModal === 'voice-therapy' && (
        <VoiceTherapyModal onClose={() => setActiveModal(null)} />
      )}

      {/* Settings Modal */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-400" />
                Settings
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveModal(null)}>
                ×
              </Button>
            </div>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setActiveModal(null);
                  window.location.href = '/settings';
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setActiveModal(null);
                  window.location.href = '/change-password';
                }}
              >
                <UserIcon className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setActiveModal(null);
                  window.location.href = '/subscription';
                }}
              >
                <Crown className="h-4 w-4 mr-2" />
                Subscription Management
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setActiveModal(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskItem({ label, completed, premium }: { label: string; completed: boolean; premium?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${completed ? 'bg-emerald-400' : 'bg-slate-600'}`} />
        <span className={`text-sm ${completed ? 'text-emerald-300' : 'text-slate-300'}`}>
          {label}
        </span>
        {premium && <Lock className="h-3 w-3 text-yellow-400" />}
      </div>
      {completed && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
    </div>
  );
}

export function AdaptiveDashboardWithProvider(props: Props) {
  return (
    <HealingHubProvider>
      <AdaptiveDashboard {...props} />
    </HealingHubProvider>
  );
}

export default AdaptiveDashboard;
