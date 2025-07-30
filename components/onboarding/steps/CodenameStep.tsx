'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shuffle, Check } from 'lucide-react';

interface CodenameStepProps {
  onNext: (data: any) => void;
  isLoading: boolean;
}

export function CodenameStep({ onNext, isLoading }: CodenameStepProps) {
  const [codenameOptions, setCodenameOptions] = useState<string[]>([]);
  const [selectedCodename, setSelectedCodename] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate initial codename options
  useEffect(() => {
    generateNewOptions();
  }, []);

  const generateNewOptions = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/onboarding/generate-codenames');
      if (response.ok) {
        const data = await response.json();
        setCodenameOptions(data.codenames);
      }
    } catch (error) {
      console.error('Failed to generate codenames:', error);
      // Fallback to client-side generation
      setCodenameOptions(generateFallbackCodenames());
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackCodenames = (): string[] => {
    const prefixes = ['BYTE', 'GHOST', 'VOID', 'NEON', 'CYBER'];
    const suffixes = ['404', 'SCAR', 'GLOW', 'NULL', 'RISE'];
    const options = [];
    
    for (let i = 0; i < 5; i++) {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      options.push(`${prefix}_${suffix}`);
    }
    
    return options;
  };

  const handleNext = () => {
    if (selectedCodename) {
      onNext({ selectedCodename });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Choose Your Digital Identity</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Your codename is how you'll be known in the REFORMAT community. It protects your privacy 
          while giving you a fresh identity for your healing journey.
        </p>
      </div>

      {/* Codename Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Available Codenames</h3>
          <Button
            variant="outline"
            onClick={generateNewOptions}
            disabled={isGenerating}
            className="border-gray-700 hover:bg-gray-800"
          >
            <Shuffle className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate New'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {codenameOptions.map((codename, index) => (
            <Card
              key={index}
              className={`cursor-pointer transition-all hover:scale-105 ${
                selectedCodename === codename
                  ? 'bg-cyan-900/50 border-cyan-500 ring-2 ring-cyan-500/50'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => setSelectedCodename(codename)}
            >
              <CardContent className="p-6 text-center">
                <div className="text-xl font-mono text-cyan-400 mb-2">
                  {codename}
                </div>
                {selectedCodename === codename && (
                  <div className="flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-400" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Codename Info */}
      <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <h4 className="text-white font-semibold mb-3">About Your Codename</h4>
        <div className="space-y-2 text-gray-400">
          <p>• Combines tech/digital elements with emotional recovery themes</p>
          <p>• Completely anonymous - no connection to your real identity</p>
          <p>• Used for all community interactions and achievements</p>
          <p>• Can be changed later in your profile settings</p>
        </div>
      </div>

      {/* Preview */}
      {selectedCodename && (
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700">
          <h4 className="text-white font-semibold mb-3">Preview</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                {selectedCodename.charAt(0)}
              </div>
              <div>
                <div className="text-cyan-400 font-mono">{selectedCodename}</div>
                <div className="text-xs text-gray-500">Level 1 Agent • Just joined</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              This is how you'll appear to other community members.
            </p>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="text-center">
        <Button
          onClick={handleNext}
          disabled={!selectedCodename || isLoading}
          className="bg-cyan-600 hover:bg-cyan-700 px-8 py-3"
        >
          {isLoading ? 'Saving...' : 'Confirm Codename'}
        </Button>
        {!selectedCodename && (
          <p className="text-gray-500 text-sm mt-2">
            Select a codename to continue
          </p>
        )}
      </div>
    </div>
  );
}
