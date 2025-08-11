/**
 * Choose Plan Page - Post-Quiz Onboarding Step
 * CTRL+ALT+BLOCK™ Specification Section 4
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Crown, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QuizResult {
  attachmentStyle: string;
  archetypeCode: string;
  recommendedPersona: string;
  traits: string[];
  healingPath: string[];
  cbtCue: string;
  focusBullets: string[];
  completedAt: string;
}

const planFeatures = {
  free: [
    '1 daily ritual from free pool',
    'Basic no-contact tracker (24h shield)',
    'Wall of Wounds: read + react only',
    'AI chat: 5 free messages/day',
    'Basic progress tracking',
    'General daily guidance'
  ],
  paid: [
    '2 personalized daily rituals + reroll',
    'Enhanced no-contact tracker (48h + auto-shield)',
    'Wall of Wounds: read + react + post',
    'Unlimited AI chat with personas',
    'Advanced pattern analysis & insights',
    'Archetype-specific daily guidance',
    'Bytes redemption & advanced gamification'
  ]
};

export default function ChoosePlanPage() {
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'ghost' | 'firewall'>('firewall');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const result = localStorage.getItem('quizResult');
    if (!result) {
      router.push('/quiz');
      return;
    }
    setQuizResult(JSON.parse(result));
  }, [router]);

  const handlePlanSelection = async (tier: 'ghost' | 'firewall') => {
    setLoading(true);
    
    try {
      if (tier === 'firewall') {
        // Redirect to Stripe checkout for paid plan
        const response = await fetch('/api/stripe/checkout/subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            tier: 'firewall',
            archetypeCode: quizResult?.archetypeCode,
            recommendedPersona: quizResult?.recommendedPersona
          })
        });
        
        const { checkoutUrl } = await response.json();
        window.location.href = checkoutUrl;
      } else {
        // Set free tier and go to dashboard
        const response = await fetch('/api/onboarding/plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            tier: 'ghost',
            quizResult
          })
        });
        
        if (response.ok) {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('Plan selection error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!quizResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <header className="w-full border-b border-gray-600/30 bg-gray-800/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CTRL+ALT+BLOCK™</span>
            </div>
            <Badge className="bg-purple-900/20 text-purple-400 border-purple-500/30">
              Step 2 of 2
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Your Archetype: <span className="text-purple-400">{quizResult.attachmentStyle}</span>
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            {quizResult.cbtCue}
          </p>
          <div className="flex justify-center">
            <Badge className="bg-purple-900/20 text-purple-400 border-purple-500/30 px-4 py-2">
              Recommended Persona: {quizResult.recommendedPersona}
            </Badge>
          </div>
        </motion.div>

        {/* Plan Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan - Ghost Mode */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className={`relative h-full border-2 transition-all cursor-pointer ${
              selectedPlan === 'ghost' 
                ? 'border-gray-400 bg-gray-800/60' 
                : 'border-gray-600/30 bg-gray-900/50 hover:border-gray-500/50'
            }`}
            onClick={() => setSelectedPlan('ghost')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-gray-300" />
                </div>
                <CardTitle className="text-2xl text-white">Ghost Mode</CardTitle>
                <div className="text-3xl font-bold text-gray-300">Free</div>
                <p className="text-gray-400">Start your healing journey</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {planFeatures.free.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
                <div className="pt-4">
                  <Button 
                    className={`w-full ${
                      selectedPlan === 'ghost'
                        ? 'bg-gray-600 hover:bg-gray-700'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => handlePlanSelection('ghost')}
                    disabled={loading}
                  >
                    {loading && selectedPlan === 'ghost' ? 'Setting up...' : 'Start Free'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Paid Plan - Firewall Mode */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className={`relative h-full border-2 transition-all cursor-pointer ${
              selectedPlan === 'firewall' 
                ? 'border-purple-400 bg-purple-900/20' 
                : 'border-purple-500/30 bg-gray-900/50 hover:border-purple-400/50'
            }`}
            onClick={() => setSelectedPlan('firewall')}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1">
                  RECOMMENDED
                </Badge>
              </div>
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">Firewall Mode</CardTitle>
                <div className="text-3xl font-bold text-purple-400">$9.99<span className="text-lg text-gray-400">/mo</span></div>
                <p className="text-gray-400">Full platform access</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {planFeatures.paid.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
                <div className="pt-4">
                  <Button 
                    className={`w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white ${
                      selectedPlan === 'firewall' ? 'ring-2 ring-purple-400' : ''
                    }`}
                    onClick={() => handlePlanSelection('firewall')}
                    disabled={loading}
                  >
                    {loading && selectedPlan === 'firewall' ? (
                      'Redirecting to checkout...'
                    ) : (
                      <>
                        Upgrade to Firewall <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Fine Print */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-400 text-sm space-y-2"
        >
          <p>* Fair Usage Policy: 500 messages/day, 3000/month with burst protection</p>
          <p>You can upgrade or downgrade your plan anytime from settings</p>
          <p>All plans include crisis support and breathing exercises</p>
        </motion.div>
      </div>
    </div>
  );
}
