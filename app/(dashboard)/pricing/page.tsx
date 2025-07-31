// File: app/(dashboard)/pricing/page.tsx

'use client';

import { Check, X, Ghost, Shield, Brain, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// A placeholder for the checkout action until Stripe is fully configured.
const placeholderCheckoutAction = async (formData: FormData) => {
  const priceId = formData.get('priceId');
  alert(`Checkout initiated for price ID: ${priceId}`);
};

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-blue-400 rounded-full animate-pulse opacity-30"></div>
      </div>
      
      <div className="relative z-10 py-12 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Reformat Protocol</span>
          </h1>
          <p className="mt-4 text-lg text-purple-300 font-medium max-w-2xl mx-auto">
            From lurking in the shadows to full emotional rebirth—pick your healing tier.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Ghost Mode - Free */}
          <Card className="bg-gray-900/60 border-2 border-gray-600 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-500 to-gray-400"></div>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-gray-700/50 rounded-full w-fit">
                <Ghost className="h-8 w-8 text-gray-400" />
              </div>
              <CardTitle className="text-2xl font-black text-gray-300">
                💀 GHOST MODE
              </CardTitle>
              <div className="text-4xl font-black text-white mb-2">FREE</div>
              <p className="text-gray-400 text-sm">You're lurking. That's okay.</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">7-Day Starter Ritual</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">No-Contact Tracker (Basic Streaks)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Read-Only Access to Wall of Wounds</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Glitch Drops (Limited Bytes + XP)</span>
                </div>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm italic">
                  "You're watching from the shadows. We get it. But healing starts when you log in with intention."
                </p>
              </div>
              
              <Button 
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3"
              >
                Start Lurking
              </Button>
            </CardContent>
          </Card>

          {/* Firewall Mode - $9 */}
          <Card className="bg-gray-900/60 border-2 border-orange-500 relative overflow-hidden transform scale-105">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1">
              MOST POPULAR
            </Badge>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-orange-500/20 rounded-full w-fit">
                <Shield className="h-8 w-8 text-orange-400" />
              </div>
              <CardTitle className="text-2xl font-black text-orange-400">
                🔥 FIREWALL MODE
              </CardTitle>
              <div className="text-4xl font-black text-white mb-2">$9</div>
              <p className="text-orange-300 text-sm">One-Time for 30 Days</p>
              <p className="text-gray-400 text-sm">You're done spiraling. Time to reprogram.</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Full 30-Day Reformat Protocol</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Daily Rituals + Progress Dashboard</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">AI Therapy Sessions (1 per week)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Full Access to Wall of Wounds</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Byte & XP System Unlocked</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Earn Badges, Track Glow-Up</span>
                </div>
              </div>
              
              <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-500/50">
                <p className="text-orange-300 text-sm italic">
                  "You're not just healing. You're debugging your soul."
                </p>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3"
              >
                Activate Firewall
              </Button>
            </CardContent>
          </Card>

          {/* Deep Reset Protocol - $29 */}
          <Card className="bg-gray-900/60 border-2 border-purple-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-purple-500/20 rounded-full w-fit">
                <Brain className="h-8 w-8 text-purple-400" />
              </div>
              <CardTitle className="text-2xl font-black text-purple-400">
                🧠 DEEP RESET PROTOCOL
              </CardTitle>
              <div className="text-4xl font-black text-white mb-2">$29</div>
              <p className="text-purple-300 text-sm">One-Time for 90 Days</p>
              <p className="text-gray-400 text-sm">You survived. Now you evolve.</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Full 90-Day Deep Reset Journey</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">30-Day Protocol + 60 Days Advanced</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Bonus AI Therapy Sessions</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Secret Rituals & Cult Challenges</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Byte Shop + Exclusive Rewards</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Cult Leaderboard + Hidden Rooms</span>
                </div>
              </div>
              
              <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/50">
                <p className="text-purple-300 text-sm italic">
                  "This isn't recovery. This is rebirth—coded in blood, salt, and petty glory."
                </p>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3"
              >
                Initiate Deep Reset
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Build Your Ritual Bank?
          </h3>
          <p className="text-gray-300 mb-8">
            We're building your twisted sacred vault of petty prayers, poetic glitches, and emotional hacks. 
            Choose your tier and start the systematic healing process.
          </p>
          <div className="flex items-center justify-center gap-2 text-purple-400">
            <Zap className="h-5 w-5" />
            <span>All plans include instant access to the Glow-Up Console</span>
          </div>
        </div>
      </div>
      
      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
          100% { transform: translateY(0px) rotate(360deg); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
