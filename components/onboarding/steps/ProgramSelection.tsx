'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgramSelectionProps {
  onNext: (data: any) => void;
  isLoading: boolean;
}

export function ProgramSelection({ onNext, isLoading }: ProgramSelectionProps) {
  const [selectedProgram, setSelectedProgram] = useState('');

  const programs = [
    {
      id: '30-day',
      name: '30-Day Sprint',
      description: 'Intensive 30-day program for rapid initial healing',
      features: ['Daily rituals', 'Weekly check-ins', 'Basic AI tools', 'Community access']
    },
    {
      id: '90-day',
      name: '90-Day Deep Dive',
      description: 'Comprehensive 90-day journey for lasting transformation',
      features: ['Progressive rituals', 'Bi-weekly coaching', 'Full AI toolkit', 'Premium community']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Choose Your Protocol</h3>
        <p className="text-gray-400">Select your healing timeline and commitment level</p>
      </div>

      <div className="grid gap-6">
        {programs.map((program) => (
          <Card
            key={program.id}
            className={`cursor-pointer transition-all ${
              selectedProgram === program.id
                ? 'bg-green-900/30 border-green-500'
                : 'bg-gray-800 border-gray-700 hover:border-green-500'
            }`}
            onClick={() => setSelectedProgram(program.id)}
          >
            <CardHeader>
              <CardTitle className="text-white">{program.name}</CardTitle>
              <p className="text-gray-400">{program.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {program.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-300">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button
          onClick={() => onNext({ selectedProgram })}
          disabled={!selectedProgram || isLoading}
          className="bg-green-600 hover:bg-green-700"
        >
          {isLoading ? 'Saving...' : 'Select Program'}
        </Button>
      </div>
    </div>
  );
}
