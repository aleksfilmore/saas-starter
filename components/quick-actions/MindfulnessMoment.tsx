"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Brain, Eye, Clock, CheckCircle2, Sparkles } from "lucide-react";

interface MindfulnessExercise {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: number; // in minutes
  steps: string[];
  benefits: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'grounding' | 'awareness' | 'acceptance' | 'focus';
}

const MINDFULNESS_EXERCISES: MindfulnessExercise[] = [
  {
    id: '5-4-3-2-1',
    name: '5-4-3-2-1 Grounding',
    description: 'Use your senses to anchor in the present moment',
    icon: '🌟',
    duration: 3,
    steps: [
      'Name 5 things you can see around you',
      'Name 4 things you can touch',
      'Name 3 things you can hear',
      'Name 2 things you can smell',
      'Name 1 thing you can taste'
    ],
    benefits: ['Reduces anxiety', 'Grounds you in reality', 'Stops spiraling thoughts'],
    difficulty: 'easy',
    category: 'grounding'
  },
  {
    id: 'body-scan',
    name: 'Quick Body Scan',
    description: 'Check in with your physical self',
    icon: '🧘‍♀️',
    duration: 5,
    steps: [
      'Sit comfortably and close your eyes',
      'Start at the top of your head',
      'Notice any tension, warmth, or sensations',
      'Move slowly down through your body',
      'Don\'t try to change anything, just notice',
      'End by taking three deep breaths'
    ],
    benefits: ['Body awareness', 'Tension release', 'Present moment focus'],
    difficulty: 'medium',
    category: 'awareness'
  },
  {
    id: 'thought-observer',
    name: 'Thought Observer',
    description: 'Watch your thoughts like clouds passing by',
    icon: '☁️',
    duration: 4,
    steps: [
      'Sit quietly and notice your thoughts',
      'Don\'t engage with them or judge them',
      'Imagine them as clouds floating by',
      'When you get caught in a thought, gently return to observing',
      'End by acknowledging: "I am not my thoughts"'
    ],
    benefits: ['Thought detachment', 'Reduces rumination', 'Mental clarity'],
    difficulty: 'medium',
    category: 'awareness'
  },
  {
    id: 'loving-kindness',
    name: 'Self-Compassion Moment',
    description: 'Send kindness to yourself',
    icon: '💕',
    duration: 4,
    steps: [
      'Place your hand on your heart',
      'Feel the warmth and your heartbeat',
      'Say: "May I be kind to myself"',
      'Say: "May I give myself the compassion I need"',
      'Say: "May I be strong and resilient"',
      'Notice any resistance without judgment'
    ],
    benefits: ['Self-compassion', 'Emotional regulation', 'Inner kindness'],
    difficulty: 'medium',
    category: 'acceptance'
  },
  {
    id: 'emergency-reset',
    name: 'Emergency Reset',
    description: 'Quick intervention for overwhelming moments',
    icon: '🚨',
    duration: 2,
    steps: [
      'Stop whatever you\'re doing',
      'Take 3 deep breaths',
      'Name where you are out loud',
      'Touch something solid and describe its texture',
      'Remind yourself: "This feeling will pass"'
    ],
    benefits: ['Crisis management', 'Immediate grounding', 'Panic relief'],
    difficulty: 'easy',
    category: 'grounding'
  },
  {
    id: 'micro-meditation',
    name: 'Micro Meditation',
    description: 'One-minute awareness practice',
    icon: '⏰',
    duration: 1,
    steps: [
      'Set a timer for 1 minute',
      'Focus on your breath',
      'Count breaths: 1 on inhale, 2 on exhale, up to 10',
      'If you lose count, start over at 1',
      'When timer ends, notice how you feel'
    ],
    benefits: ['Quick reset', 'Focus training', 'Stress relief'],
    difficulty: 'easy',
    category: 'focus'
  },
  {
    id: 'radical-acceptance',
    name: 'Radical Acceptance',
    description: 'Practice accepting what is, right now',
    icon: '🌊',
    duration: 6,
    steps: [
      'Think of something you\'re struggling to accept',
      'Notice the resistance in your body',
      'Say: "This is what\'s happening right now"',
      'Say: "I don\'t have to like it, but I can accept it"',
      'Breathe with the feeling instead of fighting it',
      'End with: "Acceptance is not giving up, it\'s letting go of what I can\'t control"'
    ],
    benefits: ['Reduces suffering', 'Emotional freedom', 'Inner peace'],
    difficulty: 'hard',
    category: 'acceptance'
  }
];

interface MindfulnessState {
  currentExercise: MindfulnessExercise | null;
  currentStep: number;
  isActive: boolean;
  timeRemaining: number;
  isComplete: boolean;
}

interface MindfulnessMomentProps {
  onComplete?: (exercise: MindfulnessExercise) => void;
}

export function MindfulnessMoment({ onComplete }: MindfulnessMomentProps) {
  const [state, setState] = useState<MindfulnessState>({
    currentExercise: null,
    currentStep: 0,
    isActive: false,
    timeRemaining: 0,
    isComplete: false
  });

  const startExercise = (exercise: MindfulnessExercise) => {
    setState({
      currentExercise: exercise,
      currentStep: 0,
      isActive: true,
      timeRemaining: exercise.duration * 60,
      isComplete: false
    });
  };

  const nextStep = () => {
    if (state.currentExercise && state.currentStep < state.currentExercise.steps.length - 1) {
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1
      }));
    } else {
      completeExercise();
    }
  };

  const completeExercise = async () => {
    if (state.currentExercise) {
      setState(prev => ({
        ...prev,
        isActive: false,
        isComplete: true
      }));
      
      try {
        // Sync with API for cross-platform support
        await fetch('/api/quickactions/mindfulness', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            exercise: state.currentExercise,
            duration: state.currentExercise.duration,
            steps: state.currentExercise.steps,
            reflection: null // Could add reflection input later
          })
        });
      } catch (error) {
        console.error('Failed to sync mindfulness exercise:', error);
      }
      
      onComplete?.(state.currentExercise);
    }
  };

  const resetExercise = () => {
    setState({
      currentExercise: null,
      currentStep: 0,
      isActive: false,
      timeRemaining: 0,
      isComplete: false
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'grounding': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'awareness': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'acceptance': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'focus': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-purple-200 text-center text-sm">
          <Shield className="w-6 h-6 mx-auto mb-2" />
          Mindfulness Moment
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center">
            🧘‍♀️ Mindfulness Moment
          </DialogTitle>
        </DialogHeader>

        {!state.currentExercise ? (
          <div className="space-y-6">
            <p className="text-gray-300 text-center">
              Choose a mindfulness practice to center yourself in the present moment
            </p>

            <div className="grid gap-4">
              {MINDFULNESS_EXERCISES.map((exercise) => (
                <Card key={exercise.id} className="bg-gray-800 border-gray-600 hover:border-gray-500 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xl">{exercise.icon}</span>
                          <h3 className="font-bold text-white">{exercise.name}</h3>
                          <Badge className={getDifficultyColor(exercise.difficulty)}>
                            {exercise.difficulty}
                          </Badge>
                          <Badge className={getCategoryColor(exercise.category)}>
                            {exercise.category}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{exercise.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-300">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{exercise.duration} min</span>
                          </span>
                          <span>{exercise.steps.length} steps</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h4 className="text-xs font-medium text-gray-400 mb-1">Benefits:</h4>
                      <div className="flex flex-wrap gap-1">
                        {exercise.benefits.map((benefit, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={() => startExercise(exercise)}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Start {exercise.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : state.isComplete ? (
          <div className="text-center space-y-6 py-8">
            <div className="text-6xl mb-4">🕯️</div>
            <h3 className="text-2xl font-bold text-green-400">Mindfulness Complete!</h3>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-300 mb-2">
                Completed {state.currentExercise.name} • {state.currentExercise.duration} minutes
              </p>
              <div className="flex justify-center space-x-2">
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                  +{state.currentExercise.duration * 3} Bytes
                </Badge>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              You've practiced presence and awareness. Notice how your mind feels now.
            </p>
            <div className="flex justify-center space-x-3">
              <Button 
                onClick={resetExercise}
                variant="outline"
              >
                Choose Another Practice
              </Button>
              <Button 
                onClick={() => startExercise(state.currentExercise!)}
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                Repeat This Practice
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Exercise Header */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-1">
                {state.currentExercise.icon} {state.currentExercise.name}
              </h3>
              <p className="text-gray-400">
                Step {state.currentStep + 1} of {state.currentExercise.steps.length}
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex space-x-2 justify-center">
              {state.currentExercise.steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= state.currentStep 
                      ? 'bg-purple-500' 
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Current Step */}
            <Card className="bg-gradient-to-br from-purple-900/30 via-indigo-900/20 to-blue-900/30 border-purple-500/30">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">
                  {state.currentExercise.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {state.currentExercise.steps[state.currentStep]}
                </h3>
                <p className="text-gray-300 text-sm mb-6">
                  Take your time with this step. There's no rush.
                </p>
                
                <Button 
                  onClick={nextStep}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                >
                  {state.currentStep < state.currentExercise.steps.length - 1 ? (
                    <>
                      Next Step
                      <Sparkles className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Complete Practice
                      <CheckCircle2 className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Exercise Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-gray-800/50 border-gray-600">
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Duration:</h4>
                  <p className="text-white">{state.currentExercise.duration} minutes</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-600">
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Category:</h4>
                  <Badge className={getCategoryColor(state.currentExercise.category)}>
                    {state.currentExercise.category}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Controls */}
            <div className="flex justify-center">
              <Button 
                onClick={resetExercise}
                variant="outline"
              >
                Choose Different Practice
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
