"use client"

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, AlertTriangle, Flame } from "lucide-react";

interface NoContactCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStreak: number;
  onCheckinComplete: () => void;
  refetchUser?: () => Promise<void>;
}

export function NoContactCheckinModal({ 
  isOpen, 
  onClose, 
  currentStreak, 
  onCheckinComplete,
  refetchUser
}: NoContactCheckinModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheckin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/no-contact/checkin', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
        setIsComplete(true);
        // Refresh user context if available
        if (refetchUser) {
          await refetchUser();
        }
        onCheckinComplete();
      } else {
        throw new Error(data.error || 'Check-in failed');
      }
    } catch (error) {
      console.error('Check-in error:', error);
      alert('Failed to complete check-in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogSlip = () => {
    // TODO: Integrate with existing slip logging functionality
    onClose();
    window.location.href = '/no-contact?action=log-slip';
  };

  const handleComplete = () => {
    setIsComplete(false);
    setResult(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white text-center">
            {isComplete ? '✨ Check-In Complete!' : `🛡️ Day ${currentStreak + 1}`}
          </DialogTitle>
        </DialogHeader>

        {!isComplete ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Did you stay ghost-free in the last 24 hours?
              </h3>
              <p className="text-gray-400 text-sm">
                No contact, no stalking, no social media creeping
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Current Streak</span>
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="font-bold text-orange-400">{currentStreak} days</span>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                Keep it going to unlock rewards and shields!
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleCheckin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Confirming...
                  </div>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Yes - Keep Streak Going!
                  </>
                )}
              </Button>

              <Button 
                onClick={handleLogSlip}
                variant="outline"
                className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                No - I Need to Log a Slip
              </Button>
            </div>

            <div className="text-center">
              <button 
                onClick={onClose}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                I'll check in later
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 py-4">
            <div className="text-6xl mb-4">🎉</div>
            <div>
              <h3 className="text-xl font-bold text-green-400 mb-2">
                Streak Secured!
              </h3>
              <p className="text-gray-300 mb-4">
                Day {result?.newStreakDays} completed
              </p>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex justify-center space-x-4 mb-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                  +{result?.xpEarned} XP
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                  +{result?.bytesEarned} Bytes
                </Badge>
              </div>
              <p className="text-green-300 text-sm">
                Daily check-in reward earned!
              </p>
            </div>

            <div className="text-xs text-gray-400">
              Next check-in available in 24 hours
            </div>

            <Button 
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
            >
              Continue Healing Journey
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
