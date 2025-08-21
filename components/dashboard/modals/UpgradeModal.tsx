"use client";
import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface UpgradeModalProps {
  onClose: () => void;
}

export function UpgradeModal({ onClose }: UpgradeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-gray-900/90 border border-purple-500/30 rounded-xl shadow-2xl p-6 animate-in fade-in zoom-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="h-5 w-5 text-pink-400" />
          <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Upgrade to Firewall Mode</h2>
        </div>
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-white">$9.99<span className="text-sm text-gray-400">/month</span></div>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed mb-4">
          Unlock advanced healing features, unlimited AI therapy, and personalized daily rituals. Cancel anytime.
        </p>
        <ul className="space-y-2 text-sm text-gray-200 mb-6">
          <li className="flex items-start space-x-2"><span className="text-pink-400">•</span><span>2 Personalized daily healing rituals</span></li>
          <li className="flex items-start space-x-2"><span className="text-pink-400">•</span><span>Unlimited AI therapy chat</span></li>
          <li className="flex items-start space-x-2"><span className="text-pink-400">•</span><span>Post on Wall of Wounds</span></li>
          <li className="flex items-start space-x-2"><span className="text-pink-400">•</span><span>Advanced progress tracking</span></li>
          <li className="flex items-start space-x-2"><span className="text-pink-400">•</span><span>Exclusive badges & features</span></li>
          <li className="flex items-start space-x-2"><span className="text-pink-400">•</span><span>Priority customer support</span></li>
        </ul>
        <div className="space-y-3">
          <button
            className="w-full py-2.5 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium hover:from-purple-500 hover:to-pink-500 transition disabled:opacity-50"
            onClick={async () => {
              try {
                const res = await fetch('/api/stripe/checkout', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ tier: 'firewall' })
                });
                const data = await res.json();
                
                if (res.ok && data.url) {
                  window.location.href = data.url;
                } else if (data.checkoutUrl) {
                  window.location.href = data.checkoutUrl;
                } else {
                  console.error('Checkout creation failed:', data);
                  alert('Failed to start checkout. Please try again.');
                }
              } catch (e) {
                console.error('Upgrade error:', e);
                alert('An error occurred. Please try again.');
              }
            }}
          >
            Upgrade Now
          </button>
          <button onClick={onClose} className="w-full py-2.5 rounded-md border border-gray-600 text-gray-300 text-xs hover:bg-gray-800 transition">
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
