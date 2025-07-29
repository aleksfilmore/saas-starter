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
      <section className="relative min-h-screen flex items-center justify-center text-center pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            <span className="text-glitch-cyan">Terminate.</span>{" "}
            <span className="text-glitch-pink">Format.</span>{" "}
            <span className="text-glitch-lime">Glow-up.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-200 sm:text-xl max-w-3xl mx-auto">
            <span className="text-glitch-pink font-bold text-xl">CTRL+ALT+BLOCK</span> is the savage, AI-powered ritual for resetting your attachments and reformatting your life. It's not therapy - it's a <span className="text-glitch-cyan font-bold">digital exorcism</span>.
          </p>
          <div className="mt-10">
            <a href="/sign-up">
              <Button size="lg" className="text-lg rounded-full bg-gradient-to-r from-glitch-pink via-glitch-purple to-glitch-cyan hover:from-glitch-pink/80 hover:via-glitch-purple/80 hover:to-glitch-cyan/80 text-black font-bold shadow-lg shadow-glitch-pink/50 hover:shadow-glitch-cyan/50 transition-all duration-300 px-8 py-4">
                🔥 Begin the Ritual FREE
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Flagship Visual Section */}
      <section className="relative py-16">
         <div className="flex justify-center -mt-48 z-10 relative">
            <div className="relative">
              <Glow className="size-64" />
              <img
                src="/hero-illustration.png"
                alt="A hooded figure meditating with a broken heart, representing emotional reformatting."
                width={400}
                height={400}
                className="rounded-lg relative shadow-2xl shadow-primary/20"
              />
            </div>
          </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-purple-900/30 backdrop-blur-sm w-full z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
             <h2 className="text-3xl font-bold sm:text-4xl text-glitch-cyan">Your Arsenal for <span className="text-glitch-pink">Emotional Recovery</span></h2>
             <p className="mt-4 text-lg text-gray-300">Tools engineered for <span className="text-glitch-lime font-bold">structured chaos</span> healing.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Bot />}
              title="AI-Powered Tools"
              description="Dispute chats, savage breakup letters, tarot-style diagnostics — all generated by our resident cyber-witch."
              color="primary"
            />
            <FeatureCard
              icon={<Award />}
              title="Gamified Healing"
              description="Rack up No Contact streaks, earn grit badges a future ritual partner will never see."
              color="secondary"
            />
            <FeatureCard
              icon={<ShieldQuestion />}
              title="Anonymous Confessional"
              description="Scream into the void or lurk in the shadows. A privacy-first wall for chaotic catharsis."
              color="accent"
            />
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-20 z-10 relative bg-gradient-to-br from-gray-900/50 via-purple-800/30 to-pink-900/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl text-glitch-lime">Pick your <span className="text-glitch-pink">protocol</span>.</h2>
            <p className="mt-4 text-lg text-gray-300">Start free, stay petty, upgrade when you want the full <span className="text-glitch-cyan font-bold">spectrum</span>.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
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
      <section className="py-16 bg-gradient-to-l from-pink-900/20 via-purple-900/30 to-cyan-900/20 backdrop-blur-sm w-full z-10 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl text-glitch-cyan">System <span className="text-glitch-pink">Queries</span></h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is this therapy?</AccordionTrigger>
              <AccordionContent>No. This is a tool for self-guided emotional processing, not a replacement for professional mental health care. If you are in crisis, please contact a professional.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is my data private?</AccordionTrigger>
              <AccordionContent>Yes. Privacy is a core value. Your personal data is yours. Confessional posts are anonymized by default. Read our full privacy policy for details.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What if I break my No Contact streak?</AccordionTrigger>
              <AccordionContent>It happens. The app is designed to help you get back on track without judgment. You can use a "Streak Shield" or simply restart your counter. This is about progress, not perfection.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 text-center bg-gradient-to-r from-purple-900/40 to-pink-900/40">
         <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold sm:text-4xl text-glitch-lime">Ready for your <span className="text-glitch-pink">emotional reformat</span>?</h2>
            <p className="mt-4 text-lg text-gray-300">Stop doomscrolling and start reprogramming. Your <span className="text-glitch-cyan font-bold">future self</span> will thank you.</p>
            <div className="mt-8">
              <a href="/sign-up">
                <Button size="lg" className="text-lg rounded-full bg-gradient-to-r from-glitch-pink via-glitch-purple to-glitch-cyan hover:from-glitch-lime hover:via-glitch-pink hover:to-glitch-purple text-black font-bold shadow-lg shadow-glitch-pink/50 hover:shadow-glitch-lime/50 transition-all duration-500 px-10 py-4 animate-pulse">
                  🚀 Sign Up & Start Healing
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </a>
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
    primary: 'bg-gradient-to-br from-glitch-pink to-glitch-purple text-white',
    secondary: 'bg-gradient-to-br from-glitch-cyan to-glitch-lime text-black',
    accent: 'bg-gradient-to-br from-glitch-purple to-glitch-pink text-white',
  };
  const borderClasses = {
    primary: 'border-glitch-pink/50 hover:border-glitch-pink',
    secondary: 'border-glitch-cyan/50 hover:border-glitch-cyan',
    accent: 'border-glitch-purple/50 hover:border-glitch-purple',
  };
  return (
    <div className={`text-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-lg border-2 ${borderClasses[color]} transition-all duration-300 group hover:bg-gray-800/60 hover:scale-105`}>
      <div className={`flex items-center justify-center h-12 w-12 rounded-md ${colorClasses[color]} mx-auto transition-transform group-hover:scale-110 shadow-lg`}>
        {icon}
      </div>
      <div className="mt-5">
        <h3 className="text-lg font-medium text-glitch-cyan">{title}</h3>
        <p className="mt-2 text-base text-gray-300">{description}</p>
      </div>
    </div>
  );
};

// New: A reusable component for the pricing cards.
const PricingCard = ({ plan, price, priceDetail, description, features, cta, isFeatured = false }: { plan: string; price: string; priceDetail?: string; description: string; features: string[]; cta: string; isFeatured?: boolean; }) => (
  <div className={`flex flex-col p-8 bg-gray-900/60 backdrop-blur-sm rounded-lg border-2 transition-all duration-300 hover:bg-gray-800/70 hover:scale-105 ${isFeatured ? 'border-glitch-pink shadow-2xl shadow-glitch-pink/30 ring-2 ring-glitch-cyan/20 bg-gradient-to-br from-purple-900/30 to-pink-900/20' : 'border-glitch-cyan/50 hover:border-glitch-cyan'}`}>
    <h3 className={`text-2xl font-bold text-center ${isFeatured ? 'text-glitch-pink' : 'text-glitch-cyan'}`}>{plan}</h3>
    <p className="mt-2 text-center text-gray-300 h-10">{description}</p>
    <div className="mt-6 text-center">
      <span className={`text-4xl font-bold ${isFeatured ? 'text-glitch-lime' : 'text-glitch-cyan'}`}>{price}</span>
      {priceDetail && <span className="text-base font-medium text-gray-400">{priceDetail}</span>}
    </div>
    <ul className="mt-8 space-y-4 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <Check className={`h-5 w-5 mr-3 mt-1 flex-shrink-0 ${isFeatured ? 'text-glitch-lime' : 'text-glitch-cyan'}`} />
          <span className="text-gray-300">{feature}</span>
        </li>
      ))}
    </ul>
    <div className="mt-8">
      <a href="/sign-up" className="w-full">
        <Button
          size="lg"
          className={`w-full text-lg rounded-full font-bold transition-all duration-300 ${isFeatured ? 'bg-gradient-to-r from-glitch-pink via-glitch-purple to-glitch-cyan hover:from-glitch-lime hover:via-glitch-pink hover:to-glitch-purple text-black shadow-lg shadow-glitch-pink/40 hover:shadow-glitch-lime/40' : 'bg-gradient-to-r from-glitch-cyan to-glitch-purple text-white hover:from-glitch-purple hover:to-glitch-pink'}`}
        >
          {cta}
        </Button>
      </a>
    </div>
  </div>
);
