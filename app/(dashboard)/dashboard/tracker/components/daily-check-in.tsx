'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DailyCheckInProps {
  periodId: string;
  onCheckInComplete: () => void;
}

export default function DailyCheckIn({ periodId, onCheckInComplete }: DailyCheckInProps) {
  const [didTextTrash, setDidTextTrash] = useState<boolean | null>(null);
  const [mood, setMood] = useState<number>(3);
  const [hadIntrusiveThoughts, setHadIntrusiveThoughts] = useState<boolean | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (didTextTrash === null || hadIntrusiveThoughts === null) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/tracker/daily-checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          periodId,
          didTextTrash,
          mood,
          hadIntrusiveThoughts,
          notes: notes.trim() || null,
        }),
      });

      if (response.ok) {
        onCheckInComplete();
      } else {
        console.error('Failed to submit daily check-in');
      }
    } catch (error) {
      console.error('Error submitting daily check-in:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const moodEmojis = ['😢', '😔', '😐', '🙂', '😊'];
  const moodLabels = ['Very Low', 'Low', 'Neutral', 'Good', 'Very Good'];

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-pink-500/20">
      <h3 className="text-lg font-bold text-white mb-4">Daily Check-In</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Did you text the trash? */}
        <div>
          <Label className="text-white text-sm font-medium mb-3 block">
            Did you text the trash today?
          </Label>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={didTextTrash === false ? "default" : "outline"}
              onClick={() => setDidTextTrash(false)}
              className={`flex-1 ${
                didTextTrash === false 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'border-slate-600 text-slate-300 hover:border-green-500'
              }`}
            >
              No 🏆
            </Button>
            <Button
              type="button"
              variant={didTextTrash === true ? "default" : "outline"}
              onClick={() => setDidTextTrash(true)}
              className={`flex-1 ${
                didTextTrash === true 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'border-slate-600 text-slate-300 hover:border-red-500'
              }`}
            >
              Yes 💔
            </Button>
          </div>
        </div>

        {/* Mood Scale */}
        <div>
          <Label className="text-white text-sm font-medium mb-3 block">
            How are you feeling today?
          </Label>
          <div className="flex gap-2 justify-between">
            {moodEmojis.map((emoji, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setMood(index + 1)}
                className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                  mood === index + 1
                    ? 'border-pink-500 bg-pink-500/20'
                    : 'border-slate-600 hover:border-pink-400'
                }`}
              >
                <span className="text-2xl mb-1">{emoji}</span>
                <span className="text-xs text-slate-300">{moodLabels[index]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Intrusive Thoughts */}
        <div>
          <Label className="text-white text-sm font-medium mb-3 block">
            Did you have intrusive thoughts about them?
          </Label>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={hadIntrusiveThoughts === false ? "default" : "outline"}
              onClick={() => setHadIntrusiveThoughts(false)}
              className={`flex-1 ${
                hadIntrusiveThoughts === false 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'border-slate-600 text-slate-300 hover:border-green-500'
              }`}
            >
              No
            </Button>
            <Button
              type="button"
              variant={hadIntrusiveThoughts === true ? "default" : "outline"}
              onClick={() => setHadIntrusiveThoughts(true)}
              className={`flex-1 ${
                hadIntrusiveThoughts === true 
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                  : 'border-slate-600 text-slate-300 hover:border-yellow-500'
              }`}
            >
              Yes
            </Button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes" className="text-white text-sm font-medium mb-2 block">
            Notes (optional)
          </Label>
          <Input
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How was your day? Any thoughts or feelings..."
            className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
            maxLength={500}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || didTextTrash === null || hadIntrusiveThoughts === null}
          className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Complete Check-In'}
        </Button>
      </form>
    </Card>
  );
}
