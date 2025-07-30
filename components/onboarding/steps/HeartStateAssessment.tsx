'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Clock, AlertTriangle } from 'lucide-react';

interface HeartStateAssessmentProps {
  onNext: (data: any) => void;
  isLoading: boolean;
}

const HEART_STATE_QUESTIONS = [
  {
    id: 'relationship_status',
    text: 'What best describes your current situation?',
    type: 'choice' as const,
    options: [
      'Just ended a relationship (0-2 weeks ago)',
      'Recent breakup (2-8 weeks ago)', 
      'Processing a breakup (2-6 months ago)',
      'Long-term healing (6+ months ago)',
      'Complicated/on-and-off situation',
      'Unrequited love/never together'
    ]
  },
  {
    id: 'breakup_initiator',
    text: 'Who initiated the end of the relationship?',
    type: 'choice' as const,
    options: [
      'They broke up with me',
      'I broke up with them',
      'It was mutual',
      'It\'s complicated/unclear',
      'They ghosted/disappeared',
      'Not applicable (unrequited love)'
    ]
  },
  {
    id: 'relationship_duration',
    text: 'How long were you together (or hoping to be together)?',
    type: 'choice' as const,
    options: [
      'Less than 3 months',
      '3-6 months',
      '6 months - 1 year',
      '1-2 years',
      '2-5 years',
      '5+ years',
      'We were never officially together'
    ]
  },
  {
    id: 'current_contact',
    text: 'What\'s your current contact situation?',
    type: 'choice' as const,
    options: [
      'No contact at all',
      'Minimal/necessary contact only',
      'Occasional friendly contact',
      'Regular communication',
      'Still intimate/confusing boundaries',
      'They\'re trying to contact me',
      'I\'m struggling not to contact them'
    ]
  },
  {
    id: 'emotional_state',
    text: 'Which emotions are you experiencing most right now? (Select all that apply)',
    type: 'multiselect' as const,
    options: [
      'Sadness and grief',
      'Anger and rage',
      'Anxiety and panic',
      'Numbness and emptiness',
      'Guilt and regret',
      'Relief and freedom',
      'Confusion and uncertainty',
      'Obsessive thoughts',
      'Physical pain/heartache',
      'Hope for reconciliation'
    ]
  },
  {
    id: 'biggest_struggle',
    text: 'What\'s your biggest challenge right now?',
    type: 'choice' as const,
    options: [
      'Stopping myself from contacting them',
      'Getting them out of my head',
      'Dealing with seeing them/social media',
      'Sleeping and basic self-care',
      'Feeling like I\'ll never love again',
      'Understanding what went wrong',
      'Forgiving them or myself',
      'Moving forward with my life',
      'Handling mutual friends/shared spaces',
      'Trusting my own judgment again'
    ]
  }
];

export function HeartStateAssessment({ onNext, isLoading }: HeartStateAssessmentProps) {
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [heartState, setHeartState] = useState<{
    phase: string;
    urgency: 'immediate' | 'high' | 'moderate' | 'stable';
    focus: string;
    description: string;
  } | null>(null);

  const handleResponse = (questionId: string, value: string | string[]) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const goToNext = () => {
    if (currentQuestion < HEART_STATE_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateHeartState();
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateHeartState = () => {
    const relationshipStatus = responses.relationship_status as string;
    const initiator = responses.breakup_initiator as string;
    const biggestStruggle = responses.biggest_struggle as string;
    const emotions = responses.emotional_state as string[] || [];

    let phase = '';
    let urgency: 'immediate' | 'high' | 'moderate' | 'stable' = 'moderate';
    let focus = '';
    let description = '';

    // Determine phase based on timeline and situation
    if (relationshipStatus?.includes('Just ended') || relationshipStatus?.includes('0-2 weeks')) {
      phase = 'ACUTE_CRISIS';
      urgency = 'immediate';
      focus = 'stabilization';
      description = 'You\'re in the immediate aftermath. Focus on basic stability and self-care.';
    } else if (relationshipStatus?.includes('Recent breakup') || relationshipStatus?.includes('2-8 weeks')) {
      phase = 'EARLY_PROCESSING';
      urgency = 'high';
      focus = 'understanding';
      description = 'The initial shock is wearing off. Time to start processing what happened.';
    } else if (relationshipStatus?.includes('Processing') || relationshipStatus?.includes('2-6 months')) {
      phase = 'ACTIVE_HEALING';
      urgency = 'moderate';
      focus = 'rebuilding';
      description = 'You\'re in the work phase. Building new patterns and healing old wounds.';
    } else if (relationshipStatus?.includes('Long-term') || relationshipStatus?.includes('6+ months')) {
      phase = 'INTEGRATION';
      urgency = 'stable';
      focus = 'growth';
      description = 'You\'re integrating lessons and preparing for new connections.';
    } else if (relationshipStatus?.includes('Complicated') || relationshipStatus?.includes('on-and-off')) {
      phase = 'CHAOS_MODE';
      urgency = 'high';
      focus = 'boundaries';
      description = 'The situation is chaotic. Priority is establishing clear boundaries.';
    } else if (relationshipStatus?.includes('Unrequited')) {
      phase = 'FANTASY_DETOX';
      urgency = 'moderate';
      focus = 'reality_check';
      description = 'Time to separate fantasy from reality and redirect that love energy.';
    }

    // Adjust urgency based on other factors
    if (biggestStruggle?.includes('contacting them') || biggestStruggle?.includes('out of my head')) {
      urgency = urgency === 'stable' ? 'moderate' : 'high';
    }

    if (emotions.includes('Obsessive thoughts') || emotions.includes('Physical pain/heartache')) {
      urgency = urgency === 'stable' ? 'moderate' : 'high';
    }

    setHeartState({ phase, urgency, focus, description });
    setShowResults(true);
  };

  const handleComplete = () => {
    onNext({
      ...responses,
      heartState: heartState?.phase,
      urgencyLevel: heartState?.urgency,
      primaryFocus: heartState?.focus,
      stateDescription: heartState?.description
    });
  };

  const currentQ = HEART_STATE_QUESTIONS[currentQuestion];
  const hasResponse = responses[currentQ.id] !== undefined;
  const progress = ((currentQuestion + 1) / HEART_STATE_QUESTIONS.length) * 100;

  if (showResults && heartState) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Your Current State of Heart</h3>
          <p className="text-gray-400">This helps us customize your healing journey</p>
        </div>

        <Card className="bg-gradient-to-br from-pink-900/20 to-red-900/20 border-pink-700">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Heart className="h-6 w-6 text-pink-400" />
              <Badge className={`text-lg px-4 py-2 ${
                heartState.urgency === 'immediate' ? 'bg-red-600' :
                heartState.urgency === 'high' ? 'bg-orange-600' :
                heartState.urgency === 'moderate' ? 'bg-yellow-600' :
                'bg-green-600'
              }`}>
                {heartState.phase}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 text-center leading-relaxed">
              {heartState.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={`h-5 w-5 ${
                    heartState.urgency === 'immediate' ? 'text-red-400' :
                    heartState.urgency === 'high' ? 'text-orange-400' :
                    heartState.urgency === 'moderate' ? 'text-yellow-400' :
                    'text-green-400'
                  }`} />
                  <span className="font-semibold text-white">Support Level</span>
                </div>
                <p className="text-gray-300 capitalize">{heartState.urgency} Priority</p>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <span className="font-semibold text-white">Primary Focus</span>
                </div>
                <p className="text-gray-300 capitalize">{heartState.focus.replace('_', ' ')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <h4 className="text-white font-semibold mb-3">How This Customizes Your Experience</h4>
          <div className="space-y-2 text-gray-400">
            {heartState.phase === 'ACUTE_CRISIS' && (
              <>
                <p>• Daily check-ins and crisis support resources</p>
                <p>• Gentle stabilization rituals focused on basics</p>
                <p>• Emergency contact protocols and safety planning</p>
                <p>• Simplified interface to reduce overwhelm</p>
              </>
            )}
            {heartState.phase === 'EARLY_PROCESSING' && (
              <>
                <p>• Processing-focused rituals and journaling prompts</p>
                <p>• Education about breakup psychology and healing stages</p>
                <p>• No-contact support tools and motivation</p>
                <p>• Emotion regulation techniques and coping strategies</p>
              </>
            )}
            {heartState.phase === 'ACTIVE_HEALING' && (
              <>
                <p>• Structured healing rituals and personal growth exercises</p>
                <p>• Self-esteem building and identity reconstruction work</p>
                <p>• Advanced AI tools for deeper therapeutic exploration</p>
                <p>• Community engagement and peer support features</p>
              </>
            )}
            {heartState.phase === 'INTEGRATION' && (
              <>
                <p>• Growth-oriented rituals and future visioning exercises</p>
                <p>• Relationship readiness assessments and dating prep</p>
                <p>• Advanced personal development and goal setting</p>
                <p>• Mentorship opportunities to help others heal</p>
              </>
            )}
            {heartState.phase === 'CHAOS_MODE' && (
              <>
                <p>• Boundary-setting tools and communication scripts</p>
                <p>• Decision-making frameworks for complex situations</p>
                <p>• Intensive support for breaking toxic patterns</p>
                <p>• Crisis intervention when situations escalate</p>
              </>
            )}
            {heartState.phase === 'FANTASY_DETOX' && (
              <>
                <p>• Reality-testing exercises and perspective tools</p>
                <p>• Self-love rituals and internal validation practices</p>
                <p>• Redirection techniques for obsessive thoughts</p>
                <p>• Building genuine connections and real relationships</p>
              </>
            )}
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={handleComplete}
            disabled={isLoading}
            className="bg-pink-600 hover:bg-pink-700 px-8 py-3"
          >
            {isLoading ? 'Saving...' : 'Continue Assessment'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-white">State of Heart Assessment</h3>
        <p className="text-gray-400">
          Question {currentQuestion + 1} of {HEART_STATE_QUESTIONS.length}
        </p>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full transition-all duration-300"
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

          {currentQ.type === 'choice' && (
            <div className="space-y-3">
              {currentQ.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleResponse(currentQ.id, option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    responses[currentQ.id] === option
                      ? 'bg-pink-900/30 border-pink-500 text-white'
                      : 'border-gray-600 text-gray-300 hover:border-pink-500'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentQ.type === 'multiselect' && (
            <div className="space-y-3">
              {currentQ.options?.map((option, index) => {
                const selectedOptions = (responses[currentQ.id] as string[]) || [];
                const isSelected = selectedOptions.includes(option);
                
                return (
                  <button
                    key={index}
                    onClick={() => {
                      const current = selectedOptions;
                      const updated = isSelected 
                        ? current.filter(item => item !== option)
                        : [...current, option];
                      handleResponse(currentQ.id, updated);
                    }}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'bg-pink-900/30 border-pink-500 text-white'
                        : 'border-gray-600 text-gray-300 hover:border-pink-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        isSelected ? 'bg-pink-500 border-pink-500' : 'border-gray-500'
                      }`}>
                        {isSelected && <span className="text-white text-xs">✓</span>}
                      </div>
                      {option}
                    </div>
                  </button>
                );
              })}
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
          className="bg-pink-600 hover:bg-pink-700"
        >
          {currentQuestion === HEART_STATE_QUESTIONS.length - 1 ? 'Analyze Heart State' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
}
