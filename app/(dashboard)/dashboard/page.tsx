"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ShieldCheck, Zap, Award } from 'lucide-react';

export default function DashboardPage() {
  const [noContactDays, setNoContactDays] = useState(17);

  return (
    <>
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-foreground">Welcome Back.</h1>
        <p className="text-lg text-muted-foreground mt-2">Your emotional reformat is in progress. Stay strong.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card p-6 rounded-lg border border-primary/50 shadow-lg">
            <div className="flex items-center mb-4">
              <ShieldCheck className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-foreground">No Contact Streak</h2>
            </div>
            <div className="text-center my-8">
              <span className="text-8xl font-bold text-primary tracking-tighter">
                {noContactDays}
              </span>
              <span className="block text-2xl text-muted-foreground mt-2">Days</span>
            </div>
            <p className="text-center text-muted-foreground">
              You haven't contacted your ex since [Date]. Keep it up.
            </p>
            <div className="text-center mt-6">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
                <Calendar className="mr-2 h-4 w-4" />
                Set Your Start Date
              </Button>
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center mb-4">
              <Zap className="h-6 w-6 text-secondary mr-3" />
              <h2 className="text-2xl font-bold text-foreground">Today's Ritual</h2>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-secondary-foreground">The "Pet Perspective" Generator</h3>
              <p className="text-muted-foreground">
                Your pet probably saw the whole thing. Time to hear their side of the story. Describe a memory with your ex and your pet, and our AI will generate what your furry (or scaly) friend was <em>really</em> thinking.
              </p>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
                Generate Pet Perspective
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-bold mb-4 text-foreground">Savage Badges</h3>
            <div className="space-y-3">
              <div className="flex items-center text-muted-foreground">
                <Award className="h-5 w-5 mr-3 text-accent" />
                <span>Petty Saint</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Award className="h-5 w-5 mr-3 text-accent" />
                <span>Blocked and Blessed</span>
              </div>
              <div className="flex items-center text-muted-foreground opacity-60">
                <Award className="h-5 w-5 mr-3" />
                <span>(Locked Badge)</span>
              </div>
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-bold mb-4 text-foreground">Your Progress</h3>
            <p className="text-muted-foreground">
              View your mood journal, past rituals, and shareable progress reports.
            </p>
            <Button variant="outline" className="w-full mt-4 border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground">
              View Full History
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}