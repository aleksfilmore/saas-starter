'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  CheckCircle, 
  Clock, 
  Mic, 
  MicOff, 
  Save, 
  SkipForward,
  BookOpen,
  Heart,
  Timer,
  Award
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

interface JournalModalProps {
  isOpen: boolean
  onClose: () => void
  ritualCode: string
  ritualTitle: string
  onSaved?: (entry: any) => void
}

export function JournalModal({ 
  isOpen, 
  onClose, 
  ritualCode, 
  ritualTitle,
  onSaved 
}: JournalModalProps) {
  const { user, refetchUser } = useAuth()
  const [mood, setMood] = useState<number>(4) // Default to middle (4/7)
  const [whatIDid, setWhatIDid] = useState('')
  const [howIFeel, setHowIFeel] = useState('')
  const [tags, setTags] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingField, setRecordingField] = useState<'whatIDid' | 'howIFeel' | null>(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [canSkip, setCanSkip] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [savedEntry, setSavedEntry] = useState<any>(null)

  const isPremium = user?.subscriptionTier === 'premium'
  const minTimeSpent = 20 // seconds
  const minTextLength = 20 // characters

  // Timer effect
  useEffect(() => {
    if (!isOpen) return

    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setMood(4)
      setWhatIDid('')
      setHowIFeel('')
      setTags('')
      setTimeSpent(0)
      setShowSuccess(false)
      setSavedEntry(null)
    }
  }, [isOpen])

  const combinedText = `${whatIDid} ${howIFeel}`.trim()
  const textLength = combinedText.length
  const meetsTextCriteria = textLength >= minTextLength
  const meetsTimeCriteria = timeSpent >= minTimeSpent
  const qualifiesForReward = meetsTextCriteria && meetsTimeCriteria

  const handleSpeechToText = async (field: 'whatIDid' | 'howIFeel') => {
    if (!isPremium) return

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsRecording(true)
        setRecordingField(field)
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        if (field === 'whatIDid') {
          setWhatIDid(transcript)
        } else {
          setHowIFeel(transcript)
        }
      }

      recognition.onend = () => {
        setIsRecording(false)
        setRecordingField(null)
      }

      recognition.start()
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/rituals/${ritualCode}/journal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mood,
          whatIDid: whatIDid.trim(),
          howIFeel: howIFeel.trim(),
          tags: isPremium ? tags : null,
          source: 'text',
          timeSpent,
          ritualTitle
        })
      })

      if (response.ok) {
        const result = await response.json()
        setSavedEntry(result)
        setShowSuccess(true)
        
        // Refresh user data to update XP/Bytes
        await refetchUser()
        
        // Notify parent component
        if (onSaved) {
          onSaved(result.entry)
        }

        // Auto-close after showing success
        setTimeout(() => {
          onClose()
        }, 2500)
      } else {
        const error = await response.json()
        alert(`Failed to save journal entry: ${error.error}`)
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save journal entry. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSkip = () => {
    // Allow one skip per day without XP penalty for free users
    onClose()
  }

  const getMoodLabel = (value: number) => {
    const labels = ['😢', '😔', '😐', '🙂', '😊', '😄', '🤗']
    return labels[value - 1] || '😐'
  }

  if (showSuccess && savedEntry) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-gray-900 border-gray-700">
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>
            
            <h3 className="text-xl font-bold text-white mb-2">
              Journal Saved!
            </h3>
            
            <p className="text-gray-300 mb-4">
              Your ritual reflection has been recorded
            </p>

            {savedEntry.qualifiesForReward && (
              <div className="flex items-center justify-center gap-4 mb-4">
                <Badge className="bg-purple-600 text-white">
                  +{savedEntry.xpAwarded} XP
                </Badge>
                <Badge className="bg-blue-600 text-white">
                  +{savedEntry.bytesAwarded} Bytes
                </Badge>
              </div>
            )}

            <div className="text-sm text-gray-400">
              Time spent: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Ritual Journal: {ritualTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          
          {/* Progress & Timer */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">
                    Time: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {qualifiesForReward ? (
                    <Badge className="bg-green-600 text-white">
                      <Award className="w-3 h-3 mr-1" />
                      XP Ready
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-gray-600 text-gray-400">
                      {!meetsTimeCriteria && `${minTimeSpent - timeSpent}s to XP`}
                      {!meetsTextCriteria && meetsTimeCriteria && `${minTextLength - textLength} chars to XP`}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="mt-2 text-xs text-gray-400">
                Need {minTimeSpent}s + {minTextLength} characters for XP/Bytes
              </div>
            </CardContent>
          </Card>

          {/* Mood Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white">
              How do you feel right now? {getMoodLabel(mood)}
            </label>
            <div className="flex gap-2 justify-between">
              {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                <button
                  key={value}
                  onClick={() => setMood(value)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
                    mood === value 
                      ? 'bg-purple-600 scale-110' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {getMoodLabel(value)}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Terrible</span>
              <span>Neutral</span>
              <span>Amazing</span>
            </div>
          </div>

          {/* What I Did */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">
                What did you do? ✨
              </label>
              {isPremium && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSpeechToText('whatIDid')}
                  disabled={isRecording}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {isRecording && recordingField === 'whatIDid' ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
            <Textarea
              value={whatIDid}
              onChange={(e) => setWhatIDid(e.target.value)}
              placeholder="Describe how you performed this ritual..."
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              rows={3}
            />
          </div>

          {/* How I Feel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">
                How do you feel after? 💭
              </label>
              {isPremium && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSpeechToText('howIFeel')}
                  disabled={isRecording}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {isRecording && recordingField === 'howIFeel' ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
            <Textarea
              value={howIFeel}
              onChange={(e) => setHowIFeel(e.target.value)}
              placeholder="How has this ritual affected your state of mind?"
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              rows={3}
            />
          </div>

          {/* Tags (Premium only) */}
          {isPremium && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Tags 🏷️ <span className="text-blue-400">(Premium)</span>
              </label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="anxiety, boundary, sleep, stress..."
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
              <div className="text-xs text-gray-400">
                Separate tags with commas. These help with AI insights.
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving || (!whatIDid.trim() && !howIFeel.trim())}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Journal
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleSkip}
              className="border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
              disabled={isSaving}
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Skip
            </Button>
          </div>

          <div className="text-xs text-gray-400 text-center">
            Journal entries are private and only visible to you
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
