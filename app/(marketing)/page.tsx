// File: app/(marketing)/page.tsx

"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Award, ShieldQuestion } from 'lucide-react';

const GlitchArt = () => (
  <div className="relative w-full h-64 bg-card rounded-lg overflow-hidden border border-border">
    <div className="absolute inset-0 bg-grid-pink-500/10"></div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-primary font-mono text-6xl font-bold tracking-widest select-none">
        BLOCK
      </div>
    </div>
    <div className="absolute top-1/4 left-0 w-full h-1/2 bg-background/80 animate-glitch" style={{ animationDuration: '3s' }}></div>
    <div className="absolute top-0 left-1/3 w-1/3 h-full bg-background/70 animate-glitch" style={{ animationDuration: '5s', animationDelay: '0.5s' }}></div>
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes glitch {
        0% { transform: translate(0); }
        2% { transform: translate(-5px, 5px); }
        4% { transform: translate(5px, -5px); }
        6% { transform: translate(-5px, 5px); }
        8% { transform: translate(5px, -5px); }
        10% { transform: translate(0); }
        100% { transform: translate(0); }
      }
    `}} />
  </div>
);

export default function HomePage() {
  return (
    <main className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left flex flex-col justify-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                The reprogramming ritual
                <span className="block text-primary">you didn’t know you needed.</span>
              </h1>
              <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Fusing savage wit with structured healing, CTRL+ALT+BLOCK is the interactive, AI-powered portal for reclaiming your sanity after heartbreak. This isn't therapy. It's an emotional reformat.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <a href="/sign-up">
                  <Button size="lg" className="text-lg rounded-full">
                    Begin the Ritual
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <GlitchArt />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card/50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
             <h2 className="text-3xl font-bold sm:text-4xl">Your Arsenal for Emotional Recovery</h2>
             <p className="mt-4 text-lg text-muted-foreground">Tools designed for structured chaos healing.</p>
          </div>
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="text-center p-6 bg-card rounded-lg border border-border">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground mx-auto">
                <Bot className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h3 className="text-lg font-medium">AI-Powered Tools</h3>
                <p className="mt-2 text-base text-muted-foreground">
                  Use the Closure Simulator to say what you need to say, or generate a savage Breakup Letter to send (or burn).
                </p>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 text-center p-6 bg-card rounded-lg border border-border">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent text-accent-foreground mx-auto">
                <Award className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h3 className="text-lg font-medium">Gamified Healing</h3>
                <p className="mt-2 text-base text-muted-foreground">
                  Track your No Contact streak, earn savage badges like "Blocked and Blessed", and complete daily rituals to build resilience.
                </p>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 text-center p-6 bg-card rounded-lg border border-border">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-secondary text-secondary-foreground mx-auto">
                <ShieldQuestion className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h3 className="text-lg font-medium">Anonymous Confessional</h3>
                <p className="mt-2 text-base text-muted-foreground">
                  Scream into the void. Share your story or read others' on our interactive, privacy-first confessional wall.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready for your emotional reformat?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stop doomscrolling and start reprogramming. Your future self will thank you.
            </p>
            <div className="mt-8">
               <a href="/sign-up">
                <Button size="lg" className="text-lg rounded-full bg-accent text-accent-foreground hover:bg-accent/80">
                  Sign Up & Start Healing
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
