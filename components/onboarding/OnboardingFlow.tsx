'use client';

// REFORMAT PROTOCOL™ Onboarding Flow
// Multi-step wizard for user initialization

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import onboarding step components
import { WelcomeStep } from './steps/WelcomeStep';
import { CodenameStep } from './steps/CodenameStep';
import { AvatarStep } from './steps/AvatarStep';
import { AttachmentAssessment } from './steps/AttachmentAssessment';
import { DistressAssessment } from './steps/DistressAssessment';
import { ProgramSelection } from './steps/ProgramSelection';
import { RitualPreferences } from './steps/RitualPreferences';
import { CompletionStep } from './steps/CompletionStep';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  isComplete: boolean;
  data?: any;
}

interface OnboardingProgress {
  currentStep: number;
  totalSteps: number;
  steps: OnboardingStep[];
  userId: string;
}

interface OnboardingFlowProps {
  userId: string;
  onComplete: () => void;
}

export function OnboardingFlow({ userId, onComplete }: OnboardingFlowProps) {
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [currentStepData, setCurrentStepData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize onboarding progress
  useEffect(() => {
    initializeProgress();
  }, [userId]);

  const initializeProgress = async () => {
    try {
      const response = await fetch(`/api/onboarding/progress?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
      }
    } catch (error) {
      console.error('Failed to load onboarding progress:', error);
    }
  };

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
        // Mark step as complete and move to next
        if (progress) {
          const updatedSteps = [...progress.steps];
          updatedSteps[progress.currentStep].isComplete = true;
          updatedSteps[progress.currentStep].data = data;
          
          const nextStep = Math.min(progress.currentStep + 1, progress.totalSteps - 1);
          
          setProgress({
            ...progress,
            currentStep: nextStep,
            steps: updatedSteps
          });

          // If this was the last step, complete onboarding
          if (stepId === 'complete') {
            onComplete();
          }
        }
      }
    } catch (error) {
      console.error('Failed to save step data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (progress && stepIndex >= 0 && stepIndex < progress.totalSteps) {
      setProgress({
        ...progress,
        currentStep: stepIndex
      });
    }
  };

  const canGoBack = progress && progress.currentStep > 0;
  const canGoNext = progress && progress.currentStep < progress.totalSteps - 1 && 
                   progress.steps[progress.currentStep].isComplete;

  if (!progress) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Initializing REFORMAT PROTOCOL™...</p>
        </div>
      </div>
    );
  }

  const currentStep = progress.steps[progress.currentStep];
  const progressPercent = ((progress.currentStep + 1) / progress.totalSteps) * 100;

  const renderStepComponent = () => {
    const stepProps = {
      data: currentStepData,
      onNext: (data: any) => {
        setCurrentStepData(data);
        saveStepData(currentStep.id, data);
      },
      onBack: () => goToStep(progress.currentStep - 1),
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
      case 'DistressAssessment':
        return <DistressAssessment {...stepProps} />;
      case 'ProgramSelection':
        return <ProgramSelection {...stepProps} />;
      case 'RitualPreferences':
        return <RitualPreferences {...stepProps} />;
      case 'CompletionStep':
        return <CompletionStep {...stepProps} />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                REFORMAT PROTOCOL™
              </h1>
              <p className="text-gray-400">Initialization Sequence</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">
                Step {progress.currentStep + 1} of {progress.totalSteps}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                SYSTEM_STATUS: INITIALIZING
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress 
              value={progressPercent} 
              className="h-2 bg-gray-800"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Beginning</span>
              <span>{Math.round(progressPercent)}% Complete</span>
              <span>Protocol Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-cyan-400">
              {currentStep.title}
            </CardTitle>
            <p className="text-gray-400">{currentStep.description}</p>
          </CardHeader>
          <CardContent>
            {renderStepComponent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => goToStep(progress.currentStep - 1)}
            disabled={!canGoBack || isLoading}
            className="border-gray-700 hover:bg-gray-800"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-2">
            {progress.steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => goToStep(index)}
                disabled={!step.isComplete && index !== progress.currentStep}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === progress.currentStep
                    ? 'bg-cyan-500'
                    : step.isComplete
                    ? 'bg-green-500'
                    : 'bg-gray-700'
                }`}
                title={step.title}
              />
            ))}
          </div>

          <Button
            onClick={() => goToStep(progress.currentStep + 1)}
            disabled={!canGoNext || isLoading}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 p-6 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            Your data is encrypted and secure. Complete onboarding to unlock your personalized healing journey.
          </p>
          <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-600">
            <span>Privacy Protected</span>
            <span>•</span>
            <span>Anonymous Options Available</span>
            <span>•</span>
            <span>Cancel Anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}
