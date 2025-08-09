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
    id: "q1_no_text_back",
    question: "When someone you're dating doesn't text back for hours, what's your first mental tab that opens?",
    options: [
      { text: "'They're probably losing interest, and I need to fix it now.'", value: "A", style: "anxious" },
      { text: "'They must be busy. I'll focus on my own stuff until they reply.'", value: "B", style: "secure" },
      { text: "'I should pull back before they pull away.'", value: "C", style: "avoidant" },
      { text: "'It's fine… but I'm also drafting an exit plan just in case.'", value: "D", style: "disorganized" }
    ]
  },
  {
    id: "q2_cancelled_plans",
    question: "Imagine your partner cancels plans last-minute. How do you process it?",
    options: [
      { text: "'I feel hurt and start wondering what I did wrong.'", value: "A", style: "anxious" },
      { text: "'I'm annoyed, but it's not the end of the world.'", value: "B", style: "secure" },
      { text: "'That's why I keep my walls up.'", value: "C", style: "avoidant" },
      { text: "'I act like it's fine, but deep down I'm bracing for a breakup.'", value: "D", style: "disorganized" }
    ]
  },
  {
    id: "q3_unstable_relationship", 
    question: "If a relationship starts to feel unstable, what's your autopilot move?",
    options: [
      { text: "Double down with extra closeness to try and save it.", value: "A", style: "anxious" },
      { text: "Give space and hope it evens out on its own.", value: "B", style: "avoidant" },
      { text: "Pull away before I get hurt.", value: "C", style: "avoidant" },
      { text: "Stay open but check in with myself about my needs.", value: "D", style: "secure" }
    ]
  },
  {
    id: "q4_conflict_handling",
    question: "How do you usually handle conflict?",
    options: [
      { text: "Over-explain and try to fix things immediately.", value: "A", style: "anxious" },
      { text: "Shut down until I'm ready to talk.", value: "B", style: "avoidant" },
      { text: "Get defensive, but secretly want reassurance.", value: "C", style: "disorganized" },
      { text: "Discuss it calmly and look for solutions.", value: "D", style: "secure" }
    ]
  },
  {
    id: "q5_independence_request",
    question: "Your partner asks for more independence. What's your gut response?",
    options: [
      { text: "Worry they're slipping away.", value: "A", style: "anxious" },
      { text: "Feel relieved — I like my space.", value: "B", style: "avoidant" },
      { text: "Pretend it's fine, then overthink alone.", value: "C", style: "disorganized" },
      { text: "Respect it and adjust while staying connected.", value: "D", style: "secure" }
    ]
  },
  {
    id: "q6_breakup_first_move",
    question: "A breakup happens. First move?",
    options: [
      { text: "Text them 'just to talk.'", value: "A", style: "anxious" },
      { text: "Delete their number and focus forward.", value: "B", style: "avoidant" },
      { text: "Block them but stalk from a burner.", value: "C", style: "disorganized" },
      { text: "Process it, talk to friends, and give myself space to heal.", value: "D", style: "secure" }
    ]
  },
  {
    id: "q7_relationship_superpower",
    question: "What's your relationship superpower?",
    options: [
      { text: "Picking up on the tiniest shifts in mood.", value: "A", style: "anxious" },
      { text: "Staying independent no matter what.", value: "B", style: "avoidant" },
      { text: "Reading people's energy instantly (but sometimes misjudging it).", value: "C", style: "disorganized" },
      { text: "Communicating needs clearly and kindly.", value: "D", style: "secure" }
    ]
  },
  {
    id: "q8_biggest_fear",
    question: "What's your biggest relationship fear?",
    options: [
      { text: "Being abandoned.", value: "A", style: "anxious" },
      { text: "Being trapped.", value: "B", style: "avoidant" },
      { text: "Wanting closeness but feeling unsafe.", value: "C", style: "disorganized" },
      { text: "Losing myself completely or losing the other person suddenly.", value: "D", style: "secure" }
    ]
  }
];

const attachmentStyles = {
  anxious: {
    title: "Data Flooder",
    subtitle: "(aka 'Anxious-Preoccupied' in therapist-speak)",
    emoji: "💥",
    description: "You broadcast love on every frequency and panic when the signal drops.",
    coreGlitch: "Over-messaging, over-thinking, zero chill",
    primaryFix: "Throttle outreach, amplify self-soothe circuits", 
    firstRitual: "Breathe the Panic Packet Out",
    archColor: "#00E0FF",
    traits: [
      "Emergency reconnection attempts when disconnected",
      "Flood all channels seeking validation", 
      "Panic mode activation on read-without-reply",
      "Over-analysis of every micro-signal",
      "Emotional overflow in high-stress situations"
    ],
    healing: [
      "4-7-8 breathing protocol with calming mantras",
      "Message throttling and pause-before-send training",
      "Self-validation circuit building",
      "Panic packet dissolution techniques",
      "Secure attachment pattern reprogramming"
    ],
    color: "from-cyan-400 to-blue-500",
    borderColor: "border-cyan-500/50"
  },
  avoidant: {
    title: "Firewall Builder", 
    subtitle: "(aka 'Dismissive-Avoidant' in therapist-speak)",
    emoji: "🛡️",
    description: "You build emotional firewalls faster than you build trust.",
    coreGlitch: "Shutdown reflex, intimacy lag",
    primaryFix: "Controlled port-opening, boundary articulation",
    firstRitual: "Heartbeat Handshake",
    archColor: "#FF5E5E",
    traits: [
      "Instant emotional shutdown protocols",
      "Firewall blocks most connection attempts",
      "Surface-level data transmission only",
      "Independence metrics over connection stats",
      "Exit strategy preloaded in every interaction"
    ],
    healing: [
      "Body-scan with single vulnerability prompt",
      "Controlled emotional port-opening exercises",
      "Trust protocol gradual implementation", 
      "Intimacy lag reduction training",
      "Healthy boundary vs. wall distinction practice"
    ],
    color: "from-red-400 to-pink-500",
    borderColor: "border-red-500/50"
  },
  secure: {
    title: "Secure Node",
    subtitle: "(aka 'Secure' in therapist-speak)", 
    emoji: "🔒",
    description: "Congrats, you're the rare bug-free build—mostly.",
    coreGlitch: "Minor update anxiety",
    primaryFix: "Growth tasks, mentor role in community",
    firstRitual: "Glow-Up Blueprint",
    archColor: "#00E88B",
    traits: [
      "Stable baseline with balanced inputs",
      "Secure access protocols with healthy boundaries",
      "Clear authentic signal transmission",
      "Effective stress management subroutines",
      "Growth-oriented rather than survival-focused"
    ],
    healing: [
      "Future-self visualization and goal mapping",
      "Advanced emotional intelligence upgrades",
      "Community mentoring and wisdom sharing",
      "Relationship skill enhancement modules",
      "Leadership development in healing spaces"
    ],
    color: "from-green-400 to-emerald-500",
    borderColor: "border-green-500/50"
  },
  disorganized: {
    title: "Ghost in the Shell",
    subtitle: "(aka 'Fearful-Avoidant' in therapist-speak)",
    emoji: "👻", 
    description: "\"Come closer / begone.\" You're push-pull personified.",
    coreGlitch: "Approach-avoid whiplash",
    primaryFix: "Stabilize threat detector, practice steady contact",
    firstRitual: "Anchored in Ambivalence",
    archColor: "#BF6BF7",
    traits: [
      "Random switching between pursuit and deletion",
      "Permissions flip constantly between allow/deny",
      "Volatile inputs causing system instability",
      "Chaotic mix of intensity and withdrawal",
      "Unpredictable emotional state changes"
    ],
    healing: [
      "Grounding techniques with cognitive-dual writing",
      "Threat detection system recalibration",
      "Steady contact protocol development",
      "Ambivalence acceptance and management",
      "Trauma-informed system stabilization"
    ],
    color: "from-purple-400 to-indigo-500", 
    borderColor: "border-purple-500/50"
  }
};

export default function AttachmentQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [resultStyle, setResultStyle] = useState<keyof typeof attachmentStyles | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const router = useRouter();

  const handleAnswer = async (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setIsCalculating(true);
      const result = await calculateResult();
      setResultStyle(result);
      setIsCalculating(false);
      setShowResults(true);
    }
  };

  const calculateResult = async () => {
    // Use the specification-compliant API scoring
    try {
      const quizAnswers = Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        answer: value
      }));

      const response = await fetch('/api/onboarding/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: quizAnswers })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Map archetype to attachment style for compatibility
        const archetypeToStyle = {
          'df': 'anxious',
          'fb': 'avoidant', 
          'gis': 'disorganized',
          'sn': 'secure'
        } as const;

        return archetypeToStyle[result.archetype as keyof typeof archetypeToStyle] || 'secure';
      }
    } catch (error) {
      console.error('Quiz scoring error:', error);
    }
    
    // Fallback to secure if API fails
    return 'secure' as keyof typeof attachmentStyles;
  };

  const handleSignUpFromResults = async () => {
    if (!resultStyle) return;
    
    localStorage.setItem('quizResult', JSON.stringify({
      attachmentStyle: resultStyle,
      traits: attachmentStyles[resultStyle].traits,
      healingPath: attachmentStyles[resultStyle].healing,
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
            <div className="w-full py-3 sm:py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-1 text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-white">
                <span>CTRL</span>
                <span className="text-gray-400">+</span>
                <span>ALT</span>
                <span className="text-gray-400">+</span>
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BLOCK</span>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="text-white hover:text-purple-400 text-sm sm:text-base p-2 sm:p-3">
                  <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden">Back</span>
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
                <span className="glitch" data-text="SYSTEM SCAN">SYSTEM SCAN</span> v1.0
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                Answer 8 lightning-round prompts. We'll calibrate your daily rituals.
              </p>
              <p className="text-lg text-purple-400">
                No real names. No spam. Just data-driven healing.
              </p>
            </div>

            <Card className="bg-gray-800/90 border border-gray-600/50 backdrop-blur-xl mb-8">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl mb-2">�</div>
                    <div className="text-sm text-cyan-400 font-medium">Data Flooder</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🛡️</div>
                    <div className="text-sm text-red-400 font-medium">Firewall Builder</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">👻</div>
                    <div className="text-sm text-purple-400 font-medium">Ghost in Shell</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🔒</div>
                    <div className="text-sm text-green-400 font-medium">Secure Node</div>
                  </div>
                </div>

                <div className="space-y-4 text-left">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">Scan your emotional operating system</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">Get your personalized breakup protocol</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">Unlock daily ritual queue</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={() => setQuizStarted(true)}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 px-10 text-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Brain className="h-6 w-6 mr-3" />
              Start Free Scan →
            </Button>

            <p className="text-sm text-gray-400 mt-4">
              Not therapy. Pure optimization. • No real names required • Already scanned? <Link href="/sign-in" className="text-purple-400 hover:text-purple-300 underline font-medium">Log in</Link>
            </p>

          </div>
        </div>

      </div>
    );
  }

  if (isCalculating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Profile...</h2>
          <p className="text-purple-400">Using specification-compliant CBT scoring</p>
        </div>
      </div>
    );
  }

  if (showResults && resultStyle) {
    const result = attachmentStyles[resultStyle];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
        
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              SYSTEM SCAN COMPLETE
            </h1>
            <p className="text-xl text-purple-400">
              Your archetype profile has been generated
            </p>
          </div>

          {/* Results */}
          <Card className={`bg-gray-800/90 border ${result.borderColor} backdrop-blur-xl mb-8`}>
            <CardHeader>
              <CardTitle className={`text-white text-3xl flex items-center bg-gradient-to-r ${result.color} bg-clip-text text-transparent`}>
                {result.emoji} Archetype: <span className="ml-2" style={{color: result.archColor}}>{result.title}</span>
              </CardTitle>
              <p className="text-gray-400 text-lg italic">
                {result.subtitle}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="summary bg-gray-700/30 p-6 rounded-lg border border-gray-600/30">
                <p className="text-xl text-gray-300 leading-relaxed mb-4">
                  {result.description}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-3 font-bold">⚡ Core glitch:</span>
                    <span className="text-gray-300">{result.coreGlitch}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3 font-bold">💡 Primary fix:</span>
                    <span className="text-gray-300">{result.primaryFix}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-3 font-bold">🎯 First ritual queued:</span>
                    <span className="text-gray-300">"{result.firstRitual}"</span>
                  </li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-red-400" />
                    System Patterns
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
                    Optimization Protocol
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
                  Save your results to unlock rituals
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-left">
                  <div className="bg-gray-800/40 p-4 rounded-lg">
                    <span className="text-purple-400 font-semibold">• Byte wallet</span>
                    <p className="text-sm text-gray-400 mt-1">Track healing progress</p>
                  </div>
                  <div className="bg-gray-800/40 p-4 rounded-lg">
                    <span className="text-purple-400 font-semibold">• No-contact tracker</span>
                    <p className="text-sm text-gray-400 mt-1">Stay strong together</p>
                  </div>
                  <div className="bg-gray-800/40 p-4 rounded-lg">
                    <span className="text-purple-400 font-semibold">• Voice oracle teaser</span>
                    <p className="text-sm text-gray-400 mt-1">AI therapy preview</p>
                  </div>
                </div>
                <Button 
                  onClick={handleSignUpFromResults}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 text-xl border-0 mr-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Create Account & Reveal Archetype →
                </Button>
                <Button 
                  onClick={() => router.push('/')}
                  variant="outline"
                  size="lg"
                  className="border-gray-500/50 bg-gray-800/40 text-gray-300 hover:bg-gray-700/60 hover:border-gray-400 hover:text-white transition-all duration-200 backdrop-blur-sm"
                >
                  Learn More First
                </Button>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="bg-gray-800/50 border border-gray-600/50 text-left" id="faq-attachment">
              <CardHeader>
                <CardTitle className="text-white text-2xl">
                  FAQ: What does my archetype actually mean?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <details className="group">
                  <summary className="cursor-pointer text-white font-semibold py-2 hover:text-purple-400 transition-colors">
                    Where do these labels come from?
                  </summary>
                  <p className="text-gray-300 mt-2 pl-4 border-l-2 border-purple-500/30">
                    We mapped your answers onto the attachment-style model used in psychology research. 
                    But dry clinical terms sounded boring, so we gave each type a glitch-core codename.
                  </p>
                </details>
                
                <details className="group">
                  <summary className="cursor-pointer text-white font-semibold py-2 hover:text-purple-400 transition-colors">
                    Is this a medical diagnosis?
                  </summary>
                  <p className="text-gray-300 mt-2 pl-4 border-l-2 border-purple-500/30">
                    Nope. It's a self-reflection tool, not a clinical assessment. Use it to tailor rituals, not to label your forever identity.
                  </p>
                </details>
                
                <details className="group">
                  <summary className="cursor-pointer text-white font-semibold py-2 hover:text-purple-400 transition-colors">
                    Can my archetype change?
                  </summary>
                  <p className="text-gray-300 mt-2 pl-4 border-l-2 border-purple-500/30">
                    Absolutely. Secure Node is a skill set, not a birthright. Stick with the program and you'll watch your code refactor itself.
                  </p>
                </details>
                
                <details className="group">
                  <summary className="cursor-pointer text-white font-semibold py-2 hover:text-purple-400 transition-colors">
                    Why didn't you tell me up front?
                  </summary>
                  <p className="text-gray-300 mt-2 pl-4 border-l-2 border-purple-500/30">
                    We keep the quiz jargon-free so you answer honestly, not to chase a label. Transparency kicks in after the scan—right here.
                  </p>
                </details>
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
            <p className="text-white font-medium">Prompt {currentQuestion + 1} of {questions.length}</p>
            <p className="text-gray-400">{Math.round(progress)}% → 100%</p>
          </div>
          <Progress value={progress} className="h-2 bg-gray-700" />
          <p className="text-xs text-gray-400 mt-2 text-center">Not therapy. Pure optimization.</p>
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
                className="w-full p-6 text-left h-auto bg-gray-800/40 border-gray-600/50 hover:border-purple-400 hover:bg-purple-500/20 text-white justify-start transition-all duration-200 group backdrop-blur-sm"
              >
                <div className="flex items-center w-full">
                  <div className="w-8 h-8 rounded-full border-2 border-gray-500 group-hover:border-purple-400 flex items-center justify-center mr-4 transition-colors">
                    <span className="text-sm font-bold text-gray-400 group-hover:text-purple-400">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>
                  <span className="text-lg leading-relaxed flex-1">{option.text}</span>
                </div>
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
            className="text-gray-400 hover:text-white hover:bg-gray-800/50 px-6 py-3 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentQuestion > 0 ? 'Previous Question' : 'Back to Start'}
          </Button>
        </div>

      </div>
    </div>
  );
}
