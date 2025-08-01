"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AuthWrapper from '@/components/AuthWrapper';
import Link from 'next/link';
import { 
  Brain, Shield, Heart, Zap, MessageSquare, 
  Target, Calendar, Trophy, ArrowRight,
  CheckCircle, Clock, Star
} from 'lucide-react';

// Mock user archetype - would come from API/database
const mockArchetype = {
  type: 'firewall',
  name: 'The Firewall',
  description: 'You build walls to protect yourself but sometimes they keep out the good stuff too.',
  traits: ['Protective', 'Guarded', 'Strategic', 'Independent'],
  color: 'orange',
  icon: '🔥'
};

const treatmentPlan = {
  focus: 'Healthy Boundaries & Emotional Processing',
  duration: '12 weeks',
  phase: 'Phase 1: Foundation Building',
  progress: 35,
  
  dailyRituals: [
    {
      id: 'morning_firewall',
      name: 'Morning Firewall Protocol',
      description: 'Set daily boundaries and intentions',
      duration: '10 min',
      completed: true,
      streak: 12
    },
    {
      id: 'evening_processing',
      name: 'Evening Emotional Processing',
      description: 'Process the day\'s emotions safely',
      duration: '15 min',
      completed: false,
      streak: 8
    },
    {
      id: 'boundary_check',
      name: 'Boundary Check-in',
      description: 'Assess and adjust your protective barriers',
      duration: '5 min',
      completed: true,
      streak: 12
    }
  ],
  
  aiTherapy: {
    sessionsCompleted: 8,
    sessionsRecommended: 20,
    focus: 'Trust and vulnerability exercises',
    nextSession: 'Exploring safe emotional expression'
  },
  
  wallActivity: {
    postsShared: 3,
    supportGiven: 15,
    focus: 'Share experiences with boundary-setting',
    nextGoal: 'Post about a boundary success story'
  },
  
  milestones: [
    {
      id: 1,
      title: 'Establish Basic Boundaries',
      description: 'Create and maintain 3 healthy boundaries',
      completed: true,
      date: '2 weeks ago'
    },
    {
      id: 2,
      title: 'First Vulnerability Share',
      description: 'Share a meaningful experience on the Wall',
      completed: true,
      date: '1 week ago'
    },
    {
      id: 3,
      title: 'Trust Building Exercise',
      description: 'Complete AI therapy trust module',
      completed: false,
      progress: 60,
      target: 'Next 3 days'
    },
    {
      id: 4,
      title: 'Emotional Regulation Mastery',
      description: 'Maintain emotional stability for 2 weeks',
      completed: false,
      progress: 20,
      target: '3 weeks'
    }
  ]
};

export default function TreatmentPlanPage() {
  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white mb-4">
              🎯 YOUR PERSONALIZED TREATMENT PLAN
            </h1>
            <p className="text-purple-400 text-lg">
              Based on your archetype assessment: <span className="text-orange-400 font-bold">The Firewall</span>
            </p>
          </div>

          {/* Archetype Summary */}
          <Card className="bg-gradient-to-r from-orange-900/40 to-red-900/40 border border-orange-500/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <span className="text-2xl mr-3">🔥</span>
                {mockArchetype.name} - Your Healing Archetype
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-100 mb-4">{mockArchetype.description}</p>
              <div className="flex gap-2 mb-4">
                {mockArchetype.traits.map((trait) => (
                  <Badge key={trait} className="bg-orange-600/20 text-orange-300 border-orange-500/30">
                    {trait}
                  </Badge>
                ))}
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">Treatment Progress</span>
                  <span className="text-orange-400 font-bold">{treatmentPlan.progress}%</span>
                </div>
                <Progress value={treatmentPlan.progress} className="h-3" />
                <p className="text-sm text-gray-400 mt-2">
                  {treatmentPlan.phase} • {treatmentPlan.duration} program
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Daily Rituals Section */}
          <Card className="bg-gray-900/80 border border-gray-600/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                Daily Healing Rituals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {treatmentPlan.dailyRituals.map((ritual) => (
                  <div key={ritual.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      {ritual.completed ? (
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      ) : (
                        <Clock className="h-6 w-6 text-gray-400" />
                      )}
                      <div>
                        <h4 className="text-white font-semibold">{ritual.name}</h4>
                        <p className="text-gray-400 text-sm">{ritual.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">{ritual.duration}</div>
                      <div className="text-orange-400 font-bold">{ritual.streak} day streak</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link href="/daily-rituals">
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                    <Zap className="h-4 w-4 mr-2" />
                    Complete Today's Rituals
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Treatment Components Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* AI Therapy Progress */}
            <Card className="bg-gray-900/80 border border-gray-600/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-green-400" />
                  AI Therapy Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Sessions Completed</span>
                  <span className="text-green-400 font-bold">
                    {treatmentPlan.aiTherapy.sessionsCompleted}/{treatmentPlan.aiTherapy.sessionsRecommended}
                  </span>
                </div>
                <Progress 
                  value={(treatmentPlan.aiTherapy.sessionsCompleted / treatmentPlan.aiTherapy.sessionsRecommended) * 100} 
                  className="h-2" 
                />
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-sm text-gray-300 mb-2">
                    <strong>Current Focus:</strong> {treatmentPlan.aiTherapy.focus}
                  </p>
                  <p className="text-sm text-green-400">
                    <strong>Next Session:</strong> {treatmentPlan.aiTherapy.nextSession}
                  </p>
                </div>
                <Link href="/ai-therapy">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Continue Therapy
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Wall Activity */}
            <Card className="bg-gray-900/80 border border-gray-600/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-400" />
                  Community Engagement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-xl font-bold text-red-400">{treatmentPlan.wallActivity.postsShared}</div>
                    <div className="text-xs text-gray-400">Posts Shared</div>
                  </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-xl font-bold text-blue-400">{treatmentPlan.wallActivity.supportGiven}</div>
                    <div className="text-xs text-gray-400">Support Given</div>
                  </div>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-sm text-gray-300 mb-2">
                    <strong>Focus Area:</strong> {treatmentPlan.wallActivity.focus}
                  </p>
                  <p className="text-sm text-red-400">
                    <strong>Next Goal:</strong> {treatmentPlan.wallActivity.nextGoal}
                  </p>
                </div>
                <Link href="/wall-enhanced">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <Heart className="h-4 w-4 mr-2" />
                    Visit Wall
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Milestones */}
          <Card className="bg-gray-900/80 border border-gray-600/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="h-5 w-5 mr-2 text-purple-400" />
                Treatment Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {treatmentPlan.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      {milestone.completed ? (
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-gray-400 flex items-center justify-center">
                          <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                        </div>
                      )}
                      <div>
                        <h4 className={`font-semibold ${milestone.completed ? 'text-white' : 'text-gray-300'}`}>
                          {milestone.title}
                        </h4>
                        <p className="text-gray-400 text-sm">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {milestone.completed ? (
                        <div className="text-green-400 text-sm">✅ {milestone.date}</div>
                      ) : (
                        <div>
                          <div className="text-purple-400 text-sm">{milestone.progress}% complete</div>
                          <div className="text-gray-400 text-xs">Target: {milestone.target}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/50">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Ready to Continue Your Journey?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/daily-rituals">
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                    <Zap className="h-4 w-4 mr-2" />
                    Do Rituals
                  </Button>
                </Link>
                <Link href="/ai-therapy">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Brain className="h-4 w-4 mr-2" />
                    AI Session
                  </Button>
                </Link>
                <Link href="/wall-enhanced">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <Heart className="h-4 w-4 mr-2" />
                    Share & Connect
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </AuthWrapper>
  );
}
