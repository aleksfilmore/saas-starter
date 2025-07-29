// File: app/(dashboard)/general/page.tsx

'use client';

import { User, Mail, Shield, AlertTriangle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function GeneralPage() {
  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: 'url(/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Floating background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-glitch-pink rounded-full animate-float opacity-40"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-float opacity-60" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-purple-400 rounded-full animate-float opacity-30" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative z-10 py-8 px-6">
        <h1 className="text-3xl font-black text-white mb-8" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900', WebkitTextStroke: '1px #ec4899'}}>
          General <span className="text-glitch-pink" style={{textShadow: '0 0 20px rgba(255,20,147,0.8)'}}>Settings</span>
        </h1>
        
        <div className="space-y-8 max-w-4xl">
          {/* Account Information Section */}
          <div className="bg-gray-900/60 backdrop-blur-sm p-8 rounded-2xl border-2 border-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 rounded-2xl"></div>
            <div className="relative z-10">
              <h2 className="text-xl font-black text-white mb-6 flex items-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                <User className="w-6 h-6 mr-3 text-blue-400" />
                Account Information
              </h2>
              
              <div className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="email" className="text-white font-black text-lg" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@domain.com"
                    className="bg-gray-800/80 border-2 border-blue-400/50 text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-glitch-pink focus-visible:border-glitch-pink rounded-xl px-4 py-3 text-lg font-medium transition-all duration-300 hover:border-blue-400"
                    style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="username" className="text-white font-black text-lg" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                    Display Name
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Your warrior name"
                    className="bg-gray-800/80 border-2 border-blue-400/50 text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-glitch-pink focus-visible:border-glitch-pink rounded-xl px-4 py-3 text-lg font-medium transition-all duration-300 hover:border-blue-400"
                    style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                  />
                </div>
                
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300 rounded-xl px-8 py-3 text-lg font-black" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  <Settings className="mr-2 h-5 w-5" />
                  Update Account
                </Button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-gray-900/60 backdrop-blur-sm p-8 rounded-2xl border-2 border-purple-400 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 rounded-2xl"></div>
            <div className="relative z-10">
              <h2 className="text-xl font-black text-white mb-6 flex items-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                <Mail className="w-6 h-6 mr-3 text-purple-400" />
                Notification Preferences
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/60 border border-purple-400/30 rounded-xl">
                  <div>
                    <p className="text-white font-black" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                      Daily Ritual Reminders
                    </p>
                    <p className="text-white/70 text-sm font-medium">Get notified about your daily healing ritual</p>
                  </div>
                  <div className="w-12 h-6 bg-purple-400 rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-all duration-300"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-800/60 border border-purple-400/30 rounded-xl">
                  <div>
                    <p className="text-white font-black" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                      Streak Celebrations
                    </p>
                    <p className="text-white/70 text-sm font-medium">Celebrate your no-contact milestones</p>
                  </div>
                  <div className="w-12 h-6 bg-gray-600 rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone Section */}
          <div className="bg-gray-900/60 backdrop-blur-sm p-8 rounded-2xl border-2 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10 rounded-2xl"></div>
            <div className="relative z-10">
              <h2 className="text-xl font-black text-red-400 mb-6 flex items-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                <AlertTriangle className="w-6 h-6 mr-3 text-red-400" />
                Danger Zone
              </h2>
              
              <div className="bg-red-900/20 border border-red-400/50 rounded-xl p-6">
                <p className="text-white font-medium mb-4" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  Delete your account and all associated data. This action cannot be undone.
                </p>
                <p className="text-red-400 text-sm mb-6 font-bold">
                  ⚠️ This will permanently erase your progress, streaks, and all ritual data.
                </p>
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white font-black rounded-xl px-6 py-3 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.4)] disabled:opacity-50" 
                  disabled
                  style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}
                >
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Delete Account (Coming Soon)
                </Button>
              </div>
            </div>
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
