"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, Play, Pause, RotateCcw } from 'lucide-react';

interface Ritual {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  duration: string;
  icon: string;
}

interface Props {
  ritualId: string;
  rituals: Ritual[];
  onClose: () => void;
  onComplete: (ritualId: string) => void;
}

export function RitualModal({ ritualId, rituals, onClose, onComplete }: Props) {
  const ritual = rituals.find(r => r.id === ritualId);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  if (!ritual) return null;

  // Mock ritual steps - in real app this would come from API
  const ritualSteps = [
    {
      title: "Prepare Your Space",
      description: "Find a quiet, comfortable space where you won't be interrupted. Take a moment to settle in.",
      duration: 30
    },
    {
      title: "Center Yourself",
      description: "Take three deep breaths. Feel your feet on the ground and your body in the space.",
      duration: 60
    },
    {
      title: "Practice the Technique",
      description: "Follow the guided practice. Remember, there's no perfect way to do this - just your way.",
      duration: 180
    },
    {
      title: "Reflect",
      description: "Take a moment to notice how you feel. What did you discover about yourself?",
      duration: 60
    }
  ];

  const handleComplete = () => {
    onComplete(ritual.id);
  };

  const startTimer = (seconds: number) => {
    setTimeLeft(seconds);
    setIsActive(true);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <span className="text-2xl">{ritual.icon}</span>
            <span>{ritual.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center space-x-2">
            {ritualSteps.map((_, index) => (
              <div 
                key={index}
                className={`flex-1 h-2 rounded-full ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Current Step */}
          <Card className="bg-gray-700/50 border-gray-600">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-medium">{ritualSteps[currentStep].title}</h3>
                <p className="text-gray-300 leading-relaxed">
                  {ritualSteps[currentStep].description}
                </p>

                {/* Timer */}
                {timeLeft > 0 && (
                  <div className="space-y-2">
                    <div className="text-3xl font-mono text-purple-400">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${((ritualSteps[currentStep].duration - timeLeft) / ritualSteps[currentStep].duration) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Timer Controls */}
                <div className="flex justify-center space-x-2">
                  {timeLeft === 0 ? (
                    <Button
                      onClick={() => startTimer(ritualSteps[currentStep].duration)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start ({Math.floor(ritualSteps[currentStep].duration / 60)}m)
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => setIsActive(!isActive)}
                        variant="outline"
                        className="border-gray-600"
                      >
                        {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        onClick={() => {
                          setTimeLeft(0);
                          setIsActive(false);
                        }}
                        variant="outline"
                        className="border-gray-600"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              variant="outline"
              className="border-gray-600"
            >
              Previous
            </Button>

            {currentStep < ritualSteps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Ritual
              </Button>
            )}
          </div>

          {/* Skip Option */}
          <div className="text-center">
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-gray-400 hover:text-gray-300"
            >
              I'll do this later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
