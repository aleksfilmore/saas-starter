'use client';

import { useState } from 'react';
import { endNoContactPeriod, recordBreach } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Clock, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Phone, 
  MessageCircle, 
  Users, 
  MapPin,
  MoreHorizontal,
  Plus
} from 'lucide-react';

interface Period {
  id: string;
  contactName: string;
  startDate: Date;
  targetDays: number;
  isActive: boolean;
  createdAt: Date;
}

interface PeriodCardProps {
  period: Period;
}

export function PeriodCard({ period }: PeriodCardProps) {
  const [showBreachForm, setShowBreachForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const daysSinceStart = Math.floor(
    (new Date().getTime() - new Date(period.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const progress = Math.min((daysSinceStart / period.targetDays) * 100, 100);
  const isCompleted = daysSinceStart >= period.targetDays;

  async function handleEndPeriod() {
    setIsSubmitting(true);
    try {
      await endNoContactPeriod(period.id);
    } catch (error) {
      console.error('Failed to end period:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRecordBreach(formData: FormData) {
    setIsSubmitting(true);
    try {
      formData.append('periodId', period.id);
      await recordBreach(formData);
      setShowBreachForm(false);
    } catch (error) {
      console.error('Failed to record breach:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const breachTypes = [
    { value: 'call', label: 'Phone Call', icon: Phone },
    { value: 'text', label: 'Text Message', icon: MessageCircle },
    { value: 'social_media', label: 'Social Media', icon: Users },
    { value: 'in_person', label: 'In Person', icon: MapPin },
    { value: 'other', label: 'Other', icon: MoreHorizontal },
  ];

  return (
    <div className={`bg-gray-900/50 border rounded-xl p-6 ${
      period.isActive 
        ? 'border-cyan-500/20' 
        : 'border-gray-600/20'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">{period.contactName}</h3>
          <div className="flex items-center gap-2 text-sm text-cyan-100/70">
            <Calendar className="h-4 w-4" />
            Started {new Date(period.startDate).toLocaleDateString()}
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          period.isActive
            ? isCompleted
              ? 'bg-green-500/20 border border-green-500/30 text-green-400'
              : 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400'
            : 'bg-gray-500/20 border border-gray-500/30 text-gray-400'
        }`}>
          {period.isActive 
            ? isCompleted ? 'Goal Reached!' : 'Active'
            : 'Completed'
          }
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-cyan-100/70">Progress</span>
          </div>
          <span className="text-sm font-medium text-white">
            {daysSinceStart} / {period.targetDays} days
          </span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isCompleted ? 'bg-green-500' : 'bg-cyan-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-cyan-100/50">
          {isCompleted 
            ? `🎉 Congratulations! You've reached your ${period.targetDays}-day goal!`
            : `${period.targetDays - daysSinceStart} days remaining`
          }
        </p>
      </div>

      {/* Actions */}
      {period.isActive && (
        <div className="space-y-3">
          {!showBreachForm ? (
            <div className="flex gap-2">
              <Button
                onClick={() => setShowBreachForm(true)}
                variant="outline"
                size="sm"
                className="flex-1 border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Record Breach
              </Button>
              {isCompleted && (
                <Button
                  onClick={handleEndPeriod}
                  disabled={isSubmitting}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete
                </Button>
              )}
            </div>
          ) : (
            <form action={handleRecordBreach} className="space-y-3 p-4 bg-gray-800/50 rounded-lg border border-orange-500/20">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-orange-400">Record Breach</h4>
                <Button
                  type="button"
                  onClick={() => setShowBreachForm(false)}
                  variant="outline"
                  size="sm"
                  className="border-gray-500/30"
                >
                  Cancel
                </Button>
              </div>
              
              <div>
                <Label className="text-sm text-gray-300 mb-2 block">Breach Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {breachTypes.map((type) => (
                    <label key={type.value} className="flex items-center gap-2 p-2 border border-gray-600/30 rounded-lg hover:bg-gray-700/30 cursor-pointer">
                      <input
                        type="radio"
                        name="breachType"
                        value={type.value}
                        required
                        className="text-cyan-500"
                      />
                      <type.icon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-300">{type.label}</span>
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
                  placeholder="What happened? How are you feeling?"
                  className="bg-gray-700/50 border-gray-600/30 text-white placeholder:text-gray-400"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Recording...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Record Breach
                  </div>
                )}
              </Button>
            </form>
          )}
        </div>
      )}

      {/* Completed Badge */}
      {!period.isActive && (
        <div className="text-center py-2">
          <div className="inline-flex items-center gap-2 text-sm text-gray-400">
            <CheckCircle className="h-4 w-4" />
            Period completed
          </div>
        </div>
      )}
    </div>
  );
}
