'use client';

import { useState } from 'react';
import { createNoContactPeriod } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, User, Calendar } from 'lucide-react';

export function CreatePeriodForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      await createNoContactPeriod(formData);
    } catch (error) {
      console.error('Failed to create period:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contactName" className="text-cyan-100 mb-2 flex items-center gap-2">
            <User className="h-4 w-4" />
            Contact Name
          </Label>
          <Input
            id="contactName"
            name="contactName"
            placeholder="Ex, Sarah, John, etc."
            required
            className="bg-gray-900/60 border-2 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all duration-200 backdrop-blur-sm"
          />
        </div>

        <div>
          <Label htmlFor="targetDays" className="text-cyan-100 mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Target Days
          </Label>
          <Input
            id="targetDays"
            name="targetDays"
            type="number"
            min="1"
            max="365"
            placeholder="30"
            required
            className="bg-gray-900/60 border-2 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all duration-200 backdrop-blur-sm"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-cyan-600 hover:bg-cyan-700 text-white border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300 backdrop-blur-sm"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Starting...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Start Tracking
          </div>
        )}
      </Button>
    </form>
  );
}
