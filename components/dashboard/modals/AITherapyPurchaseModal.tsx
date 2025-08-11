"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Check, Clock, MessageSquare, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AITherapyPurchaseModalProps {
  open: boolean;
  onClose: () => void;
}

export function AITherapyPurchaseModal({ open, onClose }: AITherapyPurchaseModalProps) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      // Redirect to Stripe checkout for AI Therapy package
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: 'prod_SqZGFSnY89vAzw',
          priceId: 'price_1Rus8CQsKtdjWreVbDdU4dM8',
          mode: 'payment', // One-time payment
          successUrl: `${window.location.origin}/dashboard?ai_therapy=success`,
          cancelUrl: `${window.location.origin}/dashboard?ai_therapy=cancelled`,
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
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Brain className="h-6 w-6 text-indigo-400" />
            AI Therapy Chat Package
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Package Details */}
          <div className="text-center p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-lg border border-indigo-500/30">
            <Brain className="h-16 w-16 mx-auto mb-4 text-indigo-400" />
            <h3 className="text-2xl font-bold text-white mb-2">AI Therapy Chat Access</h3>
            <p className="text-indigo-200 mb-4">
              Get personalized therapeutic support whenever you need it
            </p>
            
            <div className="text-4xl font-bold text-white mb-2">$3.99</div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              One-time purchase
            </Badge>
          </div>

          {/* What's Included */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white">What's included:</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span>300 AI therapy messages</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span>Access to 3 specialized AI personas</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span>Personalized therapeutic conversations</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span>30-day validity period</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span>Available 24/7</span>
              </div>
            </div>
          </div>

          {/* AI Personas Preview */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white">Choose your AI companion:</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-600/30">
                <span className="text-2xl block mb-1">🌟</span>
                <div className="text-xs text-slate-300">Supportive Guide</div>
              </div>
              <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-600/30">
                <span className="text-2xl block mb-1">🧠</span>
                <div className="text-xs text-slate-300">Strategic Analyst</div>
              </div>
              <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-600/30">
                <span className="text-2xl block mb-1">💝</span>
                <div className="text-xs text-slate-300">Emotional Healer</div>
              </div>
            </div>
          </div>

          {/* Purchase Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600 text-slate-300"
              disabled={loading}
            >
              Maybe Later
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Purchase Now
                </>
              )}
            </Button>
          </div>

          {/* Terms */}
          <p className="text-xs text-slate-500 text-center">
            Messages expire 30 days after purchase. No refunds available.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
