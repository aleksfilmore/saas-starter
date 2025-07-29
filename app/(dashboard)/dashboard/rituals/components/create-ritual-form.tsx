'use client';

import { useState } from 'react';
import { createRitual } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Sunrise, 
  Sunset, 
  Heart, 
  Dumbbell, 
  Brain, 
  Palette, 
  Target,
  Zap
} from 'lucide-react';

export function CreateRitualForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      await createRitual(formData);
    } catch (error) {
      console.error('Failed to create ritual:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const categories = [
    { value: 'morning', label: 'Morning', icon: Sunrise, color: 'text-orange-400' },
    { value: 'evening', label: 'Evening', icon: Sunset, color: 'text-purple-400' },
    { value: 'self_care', label: 'Self Care', icon: Heart, color: 'text-pink-400' },
    { value: 'fitness', label: 'Fitness', icon: Dumbbell, color: 'text-green-400' },
    { value: 'mindfulness', label: 'Mindfulness', icon: Brain, color: 'text-blue-400' },
    { value: 'creativity', label: 'Creativity', icon: Palette, color: 'text-cyan-400' },
    { value: 'productivity', label: 'Productivity', icon: Target, color: 'text-yellow-400' },
  ];

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'custom', label: 'Custom' },
  ];

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title" className="text-purple-100 mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Ritual Name
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="Morning meditation, Evening journaling..."
            required
            className="bg-gray-900/60 border-2 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:shadow-[0_0_10px_rgba(168,85,247,0.3)] transition-all duration-200 backdrop-blur-sm"
          />
        </div>

        <div>
          <Label htmlFor="targetFrequency" className="text-purple-100 mb-2 block">
            Frequency
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {frequencies.map((freq) => (
              <label key={freq.value} className="flex items-center gap-2 p-2 border-2 border-gray-600/30 rounded-lg hover:bg-gray-700/30 cursor-pointer transition-all duration-200 hover:border-purple-500/30 hover:shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                <input
                  type="radio"
                  name="targetFrequency"
                  value={freq.value}
                  defaultChecked={freq.value === 'daily'}
                  className="text-purple-500"
                />
                <span className="text-sm text-gray-300">{freq.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Label className="text-purple-100 mb-3 block">Category</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((category) => (
            <label key={category.value} className="flex items-center gap-2 p-3 border-2 border-gray-600/30 rounded-lg hover:bg-gray-700/30 cursor-pointer transition-all duration-200 hover:border-purple-500/30 hover:shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              <input
                type="radio"
                name="category"
                value={category.value}
                required
                className="text-purple-500"
              />
              <category.icon className={`h-4 w-4 ${category.color}`} />
              <span className="text-sm text-gray-300">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="description" className="text-purple-100 mb-2 block">
          Description (optional)
        </Label>
        <Input
          id="description"
          name="description"
          placeholder="How will this ritual help you grow?"
          className="bg-gray-900/60 border-2 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:shadow-[0_0_10px_rgba(168,85,247,0.3)] transition-all duration-200 backdrop-blur-sm"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300 backdrop-blur-sm"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Creating...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Ritual
          </div>
        )}
      </Button>
    </form>
  );
}
