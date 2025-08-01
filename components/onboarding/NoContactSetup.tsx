'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Shield, CheckCircle, Info } from 'lucide-react';

interface NoContactSetupProps {
  onComplete: (noContactData: {
    startedBefore: boolean;
    originalDate?: string;
    platformStartDate: string;
  }) => void;
}

export default function NoContactSetup({ onComplete }: NoContactSetupProps) {
  const [startedBefore, setStartedBefore] = useState<boolean | null>(null);
  const [originalDate, setOriginalDate] = useState('');
  const [showDateInput, setShowDateInput] = useState(false);

  const handleStartedBefore = (before: boolean) => {
    setStartedBefore(before);
    setShowDateInput(before);
  };

  const handleComplete = () => {
    const today = new Date().toISOString().split('T')[0];
    
    onComplete({
      startedBefore: !!startedBefore,
      originalDate: startedBefore ? originalDate : undefined,
      platformStartDate: today
    });
  };

  const isValid = startedBefore !== null && (!startedBefore || (startedBefore && originalDate));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="bg-white border-2 border-blue-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="text-blue-600 mx-auto mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl text-gray-800">
            No-Contact Tracking Setup
          </CardTitle>
          <p className="text-gray-600">
            Let's configure your no-contact journey tracking
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">How This Works</h4>
                <p className="text-sm text-blue-700">
                  Everyone starts at Day 1 on our platform, regardless of previous no-contact time. 
                  This ensures fair community comparison and gamification. Your original start date 
                  will be preserved in your profile for personal reference.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold text-gray-800">
              Were you already in no-contact before joining this platform?
            </Label>
            
            <div className="space-y-3">
              <Button
                variant={startedBefore === false ? "default" : "outline"}
                className={`w-full justify-start text-left h-auto p-4 ${
                  startedBefore === false 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleStartedBefore(false)}
              >
                <div className="space-y-1">
                  <div className="font-medium">No, I'm starting fresh</div>
                  <div className="text-sm opacity-75">
                    This platform will mark the beginning of my no-contact journey
                  </div>
                </div>
              </Button>

              <Button
                variant={startedBefore === true ? "default" : "outline"}
                className={`w-full justify-start text-left h-auto p-4 ${
                  startedBefore === true 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleStartedBefore(true)}
              >
                <div className="space-y-1">
                  <div className="font-medium">Yes, I was already in no-contact</div>
                  <div className="text-sm opacity-75">
                    I'll provide my original start date for my profile
                  </div>
                </div>
              </Button>
            </div>

            {showDateInput && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                <Label htmlFor="originalDate" className="text-sm font-medium text-gray-700">
                  When did you originally start no-contact?
                </Label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <Input
                    id="originalDate"
                    type="date"
                    value={originalDate}
                    onChange={(e) => setOriginalDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  This date will appear in your profile as "In no-contact since [date]" 
                  but your platform streak starts fresh at Day 1.
                </p>
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
              <div className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Platform Journey</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Your healing journey on this platform starts today at Day 1. This ensures 
                fair achievements, streaks, and community comparison for all users.
              </p>
            </div>

            <Button
              onClick={handleComplete}
              disabled={!isValid}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              size="lg"
            >
              Complete Setup & Start Journey
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
