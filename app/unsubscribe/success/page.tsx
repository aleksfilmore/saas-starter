"use client";

import { CheckCircle, Settings, Shield } from 'lucide-react';
import Link from 'next/link';

export default function UnsubscribeSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-accent relative overflow-hidden">
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="brand-container w-full max-w-md">
          
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="brand-logo-large mb-4">
              CTRL+ALT+BLOCK
            </div>
            <p className="brand-tagline">GLITCH-CORE HEALING PROTOCOL</p>
          </div>

          {/* Success Card */}
          <div className="card-brand text-center">
            <div className="mb-6">
              <div className="relative inline-block mb-4">
                <CheckCircle className="h-16 w-16 text-neon-green mx-auto" />
                <div className="absolute inset-0 bg-neon-green opacity-20 rounded-full blur-lg"></div>
              </div>
              
              <h1 className="text-2xl font-bold text-neon-green mb-2 glitch-effect">
                PROTOCOL DEACTIVATED
              </h1>
              <p className="text-gray-300">
                Email notifications have been successfully disabled from your healing matrix.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <p className="text-sm text-gray-300">
                  <Shield className="h-4 w-4 inline mr-2 text-purple-400" />
                  Your progress continues. You can reactivate notifications anytime in your neural interface.
                </p>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Link href="/dashboard">
                  <button className="btn-brand-primary w-full">
                    🚀 RETURN TO DASHBOARD
                  </button>
                </Link>
                
                <Link href="/settings">
                  <button className="btn-brand-secondary w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    NEURAL INTERFACE SETTINGS
                  </button>
                </Link>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-purple-500/20">
              <p className="text-xs text-gray-500">
                <span className="text-neon-green">●</span> Your digital healing journey continues with or without email protocols.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                We respect your data sovereignty and inbox autonomy.
              </p>
            </div>
          </div>

          {/* Crisis Support Notice */}
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
            <p className="text-sm text-red-300">
              <strong>🆘 Emergency Protocol:</strong> Crisis support remains always active.
            </p>
            <Link 
              href="/crisis-support" 
              className="text-neon-green hover:text-white underline text-sm"
            >
              Access 24/7 Crisis Resources →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
