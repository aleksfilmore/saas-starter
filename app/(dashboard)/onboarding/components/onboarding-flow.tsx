'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  User, 
  RefreshCw, 
  Shield, 
  Zap, 
  ArrowRight, 
  Check,
  UserX,
  Users,
  Eye,
  Ghost
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OnboardingFlowProps {
  userId: string;
}

const CODENAME_ADJECTIVES = [
  'Silent', 'Shadow', 'Crimson', 'Void', 'Broken', 'Lost', 'Fading', 'Hidden',
  'Wandering', 'Fallen', 'Shattered', 'Hollow', 'Drifting', 'Forgotten',
  'Whispered', 'Scarred', 'Distant', 'Veiled', 'Burning', 'Frozen'
];

const CODENAME_NOUNS = [
  'Wolf', 'Raven', 'Phoenix', 'Serpent', 'Tiger', 'Eagle', 'Spider', 'Panther',
  'Falcon', 'Viper', 'Hawk', 'Bear', 'Lion', 'Owl', 'Shark', 'Cobra',
  'Dragon', 'Fox', 'Lynx', 'Jaguar'
];

const AVATAR_OPTIONS = [
  { id: 'mask', icon: Users, name: 'Masked Figure', description: 'Hidden behind a digital mask' },
  { id: 'ghost', icon: Ghost, name: 'Phantom', description: 'Ethereal and untouchable' },
  { id: 'shadow', icon: UserX, name: 'Shadow', description: 'A silhouette in the darkness' },
  { id: 'void', icon: Eye, name: 'The Void', description: 'Staring into the abyss' },
];

export function OnboardingFlow({ userId }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [codename, setCodename] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const generateCodename = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const adjective = CODENAME_ADJECTIVES[Math.floor(Math.random() * CODENAME_ADJECTIVES.length)];
      const noun = CODENAME_NOUNS[Math.floor(Math.random() * CODENAME_NOUNS.length)];
      const number = Math.floor(Math.random() * 999) + 1;
      setCodename(`${adjective}${noun}${number}`);
      setIsGenerating(false);
    }, 500);
  };

  const handleCompleteOnboarding = async () => {
    if (!codename || !selectedAvatar) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codename,
          avatar: selectedAvatar,
          subscriptionTier: 'anonymous',
        }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        throw new Error('Failed to complete onboarding');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 1) {
    return (
      <Card className="bg-black/50 border-red-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <User className="h-5 w-5 text-red-500" />
            Generate Your Codename
          </CardTitle>
          <CardDescription className="text-gray-300">
            Your identity in the protocol must remain anonymous. Generate a unique codename that will represent you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="codename" className="text-white">Your Anonymous Codename</Label>
            <div className="flex gap-2">
              <Input
                id="codename"
                value={codename}
                onChange={(e) => setCodename(e.target.value)}
                placeholder="Enter custom codename or generate one"
                className="bg-gray-900 border-gray-700 text-white"
              />
              <Button
                onClick={generateCodename}
                disabled={isGenerating}
                variant="outline"
                className="border-red-700 text-red-400 hover:bg-red-900/20"
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
              </Button>
            </div>
            {codename && (
              <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
                <p className="text-red-400 text-sm font-medium">
                  Codename Preview: <span className="text-white">{codename}</span>
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  This will be your identity in the protocol. Choose carefully.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button
              onClick={() => setStep(2)}
              disabled={!codename}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Continue to Avatar Selection
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 2) {
    return (
      <Card className="bg-black/50 border-red-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-5 w-5 text-red-500" />
            Select Your Avatar
          </CardTitle>
          <CardDescription className="text-gray-300">
            Choose a visual representation that maintains your anonymity while reflecting your essence.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={selectedAvatar} onValueChange={setSelectedAvatar}>
            <div className="grid grid-cols-1 gap-4">
              {AVATAR_OPTIONS.map((avatar) => (
                <div key={avatar.id} className="relative">
                  <RadioGroupItem
                    value={avatar.id}
                    id={avatar.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={avatar.id}
                    className="flex items-center gap-4 p-4 border border-gray-700 rounded-lg cursor-pointer hover:border-red-600 peer-checked:border-red-500 peer-checked:bg-red-900/20 transition-all"
                  >
                    <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center">
                      <avatar.icon className="h-6 w-6 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{avatar.name}</h3>
                      <p className="text-gray-400 text-sm">{avatar.description}</p>
                    </div>
                    {selectedAvatar === avatar.id && (
                      <Check className="h-5 w-5 text-red-500" />
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          <div className="space-y-3 pt-4">
            <Button
              onClick={() => setStep(3)}
              disabled={!selectedAvatar}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Review Configuration
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Back to Codename
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 3) {
    const selectedAvatarData = AVATAR_OPTIONS.find(a => a.id === selectedAvatar);
    
    return (
      <Card className="bg-black/50 border-red-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Check className="h-5 w-5 text-green-500" />
            Protocol Identity Confirmation
          </CardTitle>
          <CardDescription className="text-gray-300">
            Review your anonymous identity before entering the protocol.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <h3 className="text-white font-medium mb-2">Identity Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Codename:</span>
                  <span className="text-red-400 font-mono">{codename}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avatar:</span>
                  <span className="text-white">{selectedAvatarData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Protocol Tier:</span>
                  <span className="text-blue-400">Anonymous</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Initial XP:</span>
                  <span className="text-green-400">0 Points</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <h4 className="text-red-400 font-medium mb-2">Protocol Guidelines</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Your identity remains completely anonymous</li>
                <li>• Complete healing rituals to earn XP and advance</li>
                <li>• Share your journey on the Wall of Wounds (optional)</li>
                <li>• Maintain the faceless protocol at all times</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <Button
              onClick={handleCompleteOnboarding}
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Initializing Protocol...
                </>
              ) : (
                <>
                  Enter the Protocol
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
            <Button
              onClick={() => setStep(2)}
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
              disabled={isSubmitting}
            >
              Modify Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
