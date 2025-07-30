'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface AvatarStepProps {
  onNext: (data: any) => void;
  isLoading: boolean;
}

export function AvatarStep({ onNext, isLoading }: AvatarStepProps) {
  const [selectedAvatar, setSelectedAvatar] = useState('');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Choose Your Avatar</h3>
        <p className="text-gray-400">Your visual representation in the REFORMAT community</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        {['🤖', '👻', '🔥', '❄️', '⚡', '🌙', '💀', '🦋', '🐺', '🦅'].map((avatar, index) => (
          <button
            key={index}
            onClick={() => setSelectedAvatar(avatar)}
            className={`p-6 text-4xl rounded-lg border-2 transition-all ${
              selectedAvatar === avatar
                ? 'border-cyan-500 bg-cyan-900/30'
                : 'border-gray-700 hover:border-cyan-500'
            }`}
          >
            {avatar}
          </button>
        ))}
      </div>

      <div className="text-center">
        <Button
          onClick={() => onNext({ selectedAvatar })}
          disabled={!selectedAvatar || isLoading}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          {isLoading ? 'Saving...' : 'Confirm Avatar'}
        </Button>
      </div>
    </div>
  );
}
