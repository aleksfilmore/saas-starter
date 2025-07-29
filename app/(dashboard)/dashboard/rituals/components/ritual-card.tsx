'use client';

import { useState } from 'react';
import { deleteRitual } from '../actions';
import { Button } from '@/components/ui/button';
import { 
  Sunrise, 
  Sunset, 
  Heart, 
  Dumbbell, 
  Brain, 
  Palette, 
  Target,
  MoreHorizontal,
  Trash2,
  Edit,
  Calendar
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

interface RitualCardProps {
  ritual: Ritual;
}

export function RitualCard({ ritual }: RitualCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    morning: 'text-orange-400 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.4)]',
    evening: 'text-purple-400 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.4)]',
    self_care: 'text-pink-400 border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.4)]',
    fitness: 'text-green-400 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.4)]',
    mindfulness: 'text-blue-400 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.4)]',
    creativity: 'text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.4)]',
    productivity: 'text-yellow-400 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.4)]',
  };

  const frequencyLabels: Record<string, string> = {
    daily: 'Daily',
    weekly: 'Weekly', 
    custom: 'Custom',
  };

  const Icon = categoryIcons[ritual.category] || Target;
  const colorClass = categoryColors[ritual.category] || 'text-gray-400 border-gray-500/30';

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteRitual(ritual.id);
    } catch (error) {
      console.error('Failed to delete ritual:', error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className={`bg-gray-800/60 border-2 rounded-xl p-6 transition-all duration-300 backdrop-blur-sm hover:${colorClass}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-gray-700/50 rounded-lg border ${colorClass.split(' ')[1]}`}>
            <Icon className={`h-5 w-5 ${colorClass.split(' ')[0]}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{ritual.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="h-3 w-3" />
              <span>{frequencyLabels[ritual.targetFrequency]}</span>
              <span>•</span>
              <span className="capitalize">{ritual.category.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <Button
            onClick={() => setShowActions(!showActions)}
            variant="outline"
            size="sm"
            className="border-gray-500/30"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          {showActions && (
            <div className="absolute right-0 top-8 bg-gray-800 border border-gray-600/30 rounded-lg shadow-lg z-10 min-w-[120px]">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-0 hover:bg-gray-700"
                onClick={() => {
                  // TODO: Implement edit functionality
                  setShowActions(false);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-0 hover:bg-red-600/20 text-red-400"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {ritual.description && (
        <p className="text-gray-300 mb-4">{ritual.description}</p>
      )}

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">
          Created {new Date(ritual.createdAt).toLocaleDateString()}
        </span>
        <div className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${
          ritual.isActive 
            ? 'bg-green-500/20 border-green-500/30 text-green-400' 
            : 'bg-gray-500/20 border-gray-500/30 text-gray-400'
        }`}>
          {ritual.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>
    </div>
  );
}
