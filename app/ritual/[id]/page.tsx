'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, 
  Clock, 
  Star, 
  CheckCircle, 
  Play, 
  Pause, 
  RotateCcw,
  Flame,
  Heart,
  Sparkles
} from 'lucide-react';
import { Ritual, RitualStep } from '@/lib/rituals/database';

interface CompletionData {
  reflections: Record<number, string>;
  checklistItems: Record<number, string[]>;
  timeSpent: number;
}

export default function RitualDetailPage() {
  const router = useRouter();
  const params = useParams();
  const ritualId = params.id as string;
  
  const [ritual, setRitual] = useState<Ritual | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [completionData, setCompletionData] = useState<CompletionData>({
    reflections: {},
    checklistItems: {},
    timeSpent: 0
  });
  
  // Timer states
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    fetchRitual();
    startTimeRef.current = Date.now();
  }, [ritualId]);

  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  const fetchRitual = async () => {
    try {
      const response = await fetch(`/api/rituals/${ritualId}`);
      if (response.ok) {
        const data = await response.json();
        setRitual(data.ritual);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to fetch ritual:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = (duration: number) => {
    setTimeLeft(duration);
    setIsTimerRunning(true);
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimerInterval(interval);
  };

  const pauseTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsTimerRunning(false);
  };

  const resetTimer = (duration: number) => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setTimeLeft(duration);
    setIsTimerRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const updateReflection = (stepIndex: number, value: string) => {
    setCompletionData(prev => ({
      ...prev,
      reflections: {
        ...prev.reflections,
        [stepIndex]: value
      }
    }));
  };

  const updateChecklist = (stepIndex: number, option: string, checked: boolean) => {
    setCompletionData(prev => {
      const currentItems = prev.checklistItems[stepIndex] || [];
      const newItems = checked 
        ? [...currentItems, option]
        : currentItems.filter(item => item !== option);
      
      return {
        ...prev,
        checklistItems: {
          ...prev.checklistItems,
          [stepIndex]: newItems
        }
      };
    });
  };

  const canProceed = () => {
    if (!ritual) return false;
    
    const step = ritual.steps[currentStep];
    
    if (step.type === 'reflection') {
      return completionData.reflections[currentStep]?.trim().length > 0;
    }
    
    if (step.type === 'checklist') {
      return (completionData.checklistItems[currentStep]?.length || 0) > 0;
    }
    
    if (step.type === 'timer' || step.type === 'breathing') {
      return timeLeft === 0; // Timer must complete
    }
    
    return true; // Text steps can always proceed
  };

  const goToNextStep = () => {
    if (currentStep < ritual!.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      
      // Reset timer for next step if needed
      const nextStep = ritual!.steps[currentStep + 1];
      if ((nextStep.type === 'timer' || nextStep.type === 'breathing') && nextStep.duration) {
        setTimeLeft(nextStep.duration);
        setIsTimerRunning(false);
        if (timerInterval) {
          clearInterval(timerInterval);
          setTimerInterval(null);
        }
      }
    }
  };

  const completeRitual = async () => {
    setCompleting(true);
    
    try {
      const totalTimeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      
      const response = await fetch(`/api/rituals/${ritualId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify({
          completionData: {
            ...completionData,
            timeSpent: totalTimeSpent
          }
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Show success and redirect with confetti
        router.push(`/dashboard?completed=${ritualId}&xp=${result.xpEarned}&bytes=${result.bytesEarned}`);
      } else {
        console.error('Failed to complete ritual');
      }
    } catch (error) {
      console.error('Error completing ritual:', error);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ritual...</p>
        </div>
      </div>
    );
  }

  if (!ritual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Ritual not found</p>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const progress = ((currentStep + 1) / ritual.steps.length) * 100;
  const currentStepData = ritual.steps[currentStep];
  const isLastStep = currentStep === ritual.steps.length - 1;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600';
      case 'intermediate': return 'text-yellow-600';
      case 'advanced': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '🔥';
      case 'intermediate': return '🔥🔥';
      case 'advanced': return '🔥🔥🔥';
      default: return '🔥';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {ritual.duration_minutes} min
            </Badge>
            <Badge className={getDifficultyColor(ritual.difficulty)}>
              {getDifficultyIcon(ritual.difficulty)} {ritual.difficulty}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 py-8">
        {/* Ritual Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {ritual.title}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            {ritual.description}
          </p>
          
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep + 1} of {ritual.steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {/* Text Step */}
            {currentStepData.type === 'text' && (
              <div className="text-center">
                <div className="text-lg text-gray-800 leading-relaxed">
                  {currentStepData.content}
                </div>
              </div>
            )}

            {/* Breathing Step */}
            {currentStepData.type === 'breathing' && (
              <div className="text-center">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Breathing Exercise</h3>
                  <p className="text-gray-600 mb-6">{currentStepData.content}</p>
                </div>
                
                <div className="mb-6">
                  <div className="text-4xl font-mono text-purple-600 mb-4">
                    {formatTime(timeLeft)}
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    {!isTimerRunning && timeLeft === (currentStepData.duration || 0) && (
                      <Button 
                        onClick={() => startTimer(currentStepData.duration || 0)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    )}
                    
                    {isTimerRunning && (
                      <Button 
                        onClick={pauseTimer}
                        variant="outline"
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    )}
                    
                    <Button 
                      onClick={() => resetTimer(currentStepData.duration || 0)}
                      variant="outline"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
                
                {timeLeft === 0 && (
                  <div className="text-green-600 font-semibold">
                    ✨ Breathing exercise complete! Take a moment to notice how you feel.
                  </div>
                )}
              </div>
            )}

            {/* Timer Step */}
            {currentStepData.type === 'timer' && (
              <div className="text-center">
                <div className="mb-6">
                  <p className="text-lg text-gray-800 mb-6">{currentStepData.content}</p>
                </div>
                
                <div className="mb-6">
                  <div className="text-4xl font-mono text-purple-600 mb-4">
                    {formatTime(timeLeft)}
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    {!isTimerRunning && timeLeft === (currentStepData.duration || 0) && (
                      <Button 
                        onClick={() => startTimer(currentStepData.duration || 0)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Timer
                      </Button>
                    )}
                    
                    {isTimerRunning && (
                      <Button 
                        onClick={pauseTimer}
                        variant="outline"
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    )}
                    
                    <Button 
                      onClick={() => resetTimer(currentStepData.duration || 0)}
                      variant="outline"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
                
                {timeLeft === 0 && (
                  <div className="text-green-600 font-semibold">
                    ✨ Timer complete! How do you feel after this activity?
                  </div>
                )}
              </div>
            )}

            {/* Reflection Step */}
            {currentStepData.type === 'reflection' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">{currentStepData.content}</h3>
                <Textarea
                  placeholder="Take your time to reflect and write your thoughts..."
                  value={completionData.reflections[currentStep] || ''}
                  onChange={(e) => updateReflection(currentStep, e.target.value)}
                  className="min-h-[120px] text-lg"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Your reflections are private and help track your healing journey.
                </p>
              </div>
            )}

            {/* Checklist Step */}
            {currentStepData.type === 'checklist' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">{currentStepData.content}</h3>
                <div className="space-y-4">
                  {currentStepData.options?.map((option, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Checkbox
                        id={`option-${index}`}
                        checked={(completionData.checklistItems[currentStep] || []).includes(option)}
                        onCheckedChange={(checked) => updateChecklist(currentStep, option, checked === true)}
                        className="mt-1"
                      />
                      <label 
                        htmlFor={`option-${index}`}
                        className="text-gray-700 cursor-pointer leading-relaxed"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Complete as many items as feel right for you today.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous Step
          </Button>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Sparkles className="h-4 w-4" />
            <span>+{ritual.xp_reward} XP</span>
            <span>•</span>
            <span>+{ritual.bytes_reward} Bytes</span>
          </div>

          {!isLastStep ? (
            <Button
              onClick={goToNextStep}
              disabled={!canProceed()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Next Step
            </Button>
          ) : (
            <Button
              onClick={completeRitual}
              disabled={!canProceed() || completing}
              className="bg-green-600 hover:bg-green-700"
            >
              {completing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Ritual
                </>
              )}
            </Button>
          )}
        </div>

        {/* Reroll Option (if available) */}
        {ritual.user_tier === 'freemium' && (
          <div className="text-center mt-8">
            <Button variant="ghost" className="text-purple-600 hover:text-purple-700">
              Not feeling this ritual today? Reroll for different one →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
