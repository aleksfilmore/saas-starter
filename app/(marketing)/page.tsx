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
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-foreground">
      {/* Background Orbs */}
      <Orb className="top-[-20%] left-[-10%] size-[40vw]" style={{ animationDuration: '8s' }} />
      <Orb className="top-[30%] right-[-15%] size-[50vw]" style={{ animationDuration: '12s' }} />
      <Orb className="bottom-[-20%] left-[20%] size-[30vw]" style={{ animationDuration: '10s' }} />
      
      {/* Additional colorful orbs */}
      <div className="absolute top-[60%] left-[-5%] w-[20vw] h-[20vw] bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="absolute top-[10%] right-[10%] w-[15vw] h-[15vw] bg-gradient-to-r from-glitch-pink/25 to-glitch-cyan/15 rounded-full blur-2xl animate-float" style={{ animationDuration: '7s' }}></div>
      <div className="absolute bottom-[40%] right-[-8%] w-[25vw] h-[25vw] bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center text-center pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="text-left lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-tight">
                <span className="text-glitch-cyan">Terminate.</span>{" "}
                <span className="text-glitch-pink">Format.</span>{" "}
                <span className="text-glitch-lime">Glow-up.</span>
              </h1>
              <p className="mt-4 text-lg text-gray-200 max-w-xl">
                <span className="text-glitch-pink font-bold">CTRL+ALT+BLOCK</span> is the savage, AI-powered ritual for resetting your attachments. It's not therapy - it's a <span className="text-glitch-cyan font-bold">digital exorcism</span>.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <a href="/sign-up">
                  <Button size="lg" className="text-base rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-400 hover:via-red-400 hover:to-pink-400 text-white font-bold shadow-lg shadow-orange-500/50 hover:shadow-red-500/50 transition-all duration-300 px-8 py-3 animate-pulse">
                    🔥 Begin the Ritual FREE
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <a href="#how-it-works">
                  <Button variant="outline" size="lg" className="text-base rounded-full border-glitch-cyan text-glitch-cyan hover:bg-glitch-cyan hover:text-black transition-all duration-300 px-8 py-3">
                    How it Works
                  </Button>
                </a>
              </div>
            </div>
            
            {/* Right side - Visual element */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                <Glow className="size-80" />
                <img
                  src="/hero-illustration.png"
                  alt="A hooded figure meditating with a broken heart, representing emotional reformatting."
                  width={320}
                  height={320}
                  className="rounded-lg relative shadow-2xl shadow-glitch-pink/30 transition-all duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-purple-900/30 backdrop-blur-sm w-full relative">
        <Orb 
          className="top-1/4 right-1/4 opacity-30" 
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
             <h2 className="text-5xl font-black text-transparent bg-gradient-to-r from-glitch-cyan via-glitch-lime to-glitch-pink bg-clip-text mb-6">Your Arsenal for <span className="text-white">Emotional Recovery</span></h2>
             <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">Tools engineered for <span className="text-glitch-lime font-bold">structured chaos</span> healing.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Bot className="h-8 w-8" />}
              title="AI-Powered Tools"
              description="Dispute chats, savage breakup letters, tarot-style diagnostics — all generated by our resident cyber-witch."
              color="primary"
            />
            <FeatureCard
              icon={<Award className="h-8 w-8" />}
              title="Gamified Healing"
              description="Rack up No Contact streaks, earn grit badges a future ritual partner will never see."
              color="secondary"
            />
            <FeatureCard
              icon={<ShieldQuestion className="h-8 w-8" />}
              title="Anonymous Confessional"
              description="Scream into the void or lurk in the shadows. A privacy-first wall for chaotic catharsis."
              color="accent"
            />
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-24 relative bg-gradient-to-br from-gray-900/80 via-purple-800/40 to-pink-900/30 backdrop-blur-sm overflow-hidden">
        {/* Floating orbs for visual depth */}
        <Orb className="top-10 left-10 opacity-20" />
        <Orb className="bottom-20 right-20 opacity-25" />
        
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-glitch-cyan to-transparent opacity-60"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-transparent bg-gradient-to-r from-glitch-lime via-glitch-pink to-glitch-cyan bg-clip-text mb-6">Pick your <span className="text-white">protocol</span>.</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">Start free, stay petty, upgrade when you want the full <span className="text-glitch-cyan font-bold">spectrum</span>.</p>
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
