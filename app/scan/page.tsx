'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    weight: 'anxious' | 'avoidant' | 'secure' | 'disorganized';
  }[];
}

const questions: Question[] = [
  {
    id: '1',
    text: "When left on read, you...",
    options: [
      { id: '1a', text: "Immediately assume the worst", weight: 'anxious' },
      { id: '1b', text: "Feel relieved - no pressure to respond", weight: 'avoidant' },
      { id: '1c', text: "Give them space, they'll reply when ready", weight: 'secure' },
      { id: '1d', text: "Feel confused and react unpredictably", weight: 'disorganized' }
    ]
  },
  {
    id: '2', 
    text: "In arguments with your ex, you typically...",
    options: [
      { id: '2a', text: "Chase them for resolution immediately", weight: 'anxious' },
      { id: '2b', text: "Shut down and go silent", weight: 'avoidant' },
      { id: '2c', text: "Take time to cool off, then discuss calmly", weight: 'secure' },
      { id: '2d', text: "Swing between clingy and cold", weight: 'disorganized' }
    ]
  },
  {
    id: '3',
    text: "When someone gets close to you, you...",
    options: [
      { id: '3a', text: "Want constant reassurance they won't leave", weight: 'anxious' },
      { id: '3b', text: "Start finding flaws and reasons to distance", weight: 'avoidant' },
      { id: '3c', text: "Enjoy the connection while maintaining independence", weight: 'secure' },
      { id: '3d', text: "Want closeness but fear it simultaneously", weight: 'disorganized' }
    ]
  },
  {
    id: '4',
    text: "Your ideal relationship dynamic is...",
    options: [
      { id: '4a', text: "Constant communication and togetherness", weight: 'anxious' },
      { id: '4b', text: "Parallel lives with minimal emotional demands", weight: 'avoidant' },
      { id: '4c', text: "Balance of together time and personal space", weight: 'secure' },
      { id: '4d', text: "Intense connection with dramatic breaks", weight: 'disorganized' }
    ]
  },
  {
    id: '5',
    text: "When your ex posts on social media, you...",
    options: [
      { id: '5a', text: "Analyze every detail for hidden messages", weight: 'anxious' },
      { id: '5b', text: "Feel nothing - they're dead to you", weight: 'avoidant' },
      { id: '5c', text: "Notice but don't read into it", weight: 'secure' },
      { id: '5d', text: "Obsess then force yourself to look away", weight: 'disorganized' }
    ]
  },
  {
    id: '6',
    text: "Your friends say you...",
    options: [
      { id: '6a', text: "Need too much validation in relationships", weight: 'anxious' },
      { id: '6b', text: "Keep people at arm's length", weight: 'avoidant' },
      { id: '6c', text: "Have healthy, balanced relationships", weight: 'secure' },
      { id: '6d', text: "Have dramatic, unpredictable relationships", weight: 'disorganized' }
    ]
  },
  {
    id: '7',
    text: "When thinking about your ex, you mostly feel...",
    options: [
      { id: '7a', text: "Longing and hope they'll come back", weight: 'anxious' },
      { id: '7b', text: "Relief and freedom", weight: 'avoidant' },
      { id: '7c', text: "Grateful for the good times, at peace with the end", weight: 'secure' },
      { id: '7d', text: "A confusing mix of love and hate", weight: 'disorganized' }
    ]
  },
  {
    id: '8',
    text: "Your biggest fear in relationships is...",
    options: [
      { id: '8a', text: "Being abandoned or rejected", weight: 'anxious' },
      { id: '8b', text: "Losing your independence", weight: 'avoidant' },
      { id: '8c', text: "Not finding mutual compatibility", weight: 'secure' },
      { id: '8d', text: "Being hurt again", weight: 'disorganized' }
    ]
  }
];

export default function ScanPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Load saved answers from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('scan_answers');
    if (saved) {
      const parsedAnswers = JSON.parse(saved);
      setAnswers(parsedAnswers);
      
      // Set selected answer if exists for current question
      const currentQuestionId = questions[currentQuestion].id;
      if (parsedAnswers[currentQuestionId]) {
        setSelectedAnswer(parsedAnswers[currentQuestionId]);
      }
    }
  }, [currentQuestion]);

  // Save answers to localStorage
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('scan_answers', JSON.stringify(answers));
    }
  }, [answers]);

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }));
  };

  const handleNext = async () => {
    if (!selectedAnswer) return;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer('');
    } else {
      // Quiz complete - calculate archetype and redirect
      setIsLoading(true);
      
      try {
        // Store final answers temporarily
        await fetch('/api/scan/temp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers })
        });
        
        // Redirect to signup gate
        router.push('/signup?from=scan');
      } catch (error) {
        console.error('Failed to save scan results:', error);
        // Continue anyway
        router.push('/signup?from=scan');
      }
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer('');
    }
  };

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            System Scan
          </CardTitle>
          <Progress value={progress} className="mt-4" />
          <p className="text-sm text-gray-600 mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {question.text}
            </h3>
          </div>
          
          <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
            <div className="space-y-3">
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer text-gray-700">
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          
          <div className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentQuestion === 0}
            >
              Back
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={!selectedAnswer || isLoading}
              className="min-w-[100px]"
            >
              {isLoading ? 'Analyzing...' : currentQuestion === questions.length - 1 ? 'Complete Scan' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
