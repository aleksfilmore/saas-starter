'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  assignTodaysPrescribedRitual, 
  shufflePrescribedRitual, 
  completePrescribedRitual, 
  undoRitualCompletion 
} from '../prescribed-actions';
import { getRitualByKey, getCategoryColor, getCategoryIcon, type PrescribedRitual } from '@/lib/prescribed-rituals';

interface PrescribedRitualCardProps {
  initialPrescription?: {
    id: string;
    ritualKey: string;
    shufflesUsed: number;
    isCompleted: boolean;
    completedAt: Date | null;
    mood: number | null;
    notes: string | null;
    prescribedDate: Date;
  } | null;
}

export function PrescribedRitualCard({ initialPrescription }: PrescribedRitualCardProps) {
  const [prescription, setPrescription] = useState(initialPrescription);
  const [ritual, setRitual] = useState<PrescribedRitual | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [mood, setMood] = useState<'terrible' | 'rough' | 'okay' | 'good' | 'amazing'>('okay');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (prescription?.ritualKey) {
      const ritualData = getRitualByKey(prescription.ritualKey);
      setRitual(ritualData || null);
    }
  }, [prescription?.ritualKey]);

  const handleAssignRitual = async () => {
    setIsLoading(true);
    try {
      // Temporarily disabled due to schema mismatch
      console.log('Prescribed rituals functionality is temporarily disabled');
      // toast.error('Prescribed rituals are being updated. Please try again later.');
    } catch (error) {
      console.error('Error:', error);
      // toast.error('Failed to assign ritual. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShuffle = async () => {
    if (!prescription) return;
    
    setIsLoading(true);
    try {
      // Temporarily disabled due to schema mismatch
      console.log('Shuffle functionality is temporarily disabled');
      // toast.error('Shuffle functionality is being updated. Please try again later.');
    } catch (error) {
      // toast.error(error instanceof Error ? error.message : 'Failed to shuffle ritual');
      console.error('Failed to shuffle ritual:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Temporarily disabled due to schema mismatch
      console.log('Complete ritual functionality is temporarily disabled');
      // toast.error('Complete ritual functionality is being updated. Please try again later.');
    } catch (error) {
      // toast.error(error instanceof Error ? error.message : 'Failed to complete ritual');
      console.error('Failed to complete ritual:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndo = async () => {
    setIsLoading(true);
    try {
      // Temporarily disabled due to schema mismatch
      console.log('Undo ritual functionality is temporarily disabled');
      // toast.error('Undo functionality is being updated. Please try again later.');
    } catch (error) {
      // toast.error(error instanceof Error ? error.message : 'Failed to undo completion');
      console.error('Failed to undo completion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!prescription || !ritual) {
    return (
      <Card className="p-6 bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center text-2xl">
              🌀
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Ready for Today's Ritual?
          </h3>
          <p className="text-gray-400 mb-6">
            Get your daily prescribed ritual - curated specifically for heartbreak reprogramming.
          </p>
          <Button 
            onClick={handleAssignRitual}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {isLoading ? 'Assigning...' : 'Get Today\'s Ritual'}
          </Button>
        </div>
      </Card>
    );
  }

  const shufflesRemaining = 2 - prescription.shufflesUsed;
  const canShuffle = shufflesRemaining > 0 && !prescription.isCompleted;

  return (
    <Card className="p-6 bg-gray-900/50 border-gray-800 backdrop-blur-sm">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getCategoryIcon(ritual.category)}</span>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Today's Prescribed Ritual
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(ritual.category)} uppercase font-mono`}>
                {ritual.category.replace('_', ' ')}
              </span>
            </div>
          </div>
          
          {prescription.isCompleted && (
            <div className="flex items-center space-x-2">
              <span className="text-green-400 text-sm font-medium">✓ Completed</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                disabled={isLoading}
                className="text-gray-400 hover:text-white"
              >
                Undo
              </Button>
            </div>
          )}
        </div>

        {/* Ritual Content */}
        <div className="space-y-3">
          <h4 className="text-xl font-bold text-white">{ritual.title}</h4>
          <p className="text-gray-300">{ritual.description}</p>
          
          <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
            <h5 className="font-semibold text-white">Instructions:</h5>
            <p className="text-gray-300 text-sm">{ritual.instructions}</p>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <h5 className="font-semibold text-blue-400 text-sm">Expected Outcome:</h5>
            <p className="text-blue-300 text-sm">{ritual.expectedOutcome}</p>
          </div>

          {/* Intensity Meter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Intensity:</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-2 h-4 rounded-sm ${
                    level <= ritual.intensity 
                      ? level <= 2 
                        ? 'bg-green-500' 
                        : level <= 3 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        {!prescription.isCompleted && (
          <div className="flex justify-between items-center pt-4 border-t border-gray-700">
            <div className="flex space-x-2">
              {canShuffle && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShuffle}
                  disabled={isLoading}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  🎲 Shuffle ({shufflesRemaining} left)
                </Button>
              )}
            </div>

            <Button
              onClick={() => setShowCompletionForm(true)}
              disabled={isLoading}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
            >
              Mark Complete
            </Button>
          </div>
        )}

        {/* Completion Form */}
        {showCompletionForm && (
          <div className="bg-gray-800/50 rounded-lg p-4 space-y-4 border border-gray-700">
            <h5 className="font-semibold text-white">How did it go?</h5>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Mood after completion:</label>
              <div className="flex space-x-2">
                {(['terrible', 'rough', 'okay', 'good', 'amazing'] as const).map((moodOption) => (
                  <button
                    key={moodOption}
                    onClick={() => setMood(moodOption)}
                    className={`px-3 py-1 text-xs rounded-full border ${
                      mood === moodOption
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {moodOption}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Notes (optional):</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did this ritual feel? Any insights?"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm resize-none"
                rows={2}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCompletionForm(false)}
                className="text-gray-400"
              >
                Cancel
              </Button>
              <Button
                onClick={handleComplete}
                disabled={isLoading}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? 'Saving...' : 'Complete Ritual'}
              </Button>
            </div>
          </div>
        )}

        {/* Completion Summary */}
        {prescription.isCompleted && prescription.completedAt && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-400 text-sm font-medium">
                  Completed on {new Date(prescription.completedAt).toLocaleDateString()}
                </p>
                {prescription.mood && (
                  <p className="text-green-300 text-sm">
                    Mood: {['', 'terrible', 'rough', 'okay', 'good', 'amazing'][prescription.mood]}
                  </p>
                )}
                {prescription.notes && (
                  <p className="text-green-300 text-sm mt-1">{prescription.notes}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
