"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { 
  CheckCircle, 
  Star, 
  Zap, 
  Camera, 
  Send,
  X,
  Sparkles,
  Trophy,
  Clock,
  Heart
} from 'lucide-react'
import { type Ritual } from '@/lib/rituals/ritual-bank'

interface RitualCompletionModalProps {
  ritual: Ritual
  isOpen: boolean
  onClose: () => void
  onComplete: (proof?: string) => void
}

export default function RitualCompletionModal({ 
  ritual, 
  isOpen, 
  onClose, 
  onComplete 
}: RitualCompletionModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [proof, setProof] = useState('')
  const [showProofOption, setShowProofOption] = useState(false)
  const [celebrationActive, setCelebrationActive] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0)
      setIsCompleted(false)
      setProof('')
      setShowProofOption(false)
      setCelebrationActive(false)
    }
  }, [isOpen])

  const handleStepComplete = () => {
    if (currentStep < ritual.instructions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsCompleted(true)
      setShowProofOption(true)
    }
  }

  const handleRitualComplete = () => {
    setCelebrationActive(true)
    onComplete(proof || undefined)
    
    // Auto-close after celebration
    setTimeout(() => {
      onClose()
    }, 4000)
  }

  const getEmotionalToneColor = (tone: string) => {
    switch (tone) {
      case 'rage': return 'text-red-500 bg-red-50 border-red-200'
      case 'grief': return 'text-blue-500 bg-blue-50 border-blue-200'
      case 'spite': return 'text-orange-500 bg-orange-50 border-orange-200'
      case 'softness': return 'text-green-500 bg-green-50 border-green-200'
      default: return 'text-gray-500 bg-gray-50 border-gray-200'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {celebrationActive ? (
          // Celebration Screen
          <div className="p-8 text-center bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="animate-bounce mb-6">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <Sparkles className="h-8 w-8 text-purple-500 mx-auto" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Ritual Complete! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              You've successfully completed "{ritual.title}"
            </p>
            <div className="flex justify-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-blue-500" />
                <span className="font-bold text-lg">+{ritual.byteReward} Bytes</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 animate-pulse">
              Your healing journey continues...
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {ritual.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{ritual.description}</p>
                  <div className="flex items-center space-x-3">
                    <Badge className={getEmotionalToneColor(ritual.emotionalTone)}>
                      {ritual.emotionalTone}
                    </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{ritual.estimatedTime}</span>
                    </Badge>
                    <Badge variant="outline">
                      Difficulty: {ritual.difficultyLevel}/5
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Ritual Progress</span>
                <span className="text-sm text-gray-500">
                  Step {currentStep + 1} of {ritual.instructions.length}
                </span>
              </div>
              <Progress 
                value={((currentStep + 1) / ritual.instructions.length) * 100} 
                className="h-2"
              />
            </div>

            {/* Content Area */}
            <div className="p-6 flex-1 overflow-y-auto">
              {!isCompleted ? (
                // Instruction Steps
                <div className="space-y-6">
                  <Card className="border-2 border-purple-200">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {currentStep + 1}
                        </div>
                        <span>Current Step</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg leading-relaxed text-gray-700">
                        {ritual.instructions[currentStep]}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Previous steps summary */}
                  {currentStep > 0 && (
                    <Card className="bg-green-50 border-green-200">
                      <CardHeader>
                        <CardTitle className="text-green-800 text-sm">
                          Completed Steps
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {ritual.instructions.slice(0, currentStep).map((step, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-green-700">Step {index + 1}: Completed</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Next steps preview */}
                  {currentStep < ritual.instructions.length - 1 && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-blue-800 text-sm">
                          Upcoming Steps
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          {ritual.instructions.slice(currentStep + 1, currentStep + 3).map((step, index) => (
                            <p key={index} className="text-sm text-blue-700 truncate">
                              Step {currentStep + index + 2}: {step.substring(0, 60)}...
                            </p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                // Completion Interface
                <div className="space-y-6">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-6 text-center">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-green-800 mb-2">
                        All Steps Completed!
                      </h3>
                      <p className="text-green-700">
                        You've walked through the entire "{ritual.title}" ritual
                      </p>
                    </CardContent>
                  </Card>

                  {showProofOption && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Camera className="h-5 w-5" />
                          <span>Optional: Share Your Experience</span>
                        </CardTitle>
                        <CardDescription>
                          Document your journey or share insights from this ritual
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="How did this ritual feel? What did you discover? Any insights to share? (Optional)"
                          value={proof}
                          onChange={(e) => setProof(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          This will be saved privately to your ritual journal
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-purple-800">Ritual Rewards</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="flex items-center space-x-1 text-sm">
                              <Star className="h-4 w-4 text-blue-500" />
                              <span className="font-bold">+{ritual.byteReward} Bytes</span>
                            </span>
                          </div>
                        </div>
                        <Heart className="h-8 w-8 text-red-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between space-x-4">
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="flex-1"
                >
                  Exit Ritual
                </Button>
                
                {!isCompleted ? (
                  <Button 
                    onClick={handleStepComplete}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    {currentStep < ritual.instructions.length - 1 ? (
                      <>Next Step</>
                    ) : (
                      <>Complete Step</>
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleRitualComplete}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Complete Ritual
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
