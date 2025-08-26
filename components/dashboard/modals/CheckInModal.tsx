"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Heart, CheckCircle, MessageCircle } from 'lucide-react';
import { trackEvent } from '@/lib/analytics/client';
import { AnalyticsEvents } from '@/lib/analytics/events';

interface Props {
  onClose: () => void;
  onComplete: (data: { mood: number; gratitude: string; challenge: string; intention: string }) => void;
}

const moodEmojis = ['😢', '😔', '😐', '🙂', '😊', '😄', '🥰', '✨', '🌟', '🚀'];
const moodLabels = ['Struggling', 'Low', 'Meh', 'Okay', 'Good', 'Great', 'Amazing', 'Fantastic', 'Incredible', 'Unstoppable'];

export function CheckInModal({ onClose, onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [mood, setMood] = useState(5); // Changed from array to number
  const [gratitude, setGratitude] = useState('');
  const [challenge, setChallenge] = useState('');
  const [intention, setIntention] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    {
      title: "How are you feeling?",
      component: (
        <div className="space-y-6 text-center">
          <div className="text-6xl mb-4">
            {moodEmojis[mood - 1]}
          </div>
          <h3 className="text-xl text-white font-medium">
            {moodLabels[mood - 1]}
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {moodEmojis.map((emoji, index) => (
              <Button
                key={index}
                variant={mood === index + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setMood(index + 1)}
                className={mood === index + 1 ? "bg-purple-600" : "border-gray-600"}
              >
                {emoji}
              </Button>
            ))}
          </div>
          <div className="flex justify-between text-gray-400 text-sm">
            <span>😢 Struggling</span>
            <span>🚀 Unstoppable</span>
          </div>
        </div>
      )
    },
    {
      title: "What's one thing you're grateful for today?",
      component: (
        <div className="space-y-4">
          <Textarea
            placeholder="It could be something big or small, meaningful or simple..."
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
            className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 resize-none"
            rows={4}
          />
          <p className="text-gray-400 text-sm">
            Gratitude helps rewire your brain for positivity, even on tough days.
          </p>
        </div>
      )
    },
    {
      title: "What's challenging you right now?",
      component: (
        <div className="space-y-4">
          <Textarea
            placeholder="Name it to tame it. What's weighing on your mind?"
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 resize-none"
            rows={4}
          />
          <p className="text-gray-400 text-sm">
            Acknowledging challenges reduces their emotional power over you.
          </p>
        </div>
      )
    },
    {
      title: "What's one intention for today?",
      component: (
        <div className="space-y-4">
          <Textarea
            placeholder="How do you want to show up for yourself today?"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 resize-none"
            rows={4}
          />
          <p className="text-gray-400 text-sm">
            Setting intentions creates direction and purpose in your healing journey.
          </p>
        </div>
      )
    }
  ];

  // Fire started + first step viewed on mount
  useEffect(() => {
    trackEvent(AnalyticsEvents.CHECKIN_STARTED, {});
    trackEvent(AnalyticsEvents.CHECKIN_STEP_VIEWED, { step: 0, name: steps[0].title });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const advanceStep = () => {
    if (currentStep < steps.length - 1) {
      // Mark completion of step
      trackEvent(AnalyticsEvents.CHECKIN_STEP_COMPLETED, { step: currentStep, name: steps[currentStep].title });
      const next = currentStep + 1;
      setCurrentStep(next);
      trackEvent(AnalyticsEvents.CHECKIN_STEP_VIEWED, { step: next, name: steps[next].title });
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
  // Mark final step complete before overall completion
  trackEvent(AnalyticsEvents.CHECKIN_STEP_COMPLETED, { step: currentStep, name: steps[currentStep].title });
      onComplete({ mood, gratitude, challenge, intention });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true; // Mood is always set
      case 1: return gratitude.trim().length > 0;
      case 2: return challenge.trim().length > 0;
      case 3: return intention.trim().length > 0;
      default: return false;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-400" />
            <span>Daily Check-In</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress */}
          <div className="flex items-center space-x-2">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`flex-1 h-2 rounded-full ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-red-400 to-pink-500' 
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Current Step */}
          <Card className="bg-gray-700/50 border-gray-600">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium text-white mb-4">
                {steps[currentStep].title}
              </h3>
              {steps[currentStep].component}
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
              Back
            </Button>

            <Button
              onClick={advanceStep}
              disabled={!canProceed() || isSubmitting}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : currentStep === steps.length - 1 ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Check-In
                </>
              ) : (
                'Next'
              )}
            </Button>
          </div>

          {/* Encouragement */}
          <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-red-400 text-sm">
              <MessageCircle className="h-4 w-4" />
              <span>Your feelings are valid and your healing matters.</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
