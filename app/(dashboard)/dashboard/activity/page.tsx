// File: app/(dashboard)/activity/page.tsx

'use client';

import { Calendar, Zap, Award, Target, Clock, TrendingUp } from 'lucide-react';

export default function ActivityPage() {
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
          Your <span className="text-glitch-pink" style={{textShadow: '0 0 20px rgba(255,20,147,0.8)'}}>Activity Log</span>
        </h1>
        
        <div className="grid gap-6">
          {/* Recent Activity Section */}
          <div className="bg-gray-900/60 backdrop-blur-sm p-8 rounded-2xl border-2 border-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 rounded-2xl"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-black text-white mb-6 flex items-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                <Clock className="w-6 h-6 mr-3 text-blue-400" />
                Recent Activity
              </h2>
              
              <div className="space-y-4">
                {/* Activity Items */}
                <div className="flex items-center p-4 bg-gray-800/60 border border-glitch-pink/30 rounded-xl hover:border-glitch-pink/60 transition-all duration-300">
                  <div className="w-12 h-12 bg-glitch-pink rounded-full flex items-center justify-center mr-4 shadow-[0_0_15px_rgba(255,20,147,0.6)]">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-black" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                      Completed "Pet Perspective" Ritual
                    </p>
                    <p className="text-fuchsia-400 text-sm font-medium">2 hours ago</p>
                  </div>
                  <div className="text-green-400 font-black text-sm">+50 XP</div>
                </div>
                
                <div className="flex items-center p-4 bg-gray-800/60 border border-purple-400/30 rounded-xl hover:border-purple-400/60 transition-all duration-300">
                  <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center mr-4 shadow-[0_0_15px_rgba(168,85,247,0.6)]">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-black" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                      Unlocked "Petty Saint" Badge
                    </p>
                    <p className="text-fuchsia-400 text-sm font-medium">1 day ago</p>
                  </div>
                  <div className="text-purple-400 font-black text-sm">BADGE</div>
                </div>
                
                <div className="flex items-center p-4 bg-gray-800/60 border border-blue-400/30 rounded-xl hover:border-blue-400/60 transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center mr-4 shadow-[0_0_15px_rgba(59,130,246,0.6)]">
                    <Target className="h-6 w-6 text-gray-900" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-black" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                      17-Day No Contact Streak
                    </p>
                    <p className="text-fuchsia-400 text-sm font-medium">Ongoing</p>
                  </div>
                  <div className="text-blue-400 font-black text-sm">STREAK</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-2xl border-2 border-glitch-pink shadow-[0_0_30px_rgba(255,20,147,0.3)]">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-8 h-8 text-glitch-pink mr-3" />
                <h3 className="text-lg font-black text-white" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  Total XP
                </h3>
              </div>
              <p className="text-3xl font-black text-glitch-pink" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                1,250
              </p>
            </div>
            
            <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-2xl border-2 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              <div className="flex items-center mb-4">
                <Award className="w-8 h-8 text-purple-400 mr-3" />
                <h3 className="text-lg font-black text-white" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  Badges Earned
                </h3>
              </div>
              <p className="text-3xl font-black text-purple-400" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                7
              </p>
            </div>
            
            <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-2xl border-2 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <div className="flex items-center mb-4">
                <Calendar className="w-8 h-8 text-blue-400 mr-3" />
                <h3 className="text-lg font-black text-white" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  Rituals Completed
                </h3>
              </div>
              <p className="text-3xl font-black text-blue-400" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                23
              </p>
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
