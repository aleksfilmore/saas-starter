'use client';

import { useState } from 'react';
import { completeRitual } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  Circle, 
  Plus,
  Sunrise, 
  Sunset, 
  Heart, 
  Dumbbell, 
  Brain, 
  Palette, 
  Target,
  Smile,
  Meh,
  Frown
} from 'lucide-react';

interface Ritual {
  id: string;
  title: string;
  description: string | null;
  category: string;
  targetFrequency: string;
  isActive: boolean;
  createdAt: Date;
}

interface Completion {
  id: string;
  completedAt: Date;
  notes: string | null;
  mood: number | null;
  createdAt: Date;
}

interface RitualCompletionCardProps {
  ritual: Ritual;
  completed: boolean;
  completion: Completion | null;
}

export function RitualCompletionCard({ ritual, completed, completion }: RitualCompletionCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryIcons: Record<string, any> = {
    morning: Sunrise,
    evening: Sunset,
    self_care: Heart,
    fitness: Dumbbell,
    mindfulness: Brain,
    creativity: Palette,
    productivity: Target,
  };

  const categoryColors: Record<string, string> = {
    morning: 'text-orange-400 border-orange-500/30',
    evening: 'text-purple-400 border-purple-500/30',
    self_care: 'text-pink-400 border-pink-500/30',
    fitness: 'text-green-400 border-green-500/30',
    mindfulness: 'text-blue-400 border-blue-500/30',
    creativity: 'text-cyan-400 border-cyan-500/30',
    productivity: 'text-yellow-400 border-yellow-500/30',
  };

  const Icon = categoryIcons[ritual.category] || Target;
  const colorClass = categoryColors[ritual.category] || 'text-gray-400 border-gray-500/30';

  async function handleQuickComplete() {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('ritualId', ritual.id);
      await completeRitual(formData);
    } catch (error) {
      console.error('Failed to complete ritual:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDetailedComplete(formData: FormData) {
    setIsSubmitting(true);
    try {
      formData.append('ritualId', ritual.id);
      await completeRitual(formData);
      setShowCompletionForm(false);
    } catch (error) {
      console.error('Failed to complete ritual:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const moodEmojis = [
    { value: 1, icon: Frown, label: 'Difficult', color: 'text-red-400' },
    { value: 2, icon: Meh, label: 'Okay', color: 'text-orange-400' },
    { value: 3, icon: Meh, label: 'Good', color: 'text-yellow-400' },
    { value: 4, icon: Smile, label: 'Great', color: 'text-green-400' },
    { value: 5, icon: Smile, label: 'Amazing', color: 'text-purple-400' },
  ];

  return (
    <div className={`bg-gray-800/60 border-2 rounded-lg p-4 transition-all duration-300 backdrop-blur-sm ${
      completed 
        ? 'border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
        : `border-gray-600/30 hover:${colorClass.split(' ')[1]} hover:shadow-[0_0_15px_rgba(107,114,128,0.4)]`
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-gray-700/50 rounded-lg border ${colorClass}`}>
            <Icon className={`h-4 w-4 ${colorClass.split(' ')[0]}`} />
          </div>
          <div>
            <h3 className="font-semibold text-white">{ritual.title}</h3>
            {ritual.description && (
              <p className="text-sm text-gray-400">{ritual.description}</p>
            )}
          </div>
        </div>
        {completed ? (
          <CheckCircle className="h-6 w-6 text-green-400" />
        ) : (
          <Circle className="h-6 w-6 text-gray-500" />
        )}
      </div>

      {completed && completion ? (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-400 font-medium">
              Completed at {new Date(completion.completedAt).toLocaleTimeString()}
            </span>
          </div>
          {completion.notes && (
            <p className="text-sm text-gray-300 mb-2">{completion.notes}</p>
          )}
          {completion.mood && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Mood:</span>
              {(() => {
                const moodData = moodEmojis.find(m => m.value === completion.mood);
                if (!moodData) return null;
                const MoodIcon = moodData.icon;
                return (
                  <div className="flex items-center gap-1">
                    <MoodIcon className={`h-4 w-4 ${moodData.color}`} />
                    <span className={`text-sm ${moodData.color}`}>{moodData.label}</span>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {!showCompletionForm ? (
            <div className="flex gap-2">
              <Button
                onClick={handleQuickComplete}
                disabled={isSubmitting}
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white border-green-500/30"
              >
                {isSubmitting ? 'Completing...' : 'Complete'}
              </Button>
              <Button
                onClick={() => setShowCompletionForm(true)}
                variant="outline"
                size="sm"
                className="border-gray-500/30 text-gray-300 hover:bg-gray-700/30"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <form action={handleDetailedComplete} className="space-y-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600/30">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white">Complete Ritual</h4>
                <Button
                  type="button"
                  onClick={() => setShowCompletionForm(false)}
                  variant="outline"
                  size="sm"
                  className="border-gray-500/30"
                >
                  Cancel
                </Button>
              </div>
              
              <div>
                <Label className="text-sm text-gray-300 mb-2 block">How did it go?</Label>
                <div className="grid grid-cols-5 gap-2">
                  {moodEmojis.map((mood) => (
                    <label key={mood.value} className="flex flex-col items-center gap-1 p-2 border border-gray-600/30 rounded-lg hover:bg-gray-600/30 cursor-pointer">
                      <input
                        type="radio"
                        name="mood"
                        value={mood.value}
                        className="sr-only"
                      />
                      <mood.icon className={`h-5 w-5 ${mood.color}`} />
                      <span className="text-xs text-gray-400">{mood.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm text-gray-300 mb-2 block">
                  Notes (optional)
                </Label>
                <Input
                  id="notes"
                  name="notes"
                  placeholder="How are you feeling? Any insights?"
                  className="bg-gray-600/50 border-gray-500/30 text-white placeholder:text-gray-400"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? 'Completing...' : 'Complete Ritual'}
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
