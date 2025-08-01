"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { 
  Shield, Brain, Heart, Zap, Users, Trophy, 
  Lock, Eye, CheckCircle, ArrowRight, Timer,
  Gamepad2, Target, Star
} from 'lucide-react';

export default function SystemInitializationPage() {
  const [bootProgress, setBootProgress] = useState(0);
  const [isBooting, setIsBooting] = useState(false);

  const startBoot = () => {
    setIsBooting(true);
    const interval = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Redirect to onboarding after boot complete
          setTimeout(() => {
            window.location.href = '/onboarding-quiz';
          }, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const features = [
    {
      icon: <Gamepad2 className="h-8 w-8" />,
      title: "Gamified Progress",
      description: "Track your healing journey with XP points, levels, badges, and streak counters. Turn recovery into an engaging RPG experience.",
      color: "text-purple-400"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Tools", 
      description: "Access closure simulators, letter generators, and reframing tools. Get personalized support when you need it most.",
      color: "text-green-400"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Anonymous Community",
      description: "Share your struggles and victories on the Wall of Wounds. Connect with others without compromising privacy.",
      color: "text-blue-400"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Scientifically Grounded",
      description: "Based on attachment theory, CBT, and evidence-based healing practices. Real psychology wrapped in engaging gamification.",
      color: "text-orange-400"
    }
  ];

  const processSteps = [
    {
      number: "1",
      title: "Complete psychological assessments to personalize your experience",
      description: "8-question emotional system check to determine your archetype"
    },
    {
      number: "2", 
      title: "Choose your digital identity and avatar",
      description: "Select your anonymous codename and healing persona"
    },
    {
      number: "3",
      title: "Select your recovery program and ritual preferences", 
      description: "Customize your no-contact tracking and healing protocols"
    },
    {
      number: "4",
      title: "Begin your journey with personalized daily rituals",
      description: "Start your tailored healing program with gamified progress"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* System Boot Header */}
      <div className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
              System Initialization
            </h1>
            <p className="text-2xl text-purple-400 font-bold">
              Welcome to CTRL+ALT+BLOCK™ - Your digital healing protocol
            </p>
            
            {/* Boot Progress */}
            <Card className="bg-gray-800/50 border border-gray-600/50 max-w-md mx-auto">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">System Boot:</span>
                    <span className="text-green-400">{bootProgress}% Complete</span>
                  </div>
                  <Progress value={bootProgress} className="h-2" />
                  {bootProgress === 100 && (
                    <div className="text-center text-green-400 font-bold">
                      🎉 System Ready - Redirecting to Onboarding...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* REFORMAT PROTOCOL Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <Card className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-2 border-purple-500/50">
          <CardContent className="p-12 text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-white">
                REFORMAT
              </h2>
              <h3 className="text-3xl md:text-4xl font-black text-purple-400">
                PROTOCOL™
              </h3>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                A systematic approach to heartbreak recovery through gamified healing rituals, 
                AI-powered tools, and community support.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className={feature.color}>
                    {feature.icon}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* What to Expect Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">What to Expect</h2>
          <p className="text-gray-400">Your personalized healing journey in 4 steps</p>
        </div>

        <div className="space-y-6">
          {processSteps.map((step, index) => (
            <Card key={index} className="bg-gray-800/50 border border-gray-600/50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {step.number}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Privacy & Anonymity Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Card className="bg-gray-800/50 border border-blue-500/50">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center">
              <Lock className="h-6 w-6 mr-3 text-blue-400" />
              Privacy & Anonymity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-green-400 mt-1" />
              <p className="text-gray-300">
                Your real identity is never shared. All community interactions use your chosen codename.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <Eye className="h-5 w-5 text-purple-400 mt-1" />
              <p className="text-gray-300">
                You control what information is visible and can participate completely anonymously.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-blue-400 mt-1" />
              <p className="text-gray-300">
                All data is encrypted and protected according to industry standards.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Card className="bg-gradient-to-r from-green-900/40 to-blue-900/40 border-2 border-green-500/50">
          <CardContent className="p-12 text-center space-y-8">
            <h2 className="text-3xl font-bold text-white">
              Begin REFORMAT PROTOCOL™
            </h2>
            <div className="flex items-center justify-center space-x-4 text-gray-400">
              <Timer className="h-5 w-5" />
              <span>Takes about 10 minutes</span>
              <span>•</span>
              <span>Cancel anytime</span>
            </div>
            
            <div className="space-y-4">
              {!isBooting ? (
                <Button 
                  size="lg"
                  onClick={startBoot}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-lg px-8 py-4"
                >
                  🚀 Initialize System
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              ) : (
                <Button 
                  size="lg"
                  disabled
                  className="bg-gray-600 text-lg px-8 py-4"
                >
                  ⚡ System Booting...
                </Button>
              )}
              
              <div>
                <Link href="/">
                  <Button variant="ghost" className="text-gray-400 hover:text-white">
                    ← Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
