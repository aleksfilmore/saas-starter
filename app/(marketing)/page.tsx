"use client";

import Image from "next/image";
import { ArrowRight, Bot, Award, ShieldQuestion, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HomePage() {
  return (
    <div className="bg-background text-foreground">
      {/* ───────────────────────────────── Hero */}
      <section className="relative overflow-hidden py-24">
        {/* Enhanced multi-layer background */}
        <div className="pointer-events-none absolute inset-0 -z-20 bg-cyber-gradient" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-glitch-pink/15 via-secondary/10 to-accent/15 blur-3xl animate-pulse-slow" />
        
        {/* Floating orbs */}
        <div className="pointer-events-none absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-float"></div>
        <div className="pointer-events-none absolute top-40 right-20 w-24 h-24 bg-accent/20 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="pointer-events-none absolute bottom-20 left-1/4 w-28 h-28 bg-secondary/20 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[500px]">
            {/* copy + CTA */}
            <div className="flex flex-col justify-center text-center lg:text-left">
              <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
                <span className="bg-gradient-to-r from-foreground via-glitch-pink to-accent bg-clip-text text-transparent">
                  Terminate. Format.
                </span>
                <span className="block bg-gradient-to-r from-primary via-secondary to-glitch-cyan bg-clip-text text-transparent animate-pulse-slow">
                  Glow-up.
                </span>
              </h1>

              <p className="mb-8 max-w-xl text-lg text-muted-foreground lg:mx-0 mx-auto leading-relaxed">
                <span className="text-accent font-semibold">CTRL+ALT+BLOCK</span> is the savage, AI-powered breakup ritual for
                deleting old attachments and rebooting your life. It&apos;s not
                therapy – it&apos;s a <span className="text-glitch-pink font-semibold">digital exorcism</span>.
              </p>

              <div className="flex justify-center lg:justify-start">
                <a href="/sign-up">
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 px-8 py-4 text-lg shadow-neon-pink hover:shadow-neon-pink/80 transition-all duration-300 group"
                  >
                    Begin the Ritual 
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </div>
            </div>

            {/* flagship artwork */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Image
                  src="/hero-illustration.png"
                  alt="Glitch-core emotional recovery illustration"
                  width={400}
                  height={400}
                  className="relative drop-shadow-2xl transition-all duration-500 hover:scale-105 rounded-2xl object-cover border border-primary/30 shadow-neon-pink/50"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────── Feature grid */}
      <section className="relative bg-card/30 border-y border-border/50 py-24 overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-accent/5"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
              Your Arsenal for Emotional Recovery
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Tools engineered for <span className="text-glitch-cyan font-semibold">structured-chaos</span> healing.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* AI-Powered Tools */}
            <div className="group rounded-2xl border border-primary/30 bg-card/80 backdrop-blur-sm p-8 shadow-neon-pink/30 transition-all duration-300 hover:scale-105 hover:shadow-neon-pink/60 hover:border-primary/60">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-glitch-pink shadow-neon-pink">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-center text-foreground">AI-Powered Tools</h3>
              <p className="text-base text-muted-foreground text-center leading-relaxed">
                Closure chats, savage breakup letters, tarot-style diagnostics – all generated by our resident <span className="text-primary font-medium">cyber-witch</span>.
              </p>
              <div className="mt-4 flex justify-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI POWERED
                </span>
              </div>
            </div>

            {/* Gamified Healing */}
            <div className="group rounded-2xl border border-accent/30 bg-card/80 backdrop-blur-sm p-8 shadow-neon-blue/30 transition-all duration-300 hover:scale-105 hover:shadow-neon-blue/60 hover:border-accent/60">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent to-glitch-cyan shadow-neon-blue">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-center text-foreground">Gamified Healing</h3>
              <p className="text-base text-muted-foreground text-center leading-relaxed">
                Rack up No-Contact streaks, earn <span className="text-accent font-medium">glitch badges</span> and daily ritual XP. Reformatting emotions has never felt so good.
              </p>
              <div className="mt-4 flex justify-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/30">
                  <Award className="w-3 h-3 mr-1" />
                  ACHIEVEMENT SYSTEM
                </span>
              </div>
            </div>

            {/* Anonymous Confessional */}
            <div className="group rounded-2xl border border-secondary/30 bg-card/80 backdrop-blur-sm p-8 shadow-neon-purple/30 transition-all duration-300 hover:scale-105 hover:shadow-neon-purple/60 hover:border-secondary/60">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-glitch-purple shadow-neon-purple">
                <ShieldQuestion className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-center text-foreground">Anonymous Confessional</h3>
              <p className="text-base text-muted-foreground text-center leading-relaxed">
                Scream into the void or lurk in the shadows. A <span className="text-secondary font-medium">privacy-first</span> wall for chaotic catharsis.
              </p>
              <div className="mt-4 flex justify-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary border border-secondary/30">
                  <ShieldQuestion className="w-3 h-3 mr-1" />
                  ANONYMOUS
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────── Pricing / Free-trial */}
      <section className="relative py-24 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card/30 to-background"></div>
        
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 relative">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            Pick your protocol
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Start free, stay petty. Upgrade when you want the full <span className="text-glitch-cyan font-semibold">spellbook</span>.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* freemium */}
            <div className="relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-muted/10 via-transparent to-border/10 rounded-2xl"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold text-foreground">Freemium</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Taste the chaos. No credit card.
                </p>
                <p className="mt-6 text-5xl font-extrabold text-foreground">$0</p>
                <ul className="mt-6 space-y-3 text-left text-sm">
                  <li className="flex items-center text-muted-foreground">
                    <span className="w-4 h-4 mr-3 text-success">✓</span>
                    Limited AI rituals each day
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <span className="w-4 h-4 mr-3 text-success">✓</span>
                    7-day No-Contact streak counter
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <span className="w-4 h-4 mr-3 text-success">✓</span>
                    Lurk-only Confessional access
                  </li>
                </ul>
                <a href="/sign-up" className="mt-8 block">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full rounded-xl border-border/50 text-muted-foreground hover:bg-muted/20 hover:text-foreground hover:border-border transition-all duration-300"
                  >
                    Launch Free Mode
                  </Button>
                </a>
              </div>
            </div>

            {/* basic w/ 7-day trial */}
            <div className="relative rounded-2xl border border-primary/60 shadow-neon-pink/50 ring-2 ring-primary/30 bg-card/90 backdrop-blur-sm group hover:shadow-neon-pink/80 transition-all duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-2 text-sm font-semibold text-white shadow-neon-pink animate-pulse-slow">
                <Sparkles className="w-4 h-4 mr-1 inline" />
                7-Day Free Trial
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 rounded-2xl"></div>
              <div className="p-8 relative z-10">
                <h3 className="text-2xl font-semibold text-foreground">Basic</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Full ritual toolkit + daily AI.
                </p>
                <p className="mt-6 text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">$9</p>
                <p className="text-sm text-muted-foreground">per month</p>
                <ul className="mt-6 space-y-3 text-left text-sm">
                  <li className="flex items-center text-muted-foreground">
                    <span className="w-4 h-4 mr-3 text-primary">✓</span>
                    Unlimited Closure Simulator & generators
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <span className="w-4 h-4 mr-3 text-primary">✓</span>
                    Full Confessional access
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <span className="w-4 h-4 mr-3 text-primary">✓</span>
                    Streak badges & XP store
                  </li>
                </ul>
                <a href="/sign-up" className="mt-8 block">
                  <Button
                    size="lg"
                    className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white shadow-neon-pink hover:shadow-neon-pink/80 transition-all duration-300 group"
                  >
                    <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                    Start Free Trial
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────── FAQ */}
      <section className="relative border-t border-border/50 bg-card/20 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-secondary/5"></div>
        
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-center text-4xl font-bold bg-gradient-to-r from-foreground to-glitch-cyan bg-clip-text text-transparent">FAQ</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted-foreground">
            If you&apos;re still emotionally <span className="text-accent font-semibold">buffering</span> …
          </p>

          <Accordion type="single" collapsible className="mt-12 space-y-4">
            {[
              {
                q: "Is CTRL+ALT+BLOCK therapy?",
                a: "Nope. We&apos;re a savage, creative ritual – perfect alongside therapy, but never a replacement.",
              },
              {
                q: "Do I have to use my real name?",
                a: "Absolutely not. We encourage anonymous usernames and store the bare minimum needed for log-in.",
              },
              {
                q: "What happens if I break No-Contact?",
                a: "Your streak resets (ouch) but you&apos;ll unlock a &apos;Recovery Ritual&apos; to process the slip without shame.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. Rage-quit, chill-quit, whatever-quit – one click in settings. Your exes do not get a notification :)",
              },
            ].map(({ q, a }, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`}
                className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm px-6 hover:border-accent/30 transition-all duration-300 group"
              >
                <AccordionTrigger className="text-left text-lg font-medium py-6 hover:no-underline text-foreground group-hover:text-accent transition-colors">
                  <span className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-3 text-accent opacity-60 group-hover:opacity-100 transition-opacity" />
                    {q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed border-t border-border/30 pt-4">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ───────────────────────────────── final CTA */}
      <section className="relative py-24 overflow-hidden">
        {/* Enhanced background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/5"></div>
        <div className="absolute top-20 left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl animate-pulse-slow"></div>
        
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8 relative">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-glitch-cyan bg-clip-text text-transparent">
            Ready to block &amp; bless?
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Tap below, grab your <span className="text-primary font-semibold">7-day trial</span>, and start the emotional
            reboot today. <span className="text-glitch-cyan">No regrets, just upgrades.</span>
          </p>
          <div className="mt-10">
            <a href="/sign-up">
              <Button
                size="lg"
                className="rounded-xl bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/80 hover:via-secondary/80 hover:to-accent/80 px-12 py-6 text-xl font-semibold shadow-neon-pink hover:shadow-neon-pink/80 transition-all duration-300 group animate-pulse-slow"
              >
                <Sparkles className="mr-3 h-6 w-6 group-hover:animate-pulse" />
                Enter CTRL+ALT+BLOCK 
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
