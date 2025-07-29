"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ShieldCheck, Zap, Award } from 'lucide-react';

export default function DashboardPage() {
  const [noContactDays, setNoContactDays] = useState(17);

  return (
    <div className="bg-background min-h-screen py-10 px-2 sm:px-6">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-foreground">Welcome Back.</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Your emotional reformat is in progress. Stay strong.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* No Contact Streak Card */}
          <div className="bg-card p-8 rounded-2xl border border-primary/60 shadow-xl">
            <div className="flex items-center mb-4">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 mr-3">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </span>
              <h2 className="text-2xl font-bold text-foreground">No Contact Streak</h2>
            </div>
            <div className="text-center my-8">
              <span className="text-8xl font-extrabold text-primary tracking-tighter drop-shadow">
                {noContactDays}
              </span>
              <span className="block text-2xl text-muted-foreground mt-2">Days</span>
            </div>
            <p className="text-center text-muted-foreground">
              You haven't contacted your ex since <span className="font-semibold text-foreground">[Date]</span>. Keep it up.
            </p>
            <div className="text-center mt-6">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 hover:text-primary transition"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Set Your Start Date
              </Button>
            </div>
          </div>

          {/* Today's Ritual Card */}
          <div className="bg-card p-8 rounded-2xl border border-border shadow-lg">
            <div className="flex items-center mb-4">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-secondary/10 mr-3">
                <Zap className="h-6 w-6 text-secondary" />
              </span>
              <h2 className="text-2xl font-bold text-foreground">Today's Ritual</h2>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-secondary-foreground">
                The "Pet Perspective" Generator
              </h3>
              <p className="text-muted-foreground">
                Your pet probably saw the whole thing. Time to hear their side of the story. Describe a memory with your ex and your pet, and our AI will generate what your furry (or scaly) friend was <em>really</em> thinking.
              </p>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 transition">
                Generate Pet Perspective
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Savage Badges */}
          <div className="bg-card p-8 rounded-2xl border border-border shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-foreground">Savage Badges</h3>
            <div className="space-y-3">
              <div className="flex items-center text-muted-foreground">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-accent/20 mr-3">
                  <Award className="h-5 w-5 text-accent" />
                </span>
                <span>Petty Saint</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-accent/20 mr-3">
                  <Award className="h-5 w-5 text-accent" />
                </span>
                <span>Blocked and Blessed</span>
              </div>
              <div className="flex items-center text-muted-foreground opacity-60">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-muted mr-3">
                  <Award className="h-5 w-5" />
                </span>
                <span>(Locked Badge)</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-card p-8 rounded-2xl border border-border shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-foreground">Your Progress</h3>
            <p className="text-muted-foreground">
              View your mood journal, past rituals, and shareable progress reports.
            </p>
            <Button
              variant="outline"
              className="w-full mt-4 border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground transition"
            >
              View Full History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}