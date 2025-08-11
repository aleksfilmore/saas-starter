"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, Play, Pause, RotateCcw, CheckCircle2, Wind, Waves } from "lucide-react";

interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  icon: string;
  inhale: number;
  hold: number;
  exhale: number;
  cycles: number;
  benefits: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal counts for inhale, hold, exhale, hold',
    icon: '📦',
    inhale: 4,
    hold: 4,
    exhale: 4,
    cycles: 8,
    benefits: ['Reduces anxiety', 'Improves focus', 'Calms nervous system'],
    difficulty: 'beginner'
  },
  {
    id: 'calm',
    name: 'Calming Breath',
    description: 'Longer exhale for relaxation',
    icon: '🌙',
    inhale: 4,
    hold: 2,
    exhale: 6,
    cycles: 10,
    benefits: ['Deep relaxation', 'Stress relief', 'Better sleep'],
    difficulty: 'beginner'
  },
  {
    id: 'energizing',
    name: 'Energizing Breath',
    description: 'Quick rhythm for alertness',
    icon: '⚡',
    inhale: 3,
    hold: 1,
    exhale: 2,
    cycles: 15,
    benefits: ['Increases energy', 'Mental clarity', 'Motivation boost'],
    difficulty: 'intermediate'
  },
  {
    id: 'crisis',
    name: 'Crisis Recovery',
    description: 'Emergency reset for panic moments',
    icon: '🚨',
    inhale: 4,
    hold: 7,
    exhale: 8,
    cycles: 6,
    benefits: ['Panic relief', 'Emotional regulation', 'System reset'],
    difficulty: 'intermediate'
  }
];

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'pause';

interface BreathingExerciseProps {
  onComplete?: (pattern: BreathingPattern, completedCycles: number) => void;
  children?: React.ReactNode;
}

export function BreathingExercise({ onComplete, children }: BreathingExerciseProps) {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('inhale');
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Timer effect for breathing exercise
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && selectedPattern && phaseTimeLeft > 0) {
      interval = setInterval(() => {
        setPhaseTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && selectedPattern && phaseTimeLeft === 0) {
      // Move to next phase
      if (currentPhase === 'inhale') {
        setCurrentPhase('hold');
        setPhaseTimeLeft(selectedPattern.hold);
      } else if (currentPhase === 'hold') {
        setCurrentPhase('exhale');
        setPhaseTimeLeft(selectedPattern.exhale);
      } else if (currentPhase === 'exhale') {
        if (currentCycle + 1 >= selectedPattern.cycles) {
          // Exercise complete
          setIsActive(false);
          setIsComplete(true);
          onComplete?.(selectedPattern, selectedPattern.cycles);
        } else {
          // Next cycle
          setCurrentCycle(prev => prev + 1);
          setCurrentPhase('inhale');
          setPhaseTimeLeft(selectedPattern.inhale);
        }
      }
    }

    return () => clearInterval(interval);
  }, [isActive, phaseTimeLeft, currentPhase, currentCycle, selectedPattern, onComplete]);

  const startExercise = (pattern: BreathingPattern) => {
    setSelectedPattern(pattern);
    setCurrentPhase('inhale');
    setPhaseTimeLeft(pattern.inhale);
    setCurrentCycle(0);
    setIsActive(true);
    setIsComplete(false);
  };

  const pauseResume = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setPhaseTimeLeft(selectedPattern?.inhale || 0);
    setCurrentCycle(0);
    setIsComplete(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'pause': return 'Pause';
      default: return '';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'text-blue-400';
      case 'hold': return 'text-yellow-400';
      case 'exhale': return 'text-green-400';
      case 'pause': return 'text-gray-400';
      default: return 'text-white';
    }
  };

  const getProgressPercentage = () => {
    if (!selectedPattern) return 0;
    const totalTime = selectedPattern.inhale + selectedPattern.hold + selectedPattern.exhale;
    const currentPhaseTotal = currentPhase === 'inhale' ? selectedPattern.inhale :
                             currentPhase === 'hold' ? selectedPattern.hold :
                             selectedPattern.exhale;
    const phaseProgress = ((currentPhaseTotal - phaseTimeLeft) / currentPhaseTotal) * 100;
    const cycleProgress = (currentCycle / selectedPattern.cycles) * 100;
    return Math.min(100, cycleProgress + (phaseProgress / selectedPattern.cycles));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="ghost"
            size="sm"
            className="text-teal-300 hover:text-teal-200 hover:bg-teal-500/10 flex items-center gap-1.5 text-xs"
          >
            <Wind className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Breathing</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center">
            🫁 Breathing Exercise
          </DialogTitle>
        </DialogHeader>

        {!selectedPattern ? (
          <div className="space-y-6">
            <p className="text-gray-300 text-center">
              Choose a breathing pattern to reset your nervous system
            </p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {BREATHING_PATTERNS.map((pattern) => (
                <Card key={pattern.id} className="bg-gray-800 border-gray-600 hover:border-gray-500 transition-all cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xl">{pattern.icon}</span>
                          <h3 className="font-bold text-white text-sm">{pattern.name}</h3>
                          <Badge className={`text-xs ${getDifficultyColor(pattern.difficulty)}`}>
                            {pattern.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-xs">{pattern.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-300 mb-3">
                      <span>In {pattern.inhale}s</span>
                      <span>Hold {pattern.hold}s</span>
                      <span>Out {pattern.exhale}s</span>
                      <span>{pattern.cycles} cycles</span>
                    </div>

                    <div className="mb-3">
                      <h4 className="text-xs font-medium text-gray-400 mb-1">Benefits:</h4>
                      <div className="flex flex-wrap gap-1">
                        {pattern.benefits.slice(0, 2).map((benefit, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                        {pattern.benefits.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{pattern.benefits.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button 
                      onClick={() => startExercise(pattern)}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-sm"
                      size="sm"
                    >
                      <Play className="w-3 h-3 mr-2" />
                      Start {pattern.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : isComplete ? (
          <div className="text-center space-y-6 py-8">
            <div className="text-6xl mb-4">🧘‍♀️</div>
            <h3 className="text-2xl font-bold text-green-400">Exercise Complete!</h3>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-300 mb-2">
                Completed {selectedPattern.name} • {selectedPattern.cycles} cycles
              </p>
              <div className="flex justify-center space-x-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                  +25 XP
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                  +15 Bytes
                </Badge>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Your nervous system has been reset. Notice how you feel now.
            </p>
            <div className="flex justify-center space-x-3">
              <Button 
                onClick={() => setSelectedPattern(null)}
                variant="outline"
              >
                Try Another Pattern
              </Button>
              <Button 
                onClick={() => startExercise(selectedPattern)}
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                Repeat This Exercise
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Exercise Header */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">
                {selectedPattern.icon} {selectedPattern.name}
              </h3>
              <p className="text-gray-400">
                Cycle {currentCycle + 1} of {selectedPattern.cycles}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={getProgressPercentage()} className="h-2" />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Progress</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
            </div>

            {/* Breathing Visualization */}
            <div className="text-center space-y-4">
              <div className="relative">
                <div className={`w-32 h-32 rounded-full border-4 border-current ${getPhaseColor()} mx-auto transition-all duration-1000 ${
                  currentPhase === 'inhale' ? 'scale-125' : 
                  currentPhase === 'exhale' ? 'scale-75' : 'scale-100'
                }`}>
                  <div className="flex items-center justify-center h-full">
                    <Waves className={`w-16 h-16 ${getPhaseColor()}`} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className={`text-3xl font-bold ${getPhaseColor()}`}>
                  {getPhaseInstruction()}
                </h2>
                <div className={`text-6xl font-mono ${getPhaseColor()}`}>
                  {phaseTimeLeft}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-3">
              <Button onClick={pauseResume} variant="outline">
                {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button onClick={reset} variant="outline">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button 
                onClick={() => setSelectedPattern(null)}
                variant="outline"
              >
                Change Pattern
              </Button>
            </div>

            {/* Benefits Reminder */}
            <Card className="bg-gray-800/50 border-gray-600">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Current Benefits:</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedPattern.benefits.map((benefit, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
