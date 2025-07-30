'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Zap, Coins, Users } from 'lucide-react';

interface CompletionStepProps {
  onNext: (data: any) => void;
  isLoading: boolean;
}

export function CompletionStep({ onNext, isLoading }: CompletionStepProps) {
  return (
    <div className="space-y-8 text-center">
      <div className="space-y-4">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center">
          <Check className="h-12 w-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
          PROTOCOL INITIALIZED
        </h2>
        <p className="text-xl text-gray-300">
          Welcome to your personalized healing journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-2">100 XP Earned</h3>
          <p className="text-gray-400 text-sm">For completing onboarding</p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <Coins className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-2">100 Bytes Awarded</h3>
          <p className="text-gray-400 text-sm">Welcome bonus for AI tools</p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <Users className="h-8 w-8 text-blue-400 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-2">Community Access</h3>
          <p className="text-gray-400 text-sm">Wall of Wounds unlocked</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg">
        <h3 className="text-white font-semibold mb-3">What's Next?</h3>
        <div className="space-y-2 text-gray-300">
          <p>• Complete your first daily ritual to start earning XP</p>
          <p>• Share your story on the Wall of Wounds for community support</p>
          <p>• Try AI tools to explore different healing techniques</p>
          <p>• Build your no-contact streak for bonus rewards</p>
        </div>
      </div>

      <Button
        onClick={() => onNext({ completed: true })}
        disabled={isLoading}
        className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 px-8 py-3 text-lg"
      >
        {isLoading ? 'Finalizing...' : 'Enter REFORMAT PROTOCOL™'}
      </Button>
    </div>
  );
}
