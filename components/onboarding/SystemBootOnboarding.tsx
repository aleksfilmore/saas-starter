'use client';

// CTRL+ALT+BLOCK™ System Boot Sequence
// Enhanced UX with progressive disclosure and checkpoint-style progress

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronRight, 
  CheckCircle, 
  Circle, 
  Play, 
  Terminal, 
  Zap,
  Shield,
  Brain,
  Heart,
  Sparkles,
  Users
} from 'lucide-react';

// Import onboarding step components
import { WelcomeStep } from './steps/WelcomeStep';
import { CodenameStep } from './steps/CodenameStep';
import { AvatarStep } from './steps/AvatarStep';
import { AttachmentAssessment } from './steps/AttachmentAssessment';
import { HeartStateAssessment } from './steps/HeartStateAssessment';
import { DistressAssessment } from './steps/DistressAssessment';
import { ProgramSelection } from './steps/ProgramSelection';
import { RitualPreferences } from './steps/RitualPreferences';
import { CompletionStep } from './steps/CompletionStep';

interface BootStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: string;
  isComplete: boolean;
  isUnlocked: boolean;
  data?: any;
  ctaLabel: string;
  bootPhase: string;
}

interface SystemBootProps {
  userId: string;
  onComplete: () => void;
}

const BOOT_STEPS: BootStep[] = [
  {
    id: 'welcome',
    title: 'System Initialization',
    description: 'Welcome to CTRL+ALT+BLOCK™ - Your digital healing protocol',
    icon: <Terminal className="h-5 w-5" />,
    component: 'WelcomeStep',
    isComplete: false,
    isUnlocked: true,
    ctaLabel: 'Initialize System',
    bootPhase: 'BOOT'
  },
  {
    id: 'codename',
    title: 'Identity Configuration',
    description: 'Choose your secure codename for anonymity',
    icon: <Shield className="h-5 w-5" />,
    component: 'CodenameStep',
    isComplete: false,
    isUnlocked: false,
    ctaLabel: 'Configure Alias',
    bootPhase: 'IDENTITY'
  },
  {
    id: 'avatar',
    title: 'Avatar Assignment',
    description: 'Select your digital representation',
    icon: <Users className="h-5 w-5" />,
    component: 'AvatarStep',
    isComplete: false,
    isUnlocked: false,
    ctaLabel: 'Assign Avatar',
    bootPhase: 'VISUAL'
  },
  {
    id: 'attachment_assessment',
    title: 'Attachment Scan',
    description: 'Analyze relationship patterns for personalization',
    icon: <Heart className="h-5 w-5" />,
    component: 'AttachmentAssessment',
    isComplete: false,
    isUnlocked: false,
    ctaLabel: 'Run Attachment Scan',
    bootPhase: 'ANALYSIS'
  },
  {
    id: 'heart_state',
    title: 'Heart State Calibration',
    description: 'Current emotional state assessment',
    icon: <Zap className="h-5 w-5" />,
    component: 'HeartStateAssessment',
    isComplete: false,
    isUnlocked: false,
    ctaLabel: 'Calibrate Heart State',
    bootPhase: 'CALIBRATION'
  },
  {
    id: 'distress_index',
    title: 'Distress Index Measurement',
    description: 'Evaluate current healing needs',
    icon: <Brain className="h-5 w-5" />,
    component: 'DistressAssessment',
    isComplete: false,
    isUnlocked: false,
    ctaLabel: 'Measure Distress Index',
    bootPhase: 'ASSESSMENT'
  },
  {
    id: 'program_selection',
    title: 'Protocol Selection',
    description: 'Choose your personalized healing pathway',
    icon: <Sparkles className="h-5 w-5" />,
    component: 'ProgramSelection',
    isComplete: false,
    isUnlocked: false,
    ctaLabel: 'Select Protocol',
    bootPhase: 'CONFIGURATION'
  },
  {
    id: 'complete',
    title: 'System Ready',
    description: 'CTRL+ALT+BLOCK™ fully configured and operational',
    icon: <CheckCircle className="h-5 w-5" />,
    component: 'CompletionStep',
    isComplete: false,
    isUnlocked: false,
    ctaLabel: 'Launch System',
    bootPhase: 'READY'
  }
];

export function SystemBootOnboarding({ userId, onComplete }: SystemBootProps) {
  const [bootSteps, setBootSteps] = useState<BootStep[]>(BOOT_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentStepData, setCurrentStepData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [showStepDetails, setShowStepDetails] = useState(false);

  useEffect(() => {
    // Calculate boot progress
    const completedSteps = bootSteps.filter(step => step.isComplete).length;
    const progress = (completedSteps / bootSteps.length) * 100;
    setBootProgress(progress);
    
    // Auto-unlock next step when current is completed
    const nextIndex = completedSteps;
    if (nextIndex < bootSteps.length) {
      const updatedSteps = [...bootSteps];
      updatedSteps[nextIndex].isUnlocked = true;
      setBootSteps(updatedSteps);
    }
  }, [bootSteps]);

  const saveStepData = async (stepId: string, data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/onboarding/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          stepId,
          responses: data
        })
      });

      if (response.ok) {
        // Mark step as complete
        const updatedSteps = [...bootSteps];
        updatedSteps[currentStepIndex].isComplete = true;
        updatedSteps[currentStepIndex].data = data;
        setBootSteps(updatedSteps);

        // If this was the last step, complete onboarding
        if (stepId === 'complete') {
          setTimeout(() => onComplete(), 1000);
        } else {
          // Move to next step
          setCurrentStepIndex(prev => Math.min(prev + 1, bootSteps.length - 1));
          setShowStepDetails(false);
        }
      }
    } catch (error) {
      console.error('Failed to save step data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectStep = (stepIndex: number) => {
    const step = bootSteps[stepIndex];
    if (step.isUnlocked || step.isComplete) {
      setCurrentStepIndex(stepIndex);
      setShowStepDetails(true);
    }
  };

  const currentStep = bootSteps[currentStepIndex];
  const completedCount = bootSteps.filter(step => step.isComplete).length;

  const renderStepComponent = () => {
    if (!showStepDetails) return null;

    const stepProps = {
      data: currentStepData,
      onNext: (data: any) => {
        setCurrentStepData(data);
        saveStepData(currentStep.id, data);
      },
      onBack: () => setShowStepDetails(false),
      isLoading
    };

    switch (currentStep.component) {
      case 'WelcomeStep':
        return <WelcomeStep {...stepProps} />;
      case 'CodenameStep':
        return <CodenameStep {...stepProps} />;
      case 'AvatarStep':
        return <AvatarStep {...stepProps} />;
      case 'AttachmentAssessment':
        return <AttachmentAssessment {...stepProps} />;
      case 'HeartStateAssessment':
        return <HeartStateAssessment {...stepProps} />;
      case 'DistressAssessment':
        return <DistressAssessment {...stepProps} />;
      case 'ProgramSelection':
        return <ProgramSelection {...stepProps} />;
      case 'CompletionStep':
        return <CompletionStep {...stepProps} />;
      default:
        return <div>Unknown step</div>;
    }
  };

  if (showStepDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-900 to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Step Header */}
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/50">
                {currentStep.bootPhase} {currentStepIndex + 1}/{bootSteps.length}
              </Badge>
              <h1 className="text-3xl font-bold text-white mb-2">
                {currentStep.title}
              </h1>
              <p className="text-gray-300">{currentStep.description}</p>
              
              {/* Mini Progress Bar */}
              <div className="mt-4">
                <Progress value={bootProgress} className="h-2 bg-gray-800" />
                <p className="text-xs text-gray-500 mt-1">
                  System Boot: {Math.round(bootProgress)}% Complete
                </p>
              </div>
            </div>

            {/* Step Content */}
            <Card className="bg-gray-900/80 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                {renderStepComponent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-4" 
                style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
              CTRL+ALT+BLOCK™
            </h1>
            <h2 className="text-2xl font-bold text-white mb-4">System Boot Sequence</h2>
            <p className="text-gray-300 text-lg mb-6">
              Configure your AI-powered healing journey through our progressive initialization protocol
            </p>
            
            {/* Overall Progress */}
            <div className="max-w-md mx-auto">
              <Progress value={bootProgress} className="h-3 bg-gray-800 mb-2" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Initialization</span>
                <span className="text-purple-400 font-mono">
                  {Math.round(bootProgress)}% COMPLETE
                </span>
                <span className="text-gray-400">System Ready</span>
              </div>
            </div>

            {/* Status Banner */}
            <div className="mt-6">
              <Badge className={`text-lg px-4 py-2 ${
                bootProgress === 100 
                  ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                  : 'bg-orange-500/20 text-orange-400 border-orange-500/50'
              }`}>
                {bootProgress === 100 ? 'SYSTEM READY' : 'INITIALIZING...'}
              </Badge>
            </div>
          </div>

          {/* Boot Checklist */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">
              🔧 Initialization Checklist
            </h3>
            
            <div className="grid gap-4">
              {bootSteps.map((step, index) => (
                <Card 
                  key={step.id} 
                  className={`cursor-pointer transition-all duration-300 border-2 ${
                    step.isComplete
                      ? 'bg-green-500/10 border-green-500/50 hover:bg-green-500/20'
                      : step.isUnlocked
                      ? 'bg-purple-500/10 border-purple-500/50 hover:bg-purple-500/20'
                      : 'bg-gray-800/50 border-gray-700/50 cursor-not-allowed opacity-60'
                  }`}
                  onClick={() => selectStep(index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${
                          step.isComplete
                            ? 'bg-green-500/20 text-green-400'
                            : step.isUnlocked
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-gray-700/50 text-gray-500'
                        }`}>
                          {step.isComplete ? <CheckCircle className="h-5 w-5" /> : step.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <h4 className="font-semibold text-white">{step.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {step.bootPhase} {index + 1}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm">{step.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {step.isComplete ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                            ✓ Complete
                          </Badge>
                        ) : step.isUnlocked ? (
                          <Button 
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              selectStep(index);
                            }}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            {step.ctaLabel}
                          </Button>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            Locked
                          </Badge>
                        )}
                        
                        {(step.isUnlocked || step.isComplete) && (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Help & Support Section */}
          <Card className="mt-12 bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-400" />
                Need Help with Setup?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start border-gray-600 hover:bg-gray-800">
                  <Terminal className="h-4 w-4 mr-2" />
                  Setup Guide
                </Button>
                <Button variant="outline" className="justify-start border-gray-600 hover:bg-gray-800">
                  <Users className="h-4 w-4 mr-2" />
                  Community Support
                </Button>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                🔒 Your privacy is protected. All data is encrypted and you can remain anonymous throughout the process.
              </p>
            </CardContent>
          </Card>

          {/* Completion Status */}
          {bootProgress === 100 && (
            <Card className="mt-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/50">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-green-400 mb-2">
                  🎉 System Initialization Complete!
                </h3>
                <p className="text-gray-300 mb-4">
                  CTRL+ALT+BLOCK™ is ready to begin your personalized healing journey.
                </p>
                <Button 
                  onClick={onComplete}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Launch Dashboard
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
