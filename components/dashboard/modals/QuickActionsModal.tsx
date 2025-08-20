"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wind, Brain, Sparkles, Heart } from 'lucide-react';
import { BreathingExercise } from '@/components/quick-actions/BreathingExercise';
import { MindfulnessMoment } from '@/components/quick-actions/MindfulnessMoment';

interface QuickActionsModalProps {
  children: React.ReactNode;
}

export function QuickActionsModal({ children }: QuickActionsModalProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const quickActions = [
    {
      id: 'breathing',
      title: 'Breathing Exercise',
      description: 'Guided breathing patterns to calm your nervous system',
      icon: Wind,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'mindfulness',
      title: 'Mindfulness Moment',
      description: 'Quick mindfulness practice to ground yourself',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    {
      id: 'gratitude',
      title: 'Gratitude Reset',
      description: 'Quick gratitude practice to shift your mindset',
      icon: Sparkles,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30'
    },
    {
      id: 'self-compassion',
      title: 'Self-Compassion Break',
      description: 'Gentle words and kindness for yourself',
      icon: Heart,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    }
  ];

  const renderSelectedAction = () => {
    switch (selectedAction) {
      case 'breathing':
        return (
          <BreathingExercise 
            onComplete={(pattern, cycles) => {
              console.log(`Completed ${pattern.name} breathing exercise with ${cycles} cycles`);
              setSelectedAction(null);
            }}
          />
        );
      case 'mindfulness':
        return (
          <MindfulnessMoment 
            onComplete={(duration) => {
              console.log(`Completed ${duration} minute mindfulness session`);
              setSelectedAction(null);
            }}
          />
        );
      case 'gratitude':
        return (
          <div className="space-y-6 text-center">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-yellow-400">Quick Gratitude Reset</h3>
            <div className="space-y-4 text-left">
              <p className="text-gray-300">Take a moment to think of:</p>
              <ul className="space-y-2 text-gray-400">
                <li>• Something that made you smile today</li>
                <li>• A person you're grateful for</li>
                <li>• A small comfort or pleasure you enjoyed</li>
                <li>• Progress you've made, no matter how small</li>
              </ul>
            </div>
            <Button 
              onClick={() => setSelectedAction(null)}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              Complete Gratitude Reset
            </Button>
          </div>
        );
      case 'self-compassion':
        return (
          <div className="space-y-6 text-center">
            <div className="text-6xl mb-4">💚</div>
            <h3 className="text-xl font-bold text-green-400">Self-Compassion Break</h3>
            <div className="space-y-4 text-left">
              <p className="text-gray-300">Repeat these words to yourself:</p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-2">
                <p className="text-green-300 italic">"This is a moment of struggle."</p>
                <p className="text-green-300 italic">"Struggle is part of being human."</p>
                <p className="text-green-300 italic">"May I be kind to myself in this moment."</p>
                <p className="text-green-300 italic">"May I give myself the compassion I need."</p>
              </div>
            </div>
            <Button 
              onClick={() => setSelectedAction(null)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              Complete Self-Compassion Break
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            🌿 Quick Actions
          </DialogTitle>
        </DialogHeader>

        {!selectedAction ? (
          <div className="space-y-6">
            <p className="text-gray-300 text-center">
              Choose a quick action to help regulate your nervous system and find your center.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <Card 
                    key={action.id}
                    className={`${action.bgColor} ${action.borderColor} border cursor-pointer hover:scale-105 transition-transform`}
                    onClick={() => setSelectedAction(action.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-white mb-2">{action.title}</h3>
                      <p className="text-gray-400 text-sm">{action.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm text-center">
                💡 These micro-practices take 1-5 minutes and can help shift your emotional state instantly.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Button
              onClick={() => setSelectedAction(null)}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              ← Back to Quick Actions
            </Button>
            {renderSelectedAction()}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
