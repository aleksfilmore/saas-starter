"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Shield, 
  Zap, 
  Heart,
  Target,
  Sparkles,
  Crown,
  Timer
} from 'lucide-react';
import { useErrorHandling, LoadingSpinner, ErrorDisplay } from '@/components/ui/error-handling';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  estimatedTime: string;
  xpReward: number;
}

interface ProgressiveOnboardingProps {
  currentStep: number;
  onStepComplete: (stepId: string, data: any) => void;
  onSkipStep?: (stepId: string) => void;
  userAlias?: string;
  emotionalTone?: 'numb' | 'vengeance' | 'logic' | 'help-others';
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'alias',
    title: 'Identity Assignment Protocol',
    description: 'Choose your anonymous healing alias. This is how you\'ll be known in the community.',
    icon: <User className="h-6 w-6" />,
    estimatedTime: '1 min',
    xpReward: 25
  },
  {
    id: 'emotional-tone',
    title: 'Emotional Tone Dial',
    description: 'Set your current emotional state to customize your experience.',
    icon: <Heart className="h-6 w-6" />,
    estimatedTime: '2 min',
    xpReward: 30
  },
  {
    id: 'system-icon',
    title: 'System Icon Protocol',
    description: 'Choose your visual identity within the platform.',
    icon: <Shield className="h-6 w-6" />,
    estimatedTime: '1 min',
    xpReward: 20
  },
  {
    id: 'quick-scan',
    title: 'Quick-Scan Quiz',
    description: 'Brief assessment to personalize your healing journey.',
    icon: <Target className="h-6 w-6" />,
    estimatedTime: '3 min',
    xpReward: 40
  },
  {
    id: 'first-ritual',
    title: 'Initialize First Ritual',
    description: 'Complete your first healing ritual to activate the system.',
    icon: <Sparkles className="h-6 w-6" />,
    estimatedTime: '5 min',
    xpReward: 50
  }
];

const EMOTIONAL_TONES = [
  {
    id: 'numb',
    label: 'NUMB',
    description: 'Feeling disconnected, empty, or emotionally flat',
    color: 'bg-gray-500',
    textColor: 'text-gray-400',
    borderColor: 'border-gray-500/50'
  },
  {
    id: 'vengeance',
    label: 'VENGEANCE',
    description: 'Feeling angry, hurt, or seeking justice',
    color: 'bg-red-500',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/50'
  },
  {
    id: 'logic',
    label: 'LOGIC',
    description: 'Analytical, rational, focused on understanding',
    color: 'bg-blue-500',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/50'
  },
  {
    id: 'help-others',
    label: 'HELP OTHERS',
    description: 'Channeling pain into helping others heal',
    color: 'bg-green-500',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/50'
  }
];

const SYSTEM_ICONS = [
  { id: 'ghost', icon: '👻', name: 'Protocol Ghost' },
  { id: 'robot', icon: '🤖', name: 'Healing Bot' },
  { id: 'glitch', icon: '⚡', name: 'Glitch Entity' },
  { id: 'phoenix', icon: '🔥', name: 'Phoenix Rising' },
  { id: 'diamond', icon: '💎', name: 'Diamond Core' },
  { id: 'storm', icon: '🌩️', name: 'Storm System' }
];

export default function ProgressiveOnboarding({
  currentStep,
  onStepComplete,
  onSkipStep,
  userAlias = '',
  emotionalTone = 'numb'
}: ProgressiveOnboardingProps) {
  const [alias, setAlias] = useState(userAlias);
  const [selectedTone, setSelectedTone] = useState(emotionalTone);
  const [selectedIcon, setSelectedIcon] = useState('ghost');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [showStepAnimation, setShowStepAnimation] = useState(false);
  const { error, isLoading, handleAsyncOperation, clearError } = useErrorHandling();

  const currentStepData = ONBOARDING_STEPS[currentStep] || ONBOARDING_STEPS[0];
  const totalSteps = ONBOARDING_STEPS.length;
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  // Trigger step animation on step change
  useEffect(() => {
    setShowStepAnimation(true);
    const timer = setTimeout(() => setShowStepAnimation(false), 500);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleStepComplete = async (data: any) => {
    await handleAsyncOperation(async () => {
      await onStepComplete(currentStepData.id, data);
    }, `Failed to complete ${currentStepData.title}`);
  };

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case 'alias':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">👤</div>
              <p className="text-gray-300 leading-relaxed">
                Your alias protects your privacy while connecting you to the community. 
                Choose something that feels authentic but anonymous.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-bold mb-2">Your Healing Alias</label>
                <Input
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="e.g., DigitalPhoenix, GlitchWarrior, VoidSeeker..."
                  className="bg-gray-800 border-purple-500/50 text-white placeholder-gray-400"
                  maxLength={20}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {alias.length}/20 characters
                </p>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-400 font-bold mb-2">💡 Alias Tips</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Make it memorable but not personal</li>
                  <li>• Avoid real names or identifying info</li>
                  <li>• Tech/healing themes work well</li>
                  <li>• You can change it later in settings</li>
                </ul>
              </div>
            </div>
            
            <Button
              onClick={() => handleStepComplete({ alias })}
              disabled={alias.length < 3 || isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3"
            >
              {isLoading ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  Assign Alias <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        );

      case 'emotional-tone':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🎭</div>
              <p className="text-gray-300 leading-relaxed">
                Your emotional tone shapes how the AI responds to you and what content you see. 
                You can adjust this anytime based on how you're feeling.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EMOTIONAL_TONES.map((tone) => (
                <Button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id as any)}
                  variant="outline"
                  className={`p-6 h-auto text-left transition-all duration-300 ${
                    selectedTone === tone.id
                      ? `bg-${tone.color}/20 border-${tone.color} shadow-lg scale-105`
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${tone.color}`} />
                      <span className={`font-bold ${selectedTone === tone.id ? tone.textColor : 'text-white'}`}>
                        {tone.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {tone.description}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-bold mb-2">🔄 Dynamic Personalization</h4>
              <p className="text-sm text-gray-300">
                Your emotional tone affects AI responses, ritual suggestions, and community feed curation. 
                Change it whenever your mood shifts.
              </p>
            </div>
            
            <Button
              onClick={() => handleStepComplete({ emotionalTone: selectedTone })}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3"
            >
              {isLoading ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  Set Emotional Tone <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        );

      case 'system-icon':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-gray-300 leading-relaxed">
                Choose your visual identity. This icon represents you in the community 
                and personalizes your interface.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {SYSTEM_ICONS.map((icon) => (
                <Button
                  key={icon.id}
                  onClick={() => setSelectedIcon(icon.id)}
                  variant="outline"
                  className={`p-6 h-auto transition-all duration-300 ${
                    selectedIcon === icon.id
                      ? 'bg-purple-500/20 border-purple-500 shadow-lg scale-105'
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <div className="text-center space-y-2">
                    <div className="text-4xl">{icon.icon}</div>
                    <div className="text-sm font-medium text-white">
                      {icon.name}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            
            <Button
              onClick={() => handleStepComplete({ systemIcon: selectedIcon })}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white font-bold py-3"
            >
              {isLoading ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  Select Icon <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        );

      // Add other step cases as needed...
      default:
        return (
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">🚧</div>
            <p className="text-gray-300">This step is under construction.</p>
            <Button
              onClick={() => handleStepComplete({})}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Skip Step <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Error Display */}
      {error && <ErrorDisplay error={error} onDismiss={clearError} />}
      
      {/* Progress Header */}
      <Card className="bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-blue-900/40 border-2 border-purple-500/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black text-white" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                CTRL+ALT+BLOCK™ SETUP
              </CardTitle>
              <p className="text-purple-400 font-medium">
                Initializing your healing protocol...
              </p>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
              Step {currentStep + 1} of {totalSteps}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">Setup Progress</span>
              <span className="text-sm font-bold text-purple-400">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {ONBOARDING_STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col items-center space-y-1 transition-all duration-300 ${
                  index <= currentStep ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  index < currentStep
                    ? 'bg-green-500 border-green-500 text-white'
                    : index === currentStep
                    ? 'bg-purple-500 border-purple-500 text-white animate-pulse'
                    : 'bg-gray-700 border-gray-600 text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </div>
                <span className="text-xs text-center max-w-16 leading-tight">
                  {step.title.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Current Step */}
      <Card className={`bg-gradient-to-br from-gray-900/80 via-purple-900/40 to-pink-900/20 border-2 border-purple-500/50 transition-all duration-500 ${
        showStepAnimation ? 'animate-in slide-in-from-right-5' : ''
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-purple-400">
                {currentStepData.icon}
              </div>
              <div>
                <CardTitle className="text-xl font-black text-white">
                  {currentStepData.title}
                </CardTitle>
                <p className="text-gray-400 text-sm">
                  {currentStepData.description}
                </p>
              </div>
            </div>
            <div className="text-right text-sm">
              <div className="flex items-center space-x-1 text-purple-400">
                <Timer className="h-4 w-4" />
                <span>{currentStepData.estimatedTime}</span>
              </div>
              <div className="flex items-center space-x-1 text-green-400 mt-1">
                <Zap className="h-4 w-4" />
                <span>+{currentStepData.xpReward} XP</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={() => currentStep > 0 && onStepComplete('back', {})}
          disabled={currentStep === 0 || isLoading}
          variant="outline"
          className="border-gray-500 text-gray-400 hover:bg-gray-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        {onSkipStep && (
          <Button
            onClick={() => onSkipStep(currentStepData.id)}
            variant="ghost"
            className="text-gray-400 hover:text-white"
            disabled={isLoading}
          >
            Skip Step
          </Button>
        )}
      </div>
    </div>
  );
}
