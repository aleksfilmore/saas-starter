"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  Zap, 
  Shield, 
  Ghost, 
  Target,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

interface QuizQuestion {
  id: number
  question: string
  options: {
    text: string
    archetype: 'flooder' | 'firewall' | 'ghost' | 'secure'
  }[]
}

interface ArchetypeResult {
  id: 'flooder' | 'firewall' | 'ghost' | 'secure'
  name: string
  tagline: string
  description: string
  icon: React.ReactNode
  color: string
  bgColor: string
  traits: string[]
  ritualFocus: string[]
  aiPersona: string
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "When someone you like leaves your last message on \"seen\" for hours, you...",
    options: [
      { text: "Spam them with memes so they have to respond.", archetype: 'flooder' },
      { text: "Pretend you're busy living your best life.", archetype: 'firewall' },
      { text: "Type a reply, delete it, repeat.", archetype: 'ghost' },
      { text: "Toss the phone and get on with your day.", archetype: 'secure' }
    ]
  },
  {
    id: 2,
    question: "New crush talks about \"taking things slow.\" You...",
    options: [
      { text: "Plan your future pets by midnight.", archetype: 'flooder' },
      { text: "Say \"cool\" and mentally pencil in an exit route.", archetype: 'firewall' },
      { text: "Agree, then panic-scroll their socials.", archetype: 'ghost' },
      { text: "Nod, set a calendar reminder, move on.", archetype: 'secure' }
    ]
  },
  {
    id: 3,
    question: "They cancel a date last minute. Your first thought?",
    options: [
      { text: "\"What did I do wrong?!\"", archetype: 'flooder' },
      { text: "\"Knew it—freedom preserved.\"", archetype: 'firewall' },
      { text: "\"Everything is doomed.\"", archetype: 'ghost' },
      { text: "\"Stuff happens, we'll reschedule.\"", archetype: 'secure' }
    ]
  },
  {
    id: 4,
    question: "Ambiguous text: \"We need to talk.\" You...",
    options: [
      { text: "Rapid-fire questions until clarity arrives.", archetype: 'flooder' },
      { text: "Mute the chat—deal with it later.", archetype: 'firewall' },
      { text: "Freeze, imagine every outcome, none good.", archetype: 'ghost' },
      { text: "Ask what's up and wait.", archetype: 'secure' }
    ]
  },
  {
    id: 5,
    question: "Partner asks for a spontaneous weekend trip. You...",
    options: [
      { text: "Scream \"YES!\" before details.", archetype: 'flooder' },
      { text: "Suggest separate rooms—just in case.", archetype: 'firewall' },
      { text: "Want to go—but fear something will go wrong.", archetype: 'ghost' },
      { text: "Check schedule, book, done.", archetype: 'secure' }
    ]
  },
  {
    id: 6,
    question: "When you start catching serious feelings, you...",
    options: [
      { text: "Overshare your childhood trauma by date #3.", archetype: 'flooder' },
      { text: "Keep conversations light—feelings on lockdown.", archetype: 'firewall' },
      { text: "Alternate between love-bombing and disappearing.", archetype: 'ghost' },
      { text: "Share, but at a normal human pace.", archetype: 'secure' }
    ]
  },
  {
    id: 7,
    question: "Conflict pops up. Your go-to move?",
    options: [
      { text: "Fix it NOW, even at 2 a.m.", archetype: 'flooder' },
      { text: "Space out—texts on read for days.", archetype: 'firewall' },
      { text: "Swing between apologies and accusations.", archetype: 'ghost' },
      { text: "Discuss, cool down, revisit if needed.", archetype: 'secure' }
    ]
  },
  {
    id: 8,
    question: "Break-up day one. Instinct?",
    options: [
      { text: "Draft a 2,000-word closure email.", archetype: 'flooder' },
      { text: "Delete every trace—nap like a champ.", archetype: 'firewall' },
      { text: "Block/unblock/block, cry-DM, repeat.", archetype: 'ghost' },
      { text: "Journal, call a friend, take a walk.", archetype: 'secure' }
    ]
  }
]

const archetypeResults: ArchetypeResult[] = [
  {
    id: 'flooder',
    name: 'The Data Flooder',
    tagline: '"If you don\'t reply in 3 min I\'ll ping the mainframe."',
    description: 'System scan complete: you broadcast love on every frequency. Downside? You short-circuit when the signal drops. Your protocol will teach throttling—less spam, more self-bandwidth.',
    icon: <Zap className="h-8 w-8" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    traits: ['High emotional investment', 'Fear of abandonment', 'Seeks constant reassurance', 'Tends to overwhelm'],
    ritualFocus: ['Soft Reset rituals', 'Reframe Loop exercises', 'Boundary setting'],
    aiPersona: 'Soft Ghost (reassuring & grounding)'
  },
  {
    id: 'firewall',
    name: 'The Firewall Builder',
    tagline: '"Feelings? Cool story—blocked at the port."',
    description: 'Scan says you build walls faster than you build trust. Good news: firewalls keep viruses out. Bad news: they keep updates out too. Your protocol leans on controlled port-opening exercises.',
    icon: <Shield className="h-8 w-8" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    traits: ['Highly independent', 'Discomfort with vulnerability', 'Values self-reliance', 'Avoids emotional intensity'],
    ritualFocus: ['Glow-Up Forge', 'Ghost Cleanse', 'Vulnerability practices'],
    aiPersona: 'Brutal Saint (direct & truth-telling)'
  },
  {
    id: 'ghost',
    name: 'The Ghost in the Shell',
    tagline: '"Come closer… NOW LEAVE."',
    description: 'Diagnostics detect a push-pull loop: come closer / begone. It\'s whiplash coding. Your protocol focuses on stable pings and crash-recovery scripts.',
    icon: <Ghost className="h-8 w-8" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    traits: ['Wants intimacy but fears it', 'Mixed signals', 'Emotional whiplash', 'Approach-avoidance pattern'],
    ritualFocus: ['Balanced ritual mix', 'Emergency protocols', 'Consistency building'],
    aiPersona: 'Void Analyst (balanced compassion & call-outs)'
  },
  {
    id: 'secure',
    name: 'The Secure Node',
    tagline: '"Systems online, no panic packets detected."',
    description: 'Stable connection detected. Congrats—you\'re the rare bug-free build. Your protocol amps growth, mentors the glitchier users, and protects your uptime.',
    icon: <Target className="h-8 w-8" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    traits: ['Emotionally stable', 'Good communication', 'Handles conflict well', 'Comfortable with intimacy'],
    ritualFocus: ['Advanced Cult Missions', 'Leadership roles', 'Mentoring others'],
    aiPersona: 'Petty Prophet (growth & maintenance)'
  }
]

interface EmotionalSystemCheckProps {
  onComplete: (archetype: ArchetypeResult) => void
}

export default function EmotionalSystemCheck({ onComplete }: EmotionalSystemCheckProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<ArchetypeResult | null>(null)

  const handleAnswer = (archetype: string) => {
    const newAnswers = [...answers, archetype]
    setAnswers(newAnswers)

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate result
      const scores = {
        flooder: 0,
        firewall: 0,
        ghost: 0,
        secure: 0
      }

      newAnswers.forEach(answer => {
        scores[answer as keyof typeof scores]++
      })

      const topArchetype = Object.entries(scores).reduce((a, b) => 
        scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
      )[0] as 'flooder' | 'firewall' | 'ghost' | 'secure'

      const archetypeResult = archetypeResults.find(a => a.id === topArchetype)!
      setResult(archetypeResult)
      setShowResult(true)
    }
  }

  const progressPercentage = ((currentQuestion + 1) / quizQuestions.length) * 100

  if (showResult && result) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="bg-white border-2 border-purple-200 shadow-lg">
          <CardHeader className="text-center">
            <div className={`${result.color} mx-auto mb-4`}>
              {result.icon}
            </div>
            <CardTitle className="text-2xl text-gray-800">
              {result.name}
            </CardTitle>
            <CardDescription className="text-lg italic text-gray-600">
              {result.tagline}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-700 leading-relaxed">
                {result.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-gray-800">Core Traits</h4>
                <ul className="space-y-2">
                  {result.traits.map((trait, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700">{trait}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-gray-800">Ritual Focus Areas</h4>
                <ul className="space-y-2">
                  {result.ritualFocus.map((focus, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <Brain className="h-4 w-4 text-purple-500" />
                      <span className="text-gray-700">{focus}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold mb-2 text-gray-800">Your AI Therapy Persona</h4>
              <p className="text-sm text-gray-600">{result.aiPersona}</p>
            </div>

            <div className="text-center">
              <Button 
                onClick={() => onComplete(result)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                size="lg"
              >
                Begin My Healing Protocol
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = quizQuestions[currentQuestion]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Emotional System Check
        </h1>
        <p className="text-gray-600">
          Before we configure your healing protocol, the system needs to scan for vulnerabilities.
        </p>
        <p className="text-sm text-gray-500 italic">
          Answer with brutal honesty—your protocol depends on it.
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
          <span>{Math.round(progressPercentage)}% complete</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Question */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start h-auto p-4 hover:bg-purple-50"
                onClick={() => handleAnswer(option.archetype)}
              >
                <div className="text-wrap">{option.text}</div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Visual Indicators */}
      <div className="flex justify-center space-x-2">
        {quizQuestions.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index < currentQuestion 
                ? 'bg-green-500' 
                : index === currentQuestion 
                ? 'bg-purple-500' 
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
