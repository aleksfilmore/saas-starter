'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface RitualPreferencesProps {
  onNext: (data: any) => void;
  isLoading: boolean;
}

export function RitualPreferences({ onNext, isLoading }: RitualPreferencesProps) {
  const [preferences, setPreferences] = useState({
    dailyTime: '',
    ritualTypes: [] as string[],
    reminderStyle: ''
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Ritual Preferences</h3>
        <p className="text-gray-400">Customize your daily healing practice</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-white mb-2">Preferred ritual time:</label>
          <select
            value={preferences.dailyTime}
            onChange={(e) => setPreferences(prev => ({ ...prev, dailyTime: e.target.value }))}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
          >
            <option value="">Select time</option>
            <option value="morning">Morning (6-10 AM)</option>
            <option value="afternoon">Afternoon (12-4 PM)</option>
            <option value="evening">Evening (6-10 PM)</option>
          </select>
        </div>
      </div>

      <div className="text-center">
        <Button
          onClick={() => onNext(preferences)}
          disabled={!preferences.dailyTime || isLoading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
}
