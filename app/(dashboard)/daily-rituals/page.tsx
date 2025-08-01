"use client"

import React from 'react'
import AuthWrapper from '@/components/AuthWrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BookOpen, 
  Timer, 
  Target, 
  Flame, 
  Sparkles, 
  RefreshCw,
  Trophy,
  Star,
  ArrowRight,
  Calendar,
  Zap
} from 'lucide-react'

export default function DailyRitualsPage() {
  // Simulate user archetype from onboarding (would come from user profile)
  const userArchetype = 'data-flooder' // or 'firewall-builder', 'ghost-in-shell', 'secure-node'
  const userTier = 'firewall' // ghost, firewall, cult-leader
  
  // Daily ritual recommendations based on archetype and healing progress
  const dailyRituals = [
    {
      id: 'morning-protocol',
      title: 'Morning System Check',
      category: 'emotional-debugging',
      description: 'Start your day by scanning your emotional operating system for malware and glitches.',
      steps: [
        'Rate your current emotional state (1-10)',
        'Identify any "intrusive thoughts" running in background',
        'Set your intention for the day using cyberpunk affirmations',
        'Choose your avatar energy for today'
      ],
      duration: '10 min',
      xpReward: 25,
      byteReward: 15,
      archetype: ['data-flooder', 'secure-node'],
      completed: false
    },
    {
      id: 'no-contact-firewall',
      title: 'Digital Firewall Reinforcement',
      category: 'boundary-maintenance',
      description: 'Strengthen your digital boundaries and resist the urge to breach your own security.',
      steps: [
        'Check your no-contact streak counter',
        'Review and update blocked contacts if needed',
        'Practice the "redirect protocol" - what to do when urges arise',
        'Update your emergency contact list for accountability'
      ],
      duration: '15 min',
      xpReward: 40,
      byteReward: 25,
      archetype: ['firewall-builder', 'secure-node'],
      completed: true
    },
    {
      id: 'trauma-data-processing',
      title: 'Trauma Data Defragmentation',
      category: 'grief-cycle',
      description: 'Process emotional data fragments into organized, manageable files.',
      steps: [
        'Write 3 raw thoughts about your healing journey',
        'Identify which emotion each thought carries',
        'Reframe one negative thought using your archetype voice',
        'Archive completed thoughts in your digital journal'
      ],
      duration: '20 min',
      xpReward: 50,
      byteReward: 35,
      archetype: ['data-flooder', 'ghost-in-shell'],
      completed: false
    },
    {
      id: 'evening-shutdown',
      title: 'System Shutdown Sequence',
      category: 'soft-reset',
      description: 'Safely power down your emotional operating system for the night.',
      steps: [
        'Review your healing wins from today',
        'Acknowledge any difficult moments without judgment',
        'Set tomorrow\'s healing intention',
        'Activate sleep mode with guided meditation'
      ],
      duration: '12 min',
      xpReward: 30,
      byteReward: 20,
      archetype: ['all'],
      completed: false
    }
  ]

  const archetypeInfo = {
    'data-flooder': {
      name: 'Data Flooder',
      description: 'You process emotions through information gathering and detailed analysis',
      strengths: ['Pattern recognition', 'Analytical thinking', 'Research skills'],
      challenges: ['Overthinking', 'Analysis paralysis', 'Emotional flooding'],
      ritualFocus: 'Structure and organization help you process overwhelming emotions'
    },
    'firewall-builder': {
      name: 'Firewall Builder', 
      description: 'You protect yourself through boundaries and controlled emotional access',
      strengths: ['Strong boundaries', 'Self-protection', 'Logical thinking'],
      challenges: ['Emotional disconnection', 'Trust issues', 'Isolation'],
      ritualFocus: 'Gradual emotional opening while maintaining healthy boundaries'
    },
    'ghost-in-shell': {
      name: 'Ghost in Shell',
      description: 'You navigate emotions through identity exploration and creative expression',
      strengths: ['Adaptability', 'Creativity', 'Self-awareness'],
      challenges: ['Identity confusion', 'Inconsistency', 'Escapism'],
      ritualFocus: 'Grounding practices to stabilize your core sense of self'
    },
    'secure-node': {
      name: 'Secure Node',
      description: 'You heal through community connection and mutual support',
      strengths: ['Empathy', 'Connection', 'Support giving'],
      challenges: ['Codependency', 'People pleasing', 'Boundary issues'],
      ritualFocus: 'Self-care practices that don\'t require others\' validation'
    }
  }

  const currentArchetype = archetypeInfo[userArchetype as keyof typeof archetypeInfo]
  const availableRituals = dailyRituals.filter(ritual => 
    ritual.archetype.includes('all') || ritual.archetype.includes(userArchetype)
  )

  const completedToday = availableRituals.filter(r => r.completed).length
  const progressPercentage = (completedToday / availableRituals.length) * 100

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <Card className="bg-gradient-to-r from-purple-900 to-blue-900 text-white">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center space-x-2">
                <Calendar className="h-8 w-8" />
                <span>Daily Ritual Protocol</span>
              </CardTitle>
              <CardDescription className="text-purple-200 text-lg">
                Personalized healing rituals based on your {currentArchetype.name} archetype
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Archetype Info Sidebar */}
            <div className="space-y-4">
              <Card className="bg-gray-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Your Archetype</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-purple-400">{currentArchetype.name}</h3>
                    <p className="text-gray-300 text-sm">{currentArchetype.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-green-400 mb-2">Strengths</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {currentArchetype.strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <span className="text-green-400">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-orange-400 mb-2">Growth Areas</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {currentArchetype.challenges.map((challenge, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <span className="text-orange-400">•</span>
                          <span>{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-blue-900/30 rounded border border-blue-500/30">
                    <h4 className="font-medium text-blue-400 mb-1">Ritual Focus</h4>
                    <p className="text-sm text-gray-300">{currentArchetype.ritualFocus}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Progress */}
              <Card className="bg-gray-800/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Trophy className="h-5 w-5" />
                    <span>Today's Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Completed</span>
                      <span className="text-white font-bold">{completedToday}/{availableRituals.length}</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="text-center">
                      <Badge className="bg-green-600 text-white">
                        {Math.round(progressPercentage)}% Complete
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Daily Rituals */}
            <div className="lg:col-span-3 space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">Today's Recommended Rituals</h2>
              
              {availableRituals.map((ritual) => (
                <Card 
                  key={ritual.id} 
                  className={`transition-all duration-300 ${
                    ritual.completed 
                      ? 'bg-green-900/30 border-green-500/50' 
                      : 'bg-gray-800/50 border-gray-600 hover:border-purple-500/50'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded ${
                          ritual.completed ? 'bg-green-600' : 'bg-purple-600'
                        }`}>
                          {ritual.completed ? <Star className="h-5 w-5 text-white" /> : <Timer className="h-5 w-5 text-white" />}
                        </div>
                        <div>
                          <CardTitle className="text-white">{ritual.title}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm">
                            <Badge variant="outline" className="text-gray-300">
                              {ritual.category.replace('-', ' ')}
                            </Badge>
                            <span className="text-gray-400">{ritual.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-blue-400">{ritual.xpReward} XP</span>
                          <span className="text-yellow-400">{ritual.byteReward} Bytes</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-300">{ritual.description}</p>
                    
                    <div>
                      <h4 className="font-medium text-white mb-2">Steps:</h4>
                      <ol className="space-y-2">
                        {ritual.steps.map((step, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-sm text-gray-300">
                            <span className="text-purple-400 font-bold mt-0.5">{idx + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    
                    <div className="flex space-x-3">
                      {ritual.completed ? (
                        <Button disabled className="bg-green-600 text-white">
                          <Star className="h-4 w-4 mr-2" />
                          Completed Today
                        </Button>
                      ) : (
                        <>
                          <Button className="bg-purple-600 hover:bg-purple-700">
                            <Zap className="h-4 w-4 mr-2" />
                            Start Ritual
                          </Button>
                          <Button variant="outline" className="text-gray-300 border-gray-600">
                            <BookOpen className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  )
}
