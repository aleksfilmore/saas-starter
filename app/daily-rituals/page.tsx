"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AuthWrapper from '@/components/AuthWrapper';
import Link from 'next/link';
import { ArrowLeft, Zap, CheckCircle, Clock, Target } from 'lucide-react';

export default function DailyRitualsPage() {
  const rituals = [
    {
      title: "Morning Reboot",
      description: "Start your day with intentional healing",
      duration: "10 min",
      completed: true,
      color: "from-orange-500 to-yellow-500",
      borderColor: "border-orange-500/30"
    },
    {
      title: "Midday Check-in",
      description: "Pause and realign your energy",
      duration: "5 min",
      completed: false,
      color: "from-blue-500 to-cyan-500",
      borderColor: "border-blue-500/30"
    },
    {
      title: "Evening Reflection",
      description: "Process and release the day",
      duration: "15 min",
      completed: false,
      color: "from-purple-500 to-pink-500",
      borderColor: "border-purple-500/30"
    }
  ];

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:text-purple-400">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              ⚡ Daily Rituals
            </h1>
            <p className="text-xl text-purple-400">
              Your personalized healing protocols
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Progress Overview */}
          <Card className="bg-gray-800/80 border border-gray-600/50">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center">
                <Target className="h-6 w-6 mr-2 text-purple-400" />
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">1/3</p>
                  <p className="text-gray-400">Rituals Completed</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-purple-400">33%</p>
                  <p className="text-gray-400">Daily Goal</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rituals List */}
          <div className="space-y-4">
            {rituals.map((ritual, index) => (
              <Card key={index} className={`bg-gray-800/80 border ${ritual.borderColor}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {ritual.completed ? (
                        <CheckCircle className="h-8 w-8 text-green-400" />
                      ) : (
                        <Clock className="h-8 w-8 text-gray-400" />
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-white">{ritual.title}</h3>
                        <p className="text-gray-400">{ritual.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-500">{ritual.duration}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {ritual.completed ? (
                        <div className="text-green-400 font-bold">✓ Complete</div>
                      ) : (
                        <Button className={`bg-gradient-to-r ${ritual.color} hover:opacity-90 text-white`}>
                          Start Ritual
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>

      </div>
    </AuthWrapper>
  );
}
