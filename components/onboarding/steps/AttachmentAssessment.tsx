'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AttachmentAssessmentProps {
  onNext: (data: any) => void;
  isLoading: boolean;
}

interface Question {
  id: string;
  text: string;
  type: 'scale' | 'choice';
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: [string, string];
}

const QUESTIONS: Question[] = [
  {
    id: 'worry_abandonment',
    text: 'I worry about being abandoned or left behind in relationships',
    type: 'scale',
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ['Never true', 'Always true']
  },
  {
    id: 'uncomfortable_closeness',
    text: 'I find it difficult to get close to romantic partners',
    type: 'scale',
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ['Never true', 'Always true']
  },
  {
    id: 'need_approval',
    text: 'I need a lot of approval from my partner',
    type: 'scale',
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ['Never true', 'Always true']
  },
  {
    id: 'prefer_independence',
    text: 'I prefer not to show others how I feel deep down',
    type: 'scale',
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ['Never true', 'Always true']
  },
  {
    id: 'fear_rejection',
    text: 'I worry that romantic partners won\'t care about me as much as I care about them',
    type: 'scale',
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ['Never true', 'Always true']
  },
  {
    id: 'nervous_depending',
    text: 'I get nervous when partners want to be very close',
    type: 'scale',
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ['Never true', 'Always true']
  },
  {
    id: 'relationship_patterns',
    text: 'Which pattern best describes your relationships?',
    type: 'choice',
    options: [
      'I form deep bonds quickly and worry constantly about losing them',
      'I keep my distance and prefer emotional independence', 
      'I want closeness but also fear it - I push and pull',
      'I feel secure and comfortable with intimacy and independence'
    ]
  }
];

export function AttachmentAssessment({ onNext, isLoading }: AttachmentAssessmentProps) {
  const [responses, setResponses] = useState<Record<string, number | string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [attachmentStyle, setAttachmentStyle] = useState<{
    style: 'anxious' | 'avoidant' | 'disorganized' | 'secure';
    description: string;
  } | null>(null);

  const handleResponse = (questionId: string, value: number | string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const goToNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateAttachmentStyle();
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateAttachmentStyle = () => {
    // Simplified scoring algorithm
    const anxiousItems = ['worry_abandonment', 'need_approval', 'fear_rejection'];
    const avoidantItems = ['uncomfortable_closeness', 'prefer_independence', 'nervous_depending'];
    
    const anxiousScore = anxiousItems.reduce((sum, item) => {
      return sum + (typeof responses[item] === 'number' ? responses[item] as number : 0);
    }, 0) / anxiousItems.length;
    
    const avoidantScore = avoidantItems.reduce((sum, item) => {
      return sum + (typeof responses[item] === 'number' ? responses[item] as number : 0);
    }, 0) / avoidantItems.length;

    let style: 'anxious' | 'avoidant' | 'disorganized' | 'secure';
    let description: string;

    if (anxiousScore >= 5 && avoidantScore >= 5) {
      style = 'disorganized';
      description = 'You experience both high anxiety and avoidance in relationships - wanting closeness but fearing it. This often stems from inconsistent early relationships.';
    } else if (anxiousScore >= 5) {
      style = 'anxious';
      description = 'You tend to worry about relationships and seek high levels of closeness and reassurance. You may fear abandonment and need frequent validation.';
    } else if (avoidantScore >= 5) {
      style = 'avoidant';
      description = 'You value independence and may feel uncomfortable with too much emotional closeness. You prefer to handle emotions on your own.';
    } else {
      style = 'secure';
      description = 'You generally feel comfortable with intimacy and independence in relationships. You can express emotions openly and handle conflict well.';
    }

    setAttachmentStyle({ style, description });
    setShowResults(true);
  };

  const handleComplete = () => {
    onNext({
      ...responses,
      attachmentStyle: attachmentStyle?.style,
      attachmentDescription: attachmentStyle?.description
    });
  };

  const currentQ = QUESTIONS[currentQuestion];
  const hasResponse = responses[currentQ.id] !== undefined;
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  if (showResults && attachmentStyle) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Your Attachment Style</h3>
          <p className="text-gray-400">This helps us customize your healing experience</p>
        </div>

        <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-700">
          <CardHeader>
            <CardTitle className="text-center">
              <Badge className="text-lg px-4 py-2 bg-purple-600">
                {attachmentStyle.style.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-center leading-relaxed">
              {attachmentStyle.description}
            </p>
          </CardContent>
        </Card>

        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <h4 className="text-white font-semibold mb-3">How This Helps Your Healing</h4>
          <div className="space-y-2 text-gray-400">
            {attachmentStyle.style === 'anxious' && (
              <>
                <p>• Rituals focused on building self-soothing and independence</p>
                <p>• Tools for managing relationship anxiety and fear</p>
                <p>• Community support for validation and reassurance</p>
              </>
            )}
            {attachmentStyle.style === 'avoidant' && (
              <>
                <p>• Gentle exercises for emotional expression and vulnerability</p>
                <p>• Rituals that honor your need for space while encouraging connection</p>
                <p>• Tools for recognizing and expressing emotions safely</p>
              </>
            )}
            {attachmentStyle.style === 'disorganized' && (
              <>
                <p>• Stabilizing rituals to manage emotional chaos</p>
                <p>• Tools for both closeness fears and abandonment anxiety</p>
                <p>• Structured approach to build secure relationship patterns</p>
              </>
            )}
            {attachmentStyle.style === 'secure' && (
              <>
                <p>• Rituals to maintain your emotional stability during crisis</p>
                <p>• Tools to help others and share your strengths</p>
                <p>• Advanced techniques for deep healing and growth</p>
              </>
            )}
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={handleComplete}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3"
          >
            {isLoading ? 'Saving...' : 'Continue to Next Assessment'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-white">Attachment Style Assessment</h3>
        <p className="text-gray-400">
          Question {currentQuestion + 1} of {QUESTIONS.length}
        </p>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8">
          <h4 className="text-lg text-white mb-6 leading-relaxed">
            {currentQ.text}
          </h4>

          {currentQ.type === 'scale' && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-400">
                <span>{currentQ.scaleLabels?.[0]}</span>
                <span>{currentQ.scaleLabels?.[1]}</span>
              </div>
              <div className="flex justify-between gap-2">
                {Array.from({ length: 7 }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => handleResponse(currentQ.id, num)}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${
                      responses[currentQ.id] === num
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-400'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentQ.type === 'choice' && (
            <div className="space-y-3">
              {currentQ.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleResponse(currentQ.id, option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    responses[currentQ.id] === option
                      ? 'bg-purple-900/30 border-purple-500 text-white'
                      : 'border-gray-600 text-gray-300 hover:border-purple-500'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPrevious}
          disabled={currentQuestion === 0}
          className="border-gray-700 hover:bg-gray-800"
        >
          Previous
        </Button>

        <Button
          onClick={goToNext}
          disabled={!hasResponse}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {currentQuestion === QUESTIONS.length - 1 ? 'Calculate Results' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
}
