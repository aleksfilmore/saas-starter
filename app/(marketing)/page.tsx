// File: app/(marketing)/page.tsx

"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Award, ShieldQuestion, Check } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import React from 'react';

// New: A component to create the animated, floating orbs for the background.
const Orb = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <div
    className={`absolute rounded-full bg-gradient-to-t from-glitch-pink/30 to-primary/30 blur-3xl filter animate-float ${className}`}
    style={style}
  />
);

// New: A component to create a glowing effect behind elements.
const Glow = ({ className }: { className?: string }) => (
  <div
    className={`absolute animate-pulse rounded-full bg-gradient-to-r from-glitch-pink/40 to-primary/40 blur-3xl filter ${className}`}
  />
);

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-gray-950 text-foreground">
      {/* Enhanced background effects with grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Glowing background orbs */}
      <div className="absolute top-[20%] left-[5%] w-[25vw] h-[25vw] bg-gradient-to-r from-glitch-cyan/15 to-glitch-pink/8 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[30%] right-[10%] w-[20vw] h-[20vw] bg-gradient-to-r from-glitch-pink/15 to-glitch-cyan/8 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-[60%] left-[20%] w-[15vw] h-[15vw] bg-gradient-to-r from-glitch-lime/10 to-glitch-orange/5 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center text-center pt-20 pb-16 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content overlay */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="text-left lg:text-left relative z-20">
              <div className="mb-6">
                <p className="text-glitch-pink text-lg font-medium mb-2 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">The interactive breakup reprogramming ritual</p>
              </div>
              <h1 className="text-6xl font-black tracking-tight lg:text-7xl leading-tight mb-6 relative">
                <span className="text-white font-black tracking-wider" style={{textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 0 20px rgba(6,182,212,0.3)'}}>CTRL+ALT</span><br />
                <span className="text-glitch-pink font-black tracking-wider relative" style={{textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 0 30px rgba(236,72,153,0.5)'}}>
                  BLOCK
                  {/* Glitch effect lines */}
                  <div className="absolute -top-1 -left-1 text-glitch-cyan opacity-70 -z-10" style={{textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>BLOCK</div>
                  <div className="absolute top-1 left-1 text-glitch-lime opacity-50 -z-10" style={{textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>BLOCK</div>
                </span>
              </h1>
              <p className="text-xl text-glitch-cyan leading-relaxed mb-8 max-w-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Reclaim your <span className="text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">sanity</span> (and your <span className="text-glitch-pink font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">savage</span>) with our AI-powered emotional recovery protocol.
              </p>
              <div className="mb-12">
                <a href="/sign-up">
                  <Button size="lg" className="text-lg rounded-none border-2 border-glitch-pink bg-black/50 backdrop-blur-sm hover:bg-glitch-pink/20 hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] text-glitch-pink font-bold transition-all duration-300 px-12 py-4 uppercase tracking-wider relative overflow-hidden group">
                    <span className="relative z-10 drop-shadow-lg">BEGIN THE RITUAL</span>
                    {/* Button glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-glitch-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </Button>
                </a>
              </div>
            </div>
            
            {/* Right side - Visual element */}
            <div className="relative flex justify-center lg:justify-end z-20">
              <div className="relative">
                {/* Multiple glowing rings */}
                <div className="absolute inset-0 rounded-full border-4 border-glitch-cyan opacity-80 animate-pulse scale-105"></div>
                <div className="absolute inset-0 rounded-full border-2 border-glitch-pink opacity-60 animate-pulse scale-110" style={{animationDelay: '1s'}}></div>
                <div className="absolute inset-0 rounded-full border border-glitch-lime opacity-40 animate-pulse scale-115" style={{animationDelay: '2s'}}></div>
                
                {/* Main figure container with enhanced glow and backdrop */}
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-gray-900/80 via-blue-900/60 to-purple-900/40 backdrop-blur-sm flex items-center justify-center relative overflow-hidden border-2 border-glitch-cyan/50 shadow-[0_0_50px_rgba(6,182,212,0.3)]">
                  
                  {/* Background tech grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
                  
                  {/* Hood silhouette with better shading */}
                  <div className="w-48 h-48 bg-gradient-to-b from-gray-700/90 via-gray-900/95 to-black rounded-t-full relative shadow-2xl">
                    {/* Face shadow with subtle glow */}
                    <div className="absolute inset-x-8 top-12 bottom-8 bg-black rounded-full opacity-95 shadow-[inset_0_0_20px_rgba(6,182,212,0.2)]"></div>
                    
                    {/* Eyes glow effect */}
                    <div className="absolute top-16 left-12 w-2 h-1 bg-glitch-cyan rounded-full opacity-80 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                    <div className="absolute top-16 right-12 w-2 h-1 bg-glitch-cyan rounded-full opacity-80 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" style={{animationDelay: '0.5s'}}></div>
                    
                    {/* Enhanced broken heart with glow */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="relative">
                        {/* Heart pieces with glow */}
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-gradient-to-br from-glitch-pink to-red-500 transform rotate-45 rounded-tl-full rounded-tr-full shadow-[0_0_15px_rgba(236,72,153,0.6)] animate-pulse"></div>
                          <div className="w-7 h-7 bg-gradient-to-br from-glitch-pink to-red-500 transform rotate-45 rounded-tl-full rounded-tr-full shadow-[0_0_15px_rgba(236,72,153,0.6)] animate-pulse" style={{animationDelay: '0.3s'}}></div>
                        </div>
                        {/* Enhanced crack effect */}
                        <div className="absolute top-1/2 left-1/2 w-10 h-1 bg-gradient-to-r from-transparent via-white to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-12 opacity-80"></div>
                        <div className="absolute top-1/2 left-1/2 w-8 h-0.5 bg-black transform -translate-x-1/2 -translate-y-1/2 rotate-12"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced glow effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-glitch-cyan/15 to-transparent rounded-full"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-glitch-pink/10 to-glitch-purple/10 rounded-full"></div>
                  
                  {/* Floating particles around the figure */}
                  <div className="absolute top-8 left-8 w-1 h-1 bg-glitch-cyan rounded-full animate-ping opacity-60 shadow-[0_0_5px_rgba(6,182,212,0.8)]"></div>
                  <div className="absolute top-12 right-12 w-1.5 h-1.5 bg-glitch-pink rounded-full animate-ping opacity-50 shadow-[0_0_5px_rgba(236,72,153,0.8)]" style={{animationDelay: '1s'}}></div>
                  <div className="absolute bottom-16 left-16 w-1 h-1 bg-glitch-lime rounded-full animate-ping opacity-70 shadow-[0_0_5px_rgba(132,204,22,0.8)]" style={{animationDelay: '2s'}}></div>
                  <div className="absolute bottom-12 right-8 w-2 h-2 bg-glitch-orange rounded-full animate-ping opacity-40 shadow-[0_0_5px_rgba(249,115,22,0.8)]" style={{animationDelay: '1.5s'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-20 bg-transparent w-full relative">
        {/* Section divider */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-glitch-cyan to-transparent opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
             <h2 className="text-4xl font-black text-white mb-6 relative">
               Your Arsenal for <span className="text-glitch-pink drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]">Emotional Recovery</span>
               {/* Subtle underline effect */}
               <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-glitch-cyan to-transparent"></div>
             </h2>
             <p className="text-xl text-glitch-cyan max-w-2xl mx-auto leading-relaxed">Tools engineered for <span className="text-glitch-lime font-bold drop-shadow-lg">structured chaos</span> healing.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-2 border-glitch-cyan rounded-lg p-8 text-center group hover:bg-glitch-cyan/5 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-500 relative overflow-hidden">
              {/* Card background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-glitch-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-gradient-to-br from-glitch-cyan/20 to-glitch-cyan/10 flex items-center justify-center border border-glitch-cyan shadow-[0_0_20px_rgba(6,182,212,0.3)] relative z-10">
                <Bot className="h-8 w-8 text-glitch-cyan drop-shadow-lg" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 relative z-10 drop-shadow-lg">AI TOOLS</h3>
              <p className="text-glitch-cyan relative z-10">Choke your breakup to death, <span className="text-white font-semibold">virtually</span>.</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-2 border-glitch-pink rounded-lg p-8 text-center group hover:bg-glitch-pink/5 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all duration-500 relative overflow-hidden">
              {/* Card background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-glitch-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-gradient-to-br from-glitch-pink/20 to-glitch-pink/10 flex items-center justify-center border border-glitch-pink shadow-[0_0_20px_rgba(236,72,153,0.3)] relative z-10">
                <Award className="h-8 w-8 text-glitch-pink drop-shadow-lg" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 relative z-10 drop-shadow-lg">GAMIFIED HEALING</h3>
              <p className="text-glitch-cyan relative z-10">Level up your <span className="text-glitch-pink font-semibold">No Contact</span> streak.</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-2 border-glitch-pink rounded-lg p-8 text-center group hover:bg-glitch-pink/5 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all duration-500 relative overflow-hidden">
              {/* Card background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-glitch-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-gradient-to-br from-glitch-pink/20 to-glitch-pink/10 flex items-center justify-center border border-glitch-pink shadow-[0_0_20px_rgba(236,72,153,0.3)] relative z-10">
                <ShieldQuestion className="h-8 w-8 text-glitch-pink drop-shadow-lg" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 relative z-10 drop-shadow-lg">CONFESSIONAL</h3>
              <p className="text-glitch-cyan relative z-10">Vent on our private <span className="text-white font-semibold">wall of doom</span>.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-24 relative bg-transparent">
        {/* Section divider */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-glitch-pink to-transparent opacity-50"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-6 relative">
              Pick your <span className="text-glitch-cyan drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">protocol</span>.
              {/* Subtle underline effect */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-glitch-pink to-transparent"></div>
            </h2>
            <p className="text-xl text-glitch-cyan max-w-2xl mx-auto leading-relaxed">Start <span className="text-glitch-lime font-bold">free</span>, stay petty, upgrade when you want the full <span className="text-glitch-pink font-bold">spectrum</span>.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
             <PricingCard
              plan="Freemium"
              price="$0"
              description="Take the chaos for a test drive. No credit card."
              features={[
                '7-Day Healing Program Preview',
                'No Contact Day Counter',
                'Limited AI Tool Previews',
                'Read-Only Confessional Wall',
              ]}
              cta="Start for Free"
            />
            <PricingCard
              plan="Basic"
              price="$9"
              priceDetail="/ month"
              description="Full ritual toolkit - value vs. an hour of therapy."
              features={[
                'Everything in Freemium, plus:',
                'Full AI Tool Access',
                '30-Day Basic Reset Program',
                'Post & React on Confessional Wall',
              ]}
              cta="Start the Trial"
              isFeatured
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-l from-pink-900/30 via-purple-900/40 to-cyan-900/30 backdrop-blur-sm w-full relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-glitch-pink to-transparent opacity-60"></div>
        <Orb className="top-20 left-20 opacity-15" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-transparent bg-gradient-to-r from-glitch-cyan via-glitch-pink to-glitch-lime bg-clip-text mb-6">System <span className="text-white">Queries</span></h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">Debugging the most common user <span className="text-glitch-cyan font-bold">exceptions</span></p>
          </div>
          <div className="bg-gradient-to-br from-gray-900/60 via-purple-900/20 to-pink-900/10 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8 shadow-2xl shadow-purple-500/20">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border-b border-purple-500/30">
                <AccordionTrigger className="text-lg font-semibold text-glitch-cyan hover:text-glitch-pink transition-colors">Is this therapy?</AccordionTrigger>
                <AccordionContent className="text-gray-300 text-base leading-relaxed pt-4">No. This is a tool for self-guided emotional processing, not a replacement for professional mental health care. If you are in crisis, please contact a professional.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-b border-purple-500/30">
                <AccordionTrigger className="text-lg font-semibold text-glitch-cyan hover:text-glitch-pink transition-colors">Is my data private?</AccordionTrigger>
                <AccordionContent className="text-gray-300 text-base leading-relaxed pt-4">Yes. Privacy is a core value. Your personal data is yours. Confessional posts are anonymized by default. Read our full privacy policy for details.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-b border-purple-500/30">
                <AccordionTrigger className="text-lg font-semibold text-glitch-cyan hover:text-glitch-pink transition-colors">What if I break my No Contact streak?</AccordionTrigger>
                <AccordionContent className="text-gray-300 text-base leading-relaxed pt-4">It happens. The app is designed to help you get back on track without judgment. You can use a "Streak Shield" or simply restart your counter. This is about progress, not perfection.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 text-center relative bg-gradient-to-br from-purple-900/60 via-pink-900/50 to-orange-900/40 backdrop-blur-sm overflow-hidden">
        {/* Dramatic background effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-glitch-cyan via-glitch-pink to-glitch-orange opacity-80"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-glitch-orange via-glitch-pink to-glitch-cyan opacity-80"></div>
        
        {/* Multiple floating orbs for dramatic effect */}
        <Orb className="top-10 left-10 opacity-20" />
        <Orb className="top-20 right-20 opacity-25" />
        <Orb className="bottom-20 left-20 opacity-15" />
        <Orb className="bottom-10 right-10 opacity-30" />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-glitch-cyan rounded-full animate-float opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-glitch-pink rounded-full animate-float opacity-40" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-glitch-orange rounded-full animate-float opacity-50" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-glitch-lime rounded-full animate-float opacity-70" style={{animationDelay: '0.5s'}}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-12">
            <h2 className="text-6xl font-black text-transparent bg-gradient-to-r from-glitch-orange via-glitch-pink to-glitch-cyan bg-clip-text mb-8 leading-tight">
              Ready for your <span className="text-white">emotional reformat</span>?
            </h2>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
              Stop doomscrolling and start reprogramming.
            </p>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Your <span className="text-glitch-cyan font-bold">future self</span> will thank you.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a href="/sign-up" className="group">
              <Button size="lg" className="text-xl rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-pink-500 hover:via-orange-500 hover:to-red-500 text-white font-black shadow-2xl shadow-pink-500/60 hover:shadow-orange-500/80 transition-all duration-500 px-12 py-6 animate-pulse group-hover:animate-none transform hover:scale-110">
                🚀 Begin the Ritual FREE
                <ArrowRight className="ml-4 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </a>
            
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">No credit card required</p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Join 10,000+ warriors</span>
              </div>
            </div>
          </div>
          
          {/* Final encouragement */}
          <div className="mt-16 p-6 rounded-xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 backdrop-blur-sm">
            <p className="text-lg text-gray-300 italic">
              "The best time to plant a tree was 20 years ago. The second best time is <span className="text-glitch-pink font-bold">now</span>."
            </p>
          </div>
        </div>
      </section>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          100% { transform: translateY(0px) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// New: A reusable component for the feature cards.
const FeatureCard = ({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: 'primary' | 'secondary' | 'accent' }) => {
  const colorClasses = {
    primary: {
      bg: 'bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20',
      border: 'border-orange-500/50 hover:border-orange-400',
      icon: 'bg-gradient-to-br from-orange-500 to-red-500 text-white',
      title: 'text-orange-400',
      glow: 'shadow-orange-500/30 hover:shadow-orange-500/60'
    },
    secondary: {
      bg: 'bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-red-500/20',
      border: 'border-purple-500/50 hover:border-purple-400',
      icon: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white',
      title: 'text-purple-400',
      glow: 'shadow-purple-500/30 hover:shadow-purple-500/60'
    },
    accent: {
      bg: 'bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20',
      border: 'border-cyan-500/50 hover:border-cyan-400',
      icon: 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white',
      title: 'text-cyan-400',
      glow: 'shadow-cyan-500/30 hover:shadow-cyan-500/60'
    }
  };
  
  const currentColors = colorClasses[color];
  
  return (
    <div className={`text-center p-8 ${currentColors.bg} backdrop-blur-sm rounded-xl border-2 ${currentColors.border} ${currentColors.glow} transition-all duration-300 group hover:scale-105 hover:-translate-y-2 relative overflow-hidden`}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent"></div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className={`absolute top-4 left-4 w-2 h-2 ${currentColors.icon} rounded-full animate-float opacity-60`}></div>
        <div className={`absolute top-8 right-6 w-1 h-1 ${currentColors.icon} rounded-full animate-float opacity-40`} style={{animationDelay: '0.5s'}}></div>
        <div className={`absolute bottom-6 left-8 w-1.5 h-1.5 ${currentColors.icon} rounded-full animate-float opacity-50`} style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className={`flex items-center justify-center h-16 w-16 rounded-xl ${currentColors.icon} mx-auto transition-transform group-hover:scale-110 group-hover:rotate-6 shadow-lg mb-6 relative z-10`}>
        {icon}
      </div>
      <div className="relative z-10">
        <h3 className={`text-xl font-bold ${currentColors.title} mb-3`}>{title}</h3>
        <p className="text-base text-gray-300 leading-relaxed">{description}</p>
      </div>
      
      {/* Decorative corner accent */}
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${currentColors.icon} opacity-10 rounded-bl-full`}></div>
    </div>
  );
};

// New: A reusable component for the pricing cards.
const PricingCard = ({ plan, price, priceDetail, description, features, cta, isFeatured = false }: { plan: string; price: string; priceDetail?: string; description: string; features: string[]; cta: string; isFeatured?: boolean; }) => (
  <div className={`flex flex-col p-10 backdrop-blur-sm rounded-2xl border-2 transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden group ${isFeatured ? 'border-pink-500/60 shadow-2xl shadow-pink-500/40 bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-red-900/20' : 'border-cyan-500/50 hover:border-cyan-400 bg-gradient-to-br from-gray-900/60 via-purple-900/20 to-cyan-900/10 shadow-xl shadow-cyan-500/20'}`}>
    
    {/* Animated background on hover */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${isFeatured ? 'bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-orange-500/10' : 'bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10'}`}></div>
    
    {/* Featured badge */}
    {isFeatured && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
          ⭐ MOST POPULAR
        </div>
      </div>
    )}
    
    {/* Decorative corner elements */}
    <div className={`absolute top-0 right-0 w-24 h-24 opacity-20 rounded-bl-full ${isFeatured ? 'bg-gradient-to-bl from-pink-500 to-purple-500' : 'bg-gradient-to-bl from-cyan-500 to-blue-500'}`}></div>
    
    <div className="relative z-10">
      <h3 className={`text-3xl font-black text-center mb-3 ${isFeatured ? 'text-transparent bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text' : 'text-cyan-400'}`}>{plan}</h3>
      <p className="text-center text-gray-300 h-12 flex items-center justify-center text-lg">{description}</p>
      
      <div className="mt-8 text-center">
        <span className={`text-6xl font-black ${isFeatured ? 'text-transparent bg-gradient-to-r from-orange-400 via-pink-400 to-red-400 bg-clip-text' : 'text-cyan-400'}`}>{price}</span>
        {priceDetail && <span className="text-lg font-medium text-gray-400 ml-2">{priceDetail}</span>}
      </div>
      
      <ul className="mt-10 space-y-5 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start group/item">
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-4 mt-0.5 transition-transform group-hover/item:scale-110 ${isFeatured ? 'bg-gradient-to-r from-pink-500 to-orange-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}>
              <Check className="h-4 w-4 text-white" />
            </div>
            <span className="text-gray-300 text-lg leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>
      
      <div className="mt-10">
        <a href="/sign-up" className="w-full block">
          <Button
            size="lg"
            className={`w-full text-lg rounded-2xl font-bold transition-all duration-500 py-4 px-8 transform hover:scale-105 ${isFeatured ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-pink-500 hover:via-orange-500 hover:to-red-500 text-white shadow-xl shadow-pink-500/50 hover:shadow-orange-500/60 animate-pulse' : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-cyan-500/40 hover:shadow-blue-500/50'}`}
          >
            {cta}
            <ArrowRight className="ml-3 h-5 w-5" />
          </Button>
        </a>
      </div>
    </div>
  </div>
);
