"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Phone, PhoneOff, CreditCard, Clock, DollarSign } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export function VoiceTherapyModal({ onClose }: Props) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false); // In real app, check user payment methods

  const pricePerMinute = 0.66; // $9.99 / 15 minutes
  const estimatedCost = Math.ceil(duration / 60) * pricePerMinute;

  const handleStartSession = async () => {
    if (!hasPaymentMethod) {
      // Redirect to payment setup or show payment modal
      alert('Please add a payment method first');
      return;
    }

    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      
      // Start duration timer
      const timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      // Store timer to clear later
      (window as any).voiceTimer = timer;
    }, 3000);
  };

  const handleEndSession = () => {
    if ((window as any).voiceTimer) {
      clearInterval((window as any).voiceTimer);
    }
    setIsConnected(false);
    setDuration(0);
    
    // In real app, process payment and save session data
    alert(`Session ended. Duration: ${Math.ceil(duration / 60)} minutes. Cost: $${estimatedCost.toFixed(2)}`);
    onClose();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mic className="h-5 w-5 text-indigo-400" />
            <span>Voice AI Therapy</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          
          {!isConnected && !isConnecting && (
            <>
              {/* Pricing Info */}
              <Card className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-indigo-500/30">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <div className="text-3xl font-bold text-white">$9.99</div>
                    <div className="text-sm text-indigo-300">per 15 minutes</div>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/40">
                      Premium Feature
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="font-medium text-white">What you get:</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                    <span>Real-time voice conversation with AI therapist</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                    <span>Personalized responses based on your journey</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                    <span>Session summary and insights</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                    <span>End session anytime - pay only for time used</span>
                  </li>
                </ul>
              </div>

              {/* Payment Method */}
              <Card className="bg-gray-700/50 border-gray-600">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-300">Payment Method</span>
                    </div>
                    {hasPaymentMethod ? (
                      <Badge className="bg-green-500/20 text-green-400">
                        Card ending in 4242
                      </Badge>
                    ) : (
                      <Button size="sm" variant="outline" className="text-xs">
                        Add Card
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Start Session */}
              <Button
                onClick={handleStartSession}
                disabled={!hasPaymentMethod}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 py-3"
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
              <Card className="bg-green-900/30 border-green-500/30">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-green-600 rounded-full flex items-center justify-center">
                      {isMuted ? (
                        <MicOff className="h-10 w-10 text-white" />
                      ) : (
                        <Mic className="h-10 w-10 text-white animate-pulse" />
                      )}
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold text-white">{formatDuration(duration)}</div>
                      <div className="text-sm text-green-300">Session active</div>
                    </div>

                    <div className="flex items-center justify-center space-x-1 text-xs text-gray-400">
                      <DollarSign className="h-3 w-3" />
                      <span>Estimated cost: ${estimatedCost.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Session Controls */}
              <div className="flex space-x-3">
                <Button
                  onClick={() => setIsMuted(!isMuted)}
                  variant="outline"
                  className="flex-1 border-gray-600"
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
          <p className="text-xs text-gray-400 text-center">
            This is AI support, not professional therapy. For crisis situations, please contact emergency services.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
