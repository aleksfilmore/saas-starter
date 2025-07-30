'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DistressAssessmentProps {
  onNext: (data: any) => void;
  isLoading: boolean;
}

const QUESTIONS = [
  'How much have you been feeling sad or empty?',
  'How hopeless have you been feeling about the future?',
  'How much have you been feeling bad about yourself?',
  'How difficult has it been to concentrate?',
  'How tired or low on energy have you been feeling?'
];

const OPTIONS = ['Not at all', 'A little bit', 'Moderately', 'Quite a bit', 'Extremely'];

export function DistressAssessment({ onNext, isLoading }: DistressAssessmentProps) {
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleResponse = (questionIndex: number, value: number) => {
    setResponses(prev => ({ ...prev, [questionIndex]: value }));
  };

  const goToNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const totalScore = Object.values(responses).reduce((sum, score) => sum + score, 0);
      let severity = 'minimal';
      if (totalScore > 15) severity = 'severe';
      else if (totalScore > 10) severity = 'moderate';
      else if (totalScore > 5) severity = 'mild';

      onNext({ responses, totalScore, severity });
    }
  };

  const hasResponse = responses[currentQuestion] !== undefined;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Current State Analysis</h3>
        <p className="text-gray-400">Question {currentQuestion + 1} of {QUESTIONS.length}</p>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8">
          <h4 className="text-lg text-white mb-6">{QUESTIONS[currentQuestion]}</h4>
          <div className="space-y-3">
            {OPTIONS.map((option, index) => (
              <button
                key={index}
                onClick={() => handleResponse(currentQuestion, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  responses[currentQuestion] === index
                    ? 'bg-blue-900/30 border-blue-500 text-white'
                    : 'border-gray-600 text-gray-300 hover:border-blue-500'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          onClick={goToNext}
          disabled={!hasResponse || isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {currentQuestion === QUESTIONS.length - 1 ? 'Complete Assessment' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
}
