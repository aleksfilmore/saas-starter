"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Brain, Heart, Users, Target, CheckCircle, ArrowRight } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: {
    text: string;
    value: string;
    style: 'anxious' | 'avoidant' | 'secure' | 'disorganized';
  }[];
}

const questions: Question[] = [
  {
    id: "conflict_response",
    question: "When there's conflict in your relationship, you usually:",
    options: [
      { text: "Need immediate reassurance and fear they'll leave", value: "A", style: "anxious" },
      { text: "Shut down and withdraw to protect yourself", value: "B", style: "avoidant" },
      { text: "Try to talk it through calmly and find solutions", value: "C", style: "secure" },
      { text: "Feel overwhelmed and react unpredictably", value: "D", style: "disorganized" }
    ]
  },
  {
    id: "breakup_response",
    question: "After a breakup, your first instinct is to:",
    options: [
      { text: "Desperately try to get them back or seek closure", value: "A", style: "anxious" },
      { text: "Act like you're fine and avoid all reminders", value: "B", style: "avoidant" },
      { text: "Process the emotions and focus on healing", value: "C", style: "secure" },
      { text: "Alternate between chasing and running away", value: "D", style: "disorganized" }
    ]
  },
  {
    id: "intimacy_comfort",
    question: "When someone gets really close to you emotionally:",
    options: [
      { text: "You crave it but worry they'll abandon you", value: "A", style: "anxious" },
      { text: "You feel suffocated and need space", value: "B", style: "avoidant" },
      { text: "You enjoy the connection while maintaining independence", value: "C", style: "secure" },
      { text: "You want it but also fear losing yourself", value: "D", style: "disorganized" }
    ]
  },
  {
    id: "communication_style",
    question: "In relationships, your communication style is:",
    options: [
      { text: "Emotional and seeking constant validation", value: "A", style: "anxious" },
      { text: "Logical and keeping things surface-level", value: "B", style: "avoidant" },
      { text: "Open, honest, and emotionally balanced", value: "C", style: "secure" },
      { text: "Inconsistent - sometimes too much, sometimes nothing", value: "D", style: "disorganized" }
    ]
  },
  {
    id: "self_worth",
    question: "Your sense of self-worth in relationships comes from:",
    options: [
      { text: "How much your partner needs and validates you", value: "A", style: "anxious" },
      { text: "Your independence and self-sufficiency", value: "B", style: "avoidant" },
      { text: "A balance of self-love and healthy connection", value: "C", style: "secure" },
      { text: "It changes drastically based on the relationship", value: "D", style: "disorganized" }
    ]
  }
];

const attachmentStyles = {
  anxious: {
    title: "Anxious Attachment",
    emoji: "💔",
    description: "You crave deep connection but fear abandonment. You give your all but often feel insecure.",
    traits: [
      "Fear of abandonment",
      "Need for constant reassurance", 
      "Emotional intensity",
      "Difficulty with boundaries",
      "Overthinking behaviors"
    ],
    healing: [
      "Self-soothing techniques",
      "Building self-worth independently",
      "Learning secure communication",
      "Emotional regulation skills",
      "Boundary setting practice"
    ],
    color: "from-red-500 to-pink-500",
    borderColor: "border-red-500/50"
  },
  avoidant: {
    title: "Avoidant Attachment", 
    emoji: "🛡️",
    description: "You value independence and often struggle with emotional intimacy and vulnerability.",
    traits: [
      "Fear of losing independence",
      "Difficulty with emotional expression",
      "Tendency to withdraw under stress",
      "Discomfort with neediness",
      "Self-reliance as protection"
    ],
    healing: [
      "Vulnerability practice",
      "Emotional awareness building",
      "Learning to receive support",
      "Intimacy skill development",
      "Communication enhancement"
    ],
    color: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500/50"
  },
  secure: {
    title: "Secure Attachment",
    emoji: "🌟",
    description: "You have a healthy balance of independence and intimacy. You're the relationship goals!",
    traits: [
      "Comfortable with intimacy",
      "Healthy boundaries",
      "Good communication skills", 
      "Emotional stability",
      "Secure sense of self"
    ],
    healing: [
      "Maintaining your strengths",
      "Supporting others' growth",
      "Deepening emotional intelligence",
      "Relationship mentoring",
      "Continued self-development"
    ],
    color: "from-green-500 to-emerald-500",
    borderColor: "border-green-500/50"
  },
  disorganized: {
    title: "Disorganized Attachment",
    emoji: "🌪️", 
    description: "You experience intense but inconsistent patterns. You want love but relationships feel chaotic.",
    traits: [
      "Conflicting relationship desires",
      "Emotional intensity swings",
      "Push-pull dynamics",
      "Difficulty trusting patterns",
      "Complex trauma responses"
    ],
    healing: [
      "Trauma-informed therapy",
      "Emotional regulation training",
      "Consistent self-care routines",
      "Safe relationship practices",
      "Inner child healing work"
    ],
    color: "from-purple-500 to-indigo-500",
    borderColor: "border-purple-500/50"
  }
};

export default function AttachmentQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const router = useRouter();

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateResult = () => {
    const styles = { anxious: 0, avoidant: 0, secure: 0, disorganized: 0 };
    
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === questionId);
      const option = question?.options.find(o => o.value === answer);
      if (option) {
        styles[option.style]++;
      }
    });

    return Object.entries(styles).reduce((a, b) => styles[a[1] as keyof typeof styles] > styles[b[1] as keyof typeof styles] ? a : b)[0] as keyof typeof attachmentStyles;
  };

  const handleSignUpFromResults = () => {
    const style = calculateResult();
    localStorage.setItem('quizResult', JSON.stringify({
      attachmentStyle: style,
      traits: attachmentStyles[style].traits,
      healingPath: attachmentStyles[style].healing,
      completedAt: new Date().toISOString()
    }));
    router.push('/sign-up/from-quiz');
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        
        {/* Header */}
        <header className="w-full border-b border-gray-600/30 bg-gray-800/60 backdrop-blur-xl sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-1 text-2xl font-extrabold tracking-tight text-white">
                <span>CTRL</span>
                <span className="text-gray-400">+</span>
                <span>ALT</span>
                <span className="text-gray-400">+</span>
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BLOCK</span>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="text-white hover:text-purple-400">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
          <div className="max-w-2xl mx-auto text-center">
            
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                🧠 Discover Your Attachment Style
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                Understand your relationship patterns and unlock your personalized healing path
              </p>
              <p className="text-lg text-purple-400">
                Free • 2 minutes • Get instant insights
              </p>
            </div>

            <Card className="bg-gray-800/90 border border-gray-600/50 backdrop-blur-xl mb-8">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl mb-2">💔</div>
                    <div className="text-sm text-purple-400 font-medium">Anxious</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🛡️</div>
                    <div className="text-sm text-blue-400 font-medium">Avoidant</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🌟</div>
                    <div className="text-sm text-green-400 font-medium">Secure</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🌪️</div>
                    <div className="text-sm text-indigo-400 font-medium">Disorganized</div>
                  </div>
                </div>

                <div className="space-y-4 text-left">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">Identify your core relationship patterns</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">Get personalized healing strategies</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">Unlock your emotional transformation roadmap</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={() => setQuizStarted(true)}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 text-xl border-0"
            >
              <Brain className="h-6 w-6 mr-3" />
              Start Your Discovery
            </Button>

            <p className="text-sm text-gray-400 mt-4">
              No email required • Completely free • Join 50,000+ people who've discovered their style
            </p>

          </div>
        </div>

      </div>
    );
  }

  if (showResults) {
    const resultStyle = calculateResult();
    const result = attachmentStyles[resultStyle];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
        
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              Your Results Are In! {result.emoji}
            </h1>
            <p className="text-xl text-purple-400">
              Based on your responses, here's your attachment style and healing path
            </p>
          </div>

          {/* Results */}
          <Card className={`bg-gray-800/90 border ${result.borderColor} backdrop-blur-xl mb-8`}>
            <CardHeader>
              <CardTitle className={`text-white text-3xl flex items-center bg-gradient-to-r ${result.color} bg-clip-text text-transparent`}>
                {result.emoji} {result.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-xl text-gray-300 leading-relaxed">
                {result.description}
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-red-400" />
                    Your Patterns
                  </h3>
                  <ul className="space-y-2">
                    {result.traits.map((trait, index) => (
                      <li key={index} className="text-gray-300 flex items-start">
                        <span className="text-red-400 mr-2">•</span>
                        {trait}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-green-400" />
                    Your Healing Path
                  </h3>
                  <ul className="space-y-2">
                    {result.healing.map((step, index) => (
                      <li key={index} className="text-gray-300 flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center space-y-6">
            <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/50">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to Transform These Patterns?
                </h2>
                <p className="text-xl text-gray-300 mb-6">
                  Get a personalized healing plan, AI therapy sessions, and join thousands on their journey
                </p>
                <Button 
                  onClick={handleSignUpFromResults}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 text-xl border-0 mr-4"
                >
                  Start My Healing Journey
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button 
                  onClick={() => router.push('/')}
                  variant="outline"
                  size="lg"
                  className="border-gray-500 text-gray-300 hover:bg-gray-700"
                >
                  Learn More First
                </Button>
              </CardContent>
            </Card>

            <p className="text-sm text-gray-400">
              🔒 Your results are saved. Continue anytime. • Free account setup • No credit card required
            </p>
          </div>

        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
      
      <div className="max-w-2xl mx-auto">
        
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-medium">Question {currentQuestion + 1} of {questions.length}</p>
            <p className="text-gray-400">{Math.round(progress)}% complete</p>
          </div>
          <Progress value={progress} className="h-2 bg-gray-700" />
        </div>

        {/* Question */}
        <Card className="bg-gray-800/90 border border-gray-600/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white text-2xl leading-relaxed">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {question.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(question.id, option.value)}
                variant="outline"
                className="w-full p-6 text-left h-auto border-gray-600 hover:border-purple-500 hover:bg-purple-500/10 text-white justify-start"
              >
                <span className="text-lg">{option.text}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Back button */}
        <div className="mt-6 text-center">
          <Button 
            variant="ghost" 
            onClick={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(prev => prev - 1);
              } else {
                setQuizStarted(false);
              }
            }}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentQuestion > 0 ? 'Previous Question' : 'Back to Start'}
          </Button>
        </div>

      </div>
    </div>
  );
}
