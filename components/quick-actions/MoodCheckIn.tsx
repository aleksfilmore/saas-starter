"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, TrendingUp, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

interface MoodEntry {
  emoji: string;
  label: string;
  value: number;
  color: string;
  description: string;
  suggestions: string[];
}

const MOODS: MoodEntry[] = [
  {
    emoji: "😭",
    label: "System Crash",
    value: 1,
    color: "bg-red-500/20 text-red-400 border-red-500/50",
    description: "Full emotional meltdown mode",
    suggestions: [
      "Emergency breathing protocol",
      "Call Protocol Ghost for crisis support",
      "Complete 'System Crash Recovery' ritual",
      "Schedule emergency therapy session"
    ]
  },
  {
    emoji: "😢",
    label: "Processing Pain",
    value: 2,
    color: "bg-orange-500/20 text-orange-400 border-orange-500/50",
    description: "Heavy grief but functional",
    suggestions: [
      "Journal your feelings",
      "Complete a grief-cycle ritual",
      "Listen to your healing playlist",
      "Practice gentle self-care"
    ]
  },
  {
    emoji: "😕",
    label: "Glitching",
    value: 3,
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    description: "Unstable but not broken",
    suggestions: [
      "Take a mindfulness break",
      "Review your progress stats",
      "Complete a reframe ritual",
      "Chat with Protocol Ghost"
    ]
  },
  {
    emoji: "😐",
    label: "Running Stable",
    value: 4,
    color: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    description: "Neutral system state",
    suggestions: [
      "Build your streak with daily rituals",
      "Focus on growth activities",
      "Connect with the community",
      "Plan your next upgrade"
    ]
  },
  {
    emoji: "🙂",
    label: "Optimizing",
    value: 5,
    color: "bg-green-500/20 text-green-400 border-green-500/50",
    description: "Good day, building momentum",
    suggestions: [
      "Tackle harder challenges",
      "Help others in the community",
      "Plan a glow-up activity",
      "Celebrate your progress"
    ]
  },
  {
    emoji: "😊",
    label: "High Performance",
    value: 6,
    color: "bg-purple-500/20 text-purple-400 border-purple-500/50",
    description: "Feeling strong and confident",
    suggestions: [
      "Take on advanced rituals",
      "Share your wisdom with others",
      "Plan future goals",
      "Embrace your glow-up"
    ]
  },
  {
    emoji: "🔥",
    label: "System Upgraded",
    value: 7,
    color: "bg-pink-500/20 text-pink-400 border-pink-500/50",
    description: "Peak performance, unstoppable",
    suggestions: [
      "Take risks and try new things",
      "Inspire others with your journey",
      "Plan your next life upgrade",
      "Celebrate how far you've come"
    ]
  }
];

interface MoodCheckInProps {
  onComplete?: (mood: MoodEntry) => void;
}

export function MoodCheckIn({ onComplete }: MoodCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<MoodEntry | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [notes, setNotes] = useState('');

  const handleMoodSelect = (mood: MoodEntry) => {
    setSelectedMood(mood);
  };

  const handleComplete = async () => {
    if (selectedMood) {
      setIsComplete(true);
      
      try {
        // Send mood data to API for cross-platform synchronization
        await fetch('/api/quickactions/mood', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mood: selectedMood,
            notes: notes.trim() || null,
            suggestions: selectedMood.suggestions
          })
        });
      } catch (error) {
        console.error('Failed to sync mood check-in:', error);
        // Still complete locally even if sync fails
      }
      
      onComplete?.(selectedMood);
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        setIsComplete(false);
        setSelectedMood(null);
        setNotes('');
      }, 3000);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-purple-200 text-center text-sm">
          <Heart className="w-6 h-6 mx-auto mb-2" />
          Mood Check-in
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center">
            🧠 System Status Check
          </DialogTitle>
        </DialogHeader>

        {!isComplete ? (
          <div className="space-y-6">
            <p className="text-gray-300 text-center">
              How's your emotional operating system running today?
            </p>

            {/* Mood Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {MOODS.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood)}
                  className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedMood?.value === mood.value
                      ? mood.color + ' scale-105 shadow-lg'
                      : 'bg-gray-800 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{mood.emoji}</span>
                    <div className="text-left">
                      <p className="font-bold text-white">{mood.label}</p>
                      <p className="text-sm text-gray-400">{mood.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Mood Details */}
            {selectedMood && (
              <Card className="bg-gray-800 border-gray-600">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-2xl">{selectedMood.emoji}</span>
                    <span className="text-white">{selectedMood.label}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Recommended Actions:</h4>
                    <ul className="space-y-2">
                      {selectedMood.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-center space-x-2 text-gray-300">
                          <ArrowRight className="w-4 h-4 text-purple-400" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="What's contributing to this mood? Any specific triggers or wins?"
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none"
                      rows={3}
                    />
                  </div>

                  <Button 
                    onClick={handleComplete}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Log Mood & Get Recommendations
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center space-y-6 py-8">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-2xl font-bold text-green-400">Mood Logged!</h3>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-300 mb-2">
                System Status: {selectedMood?.label} {selectedMood?.emoji}
              </p>
              <Badge className={selectedMood?.color}>
                +10 XP • +5 Bytes
              </Badge>
            </div>
            <p className="text-gray-400 text-sm">
              Check your dashboard for personalized recommendations based on your mood
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
