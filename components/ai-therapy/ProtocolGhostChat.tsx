"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ProtocolGhostChat() {
  const [isOpen, setIsOpen] = useState(false);

  const startChat = () => {
    setIsOpen(true);
  };

  return (
    <div>
      {!isOpen ? (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={startChat}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
          >
            <span className="text-2xl">👻</span>
          </Button>
        </div>
      ) : (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="w-96 h-96 bg-gray-900 border border-green-500 rounded-lg p-4">
            <h3 className="text-green-400 font-bold mb-2">Protocol Ghost</h3>
            <p className="text-white text-sm">Chat functionality coming soon...</p>
            <Button 
              onClick={() => setIsOpen(false)}
              className="mt-4 bg-red-500 hover:bg-red-600"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}