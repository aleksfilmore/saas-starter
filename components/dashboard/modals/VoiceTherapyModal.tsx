"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Phone, PhoneOff, Clock, DollarSign, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onClose: () => void;
  isPremium: boolean;
}

export function VoiceTherapyModal({ onClose, isPremium }: Props) {
  const [purchasing, setPurchasing] = useState(false);
  const [hasCredits, setHasCredits] = useState(false);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Check if user has voice therapy credits
  useEffect(() => {
    if (isPremium) {
      checkVoiceCredits();
    }
  }, [isPremium]);

  const checkVoiceCredits = async () => {
    try {
      const response = await fetch('/api/voice-therapy/credits');
      if (response.ok) {
        const data = await response.json();
        setHasCredits(data.hasCredits);
        setRemainingMinutes(data.remainingMinutes || 0);
      }
    } catch (error) {
      console.error('Failed to check voice credits:', error);
    }
  };

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      // Redirect to Stripe checkout for Voice AI Therapy
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: 'prod_SqXAeMTdI69iSQ',
          priceId: 'price_1Ruq6ZQsKtdjWreVgNFduSHE',
          mode: 'payment', // One-time payment
          successUrl: `${window.location.origin}/dashboard?voice_therapy=success`,
          cancelUrl: `${window.location.origin}/dashboard?voice_therapy=cancelled`,
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        toast.error(error);
        return;
      }

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to initiate purchase. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleStartSession = async () => {
    setIsConnecting(true);
    
    try {
      // Start voice therapy session
      const response = await fetch('/api/voice-therapy/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        toast.error('Failed to start session');
        return;
      }

      // Simulate connection process
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
        
        // Start session timer
        const timer = setInterval(() => {
          setSessionDuration(prev => {
            const newDuration = prev + 1;
            const remainingSeconds = remainingMinutes * 60 - newDuration;
            
            // Warning when 90 seconds left
            if (remainingSeconds === 90) {
              toast.warning('90 seconds remaining in your session');
            }
            
            // End session when time expires
            if (remainingSeconds <= 0) {
              handleEndSession();
              return prev;
            }
            
            return newDuration;
          });
        }, 1000);

        // Store timer to clear later
        (window as any).voiceTimer = timer;
      }, 3000);
    } catch (error) {
      console.error('Session start error:', error);
      toast.error('Failed to start session');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleEndSession = async () => {
    if ((window as any).voiceTimer) {
      clearInterval((window as any).voiceTimer);
    }

    try {
      // End the session and update credits
      await fetch('/api/voice-therapy/end', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          duration: sessionDuration,
        }),
      });

      const usedMinutes = Math.ceil(sessionDuration / 60);
      toast.success(`Session ended. Used ${usedMinutes} minutes.`);
      
    } catch (error) {
      console.error('Session end error:', error);
    }

    setIsConnected(false);
    setSessionDuration(0);
    onClose();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatRemainingTime = () => {
    const remainingSeconds = remainingMinutes * 60 - sessionDuration;
    return formatDuration(Math.max(0, remainingSeconds));
  };

  if (!isPremium) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Mic className="h-5 w-5 text-indigo-400" />
              <span>Voice AI Therapy</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-yellow-600/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Premium Feature</h3>
              <p className="text-slate-300 text-sm">
                Voice AI Therapy is available for Firewall subscribers only.
              </p>
            </div>
            <Button
              onClick={onClose}
              className="w-full bg-slate-600 hover:bg-slate-700"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mic className="h-5 w-5 text-indigo-400" />
            <span>Voice AI Therapy</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          
          {!hasCredits && !isConnected && !isConnecting && (
            <>
              {/* Purchase Voice Therapy Credits */}
              <div className="text-center p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-lg border border-indigo-500/30">
                <Mic className="h-16 w-16 mx-auto mb-4 text-indigo-400" />
                <h3 className="text-2xl font-bold text-white mb-2">Voice AI Therapy</h3>
                <p className="text-indigo-200 mb-4">
                  Real-time voice conversation with AI therapeutic support
                </p>
                
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">15</div>
                    <div className="text-xs text-indigo-300">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">3</div>
                    <div className="text-xs text-indigo-300">AI Personas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">$9.99</div>
                    <div className="text-xs text-indigo-300">One-time</div>
                  </div>
                </div>

                <Button 
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 font-semibold"
                >
                  {purchasing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Purchase Voice Therapy
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-2 text-sm text-slate-400">
                <p>• 15 minutes of AI voice therapy</p>
                <p>• Memory preserved for 30 days</p>
                <p>• Choose from 3 specialized personas</p>
                <p>• Real-time therapeutic conversation</p>
              </div>
            </>
          )}

          {hasCredits && !isConnected && !isConnecting && (
            <>
              {/* Ready to Start Session */}
              <Card className="bg-gradient-to-r from-green-900/30 to-indigo-900/30 border-green-500/30">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <Mic className="h-12 w-12 mx-auto text-green-400" />
                    <div>
                      <div className="text-lg font-medium text-white">Ready to Start</div>
                      <div className="text-sm text-green-300">
                        {remainingMinutes} minutes available
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Credits Available
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleStartSession}
                className="w-full bg-gradient-to-r from-green-600 to-indigo-600 hover:from-green-700 hover:to-indigo-700 py-3"
              >
                <Phone className="h-4 w-4 mr-2" />
                Start Voice Session
              </Button>
            </>
          )}

          {isConnecting && (
            <Card className="bg-indigo-900/30 border-indigo-500/30">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-indigo-600 rounded-full flex items-center justify-center">
                    <Mic className="h-8 w-8 text-white animate-pulse" />
                  </div>
                  <div>
                    <div className="text-lg font-medium text-white">Connecting...</div>
                    <div className="text-sm text-indigo-300">Setting up your therapy session</div>
                  </div>
                  <div className="flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isConnected && (
            <>
              {/* Active Session */}
              <Card className={`border-green-500/30 ${
                remainingMinutes * 60 - sessionDuration <= 90 
                  ? 'bg-orange-900/30 border-orange-500/30' 
                  : 'bg-green-900/30'
              }`}>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                      remainingMinutes * 60 - sessionDuration <= 90 
                        ? 'bg-orange-600' 
                        : 'bg-green-600'
                    }`}>
                      {isMuted ? (
                        <MicOff className="h-10 w-10 text-white" />
                      ) : (
                        <Mic className="h-10 w-10 text-white animate-pulse" />
                      )}
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold text-white">{formatRemainingTime()}</div>
                      <div className={`text-sm ${
                        remainingMinutes * 60 - sessionDuration <= 90 
                          ? 'text-orange-300' 
                          : 'text-green-300'
                      }`}>
                        {remainingMinutes * 60 - sessionDuration <= 90 ? 'Time running out!' : 'Time remaining'}
                      </div>
                    </div>

                    <div className="text-xs text-slate-400">
                      Session: {formatDuration(sessionDuration)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Session Controls */}
              <div className="flex space-x-3">
                <Button
                  onClick={() => setIsMuted(!isMuted)}
                  variant="outline"
                  className="flex-1 border-slate-600"
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                
                <Button
                  onClick={handleEndSession}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <PhoneOff className="h-4 w-4 mr-2" />
                  End Session
                </Button>
              </div>
            </>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-slate-400 text-center">
            This is AI support, not professional therapy. For crisis situations, please contact emergency services.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
