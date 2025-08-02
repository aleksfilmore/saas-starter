"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  Shield, Brain, Zap, Users, ArrowRight, Timer, 
  Star, Sparkles, MessageCircle, Heart, ChevronDown, 
  ChevronUp, Quote, Gamepad2, Target
} from 'lucide-react';

export default function HomePage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const mockWallPosts = [
    {
      id: '1',
      content: "Day 47 no contact. Had a panic attack today but didn't text him. Using the breathing protocol right now and it's actually working.",
      type: 'victory',
      reactions: 23,
      replies: 8,
      timeAgo: '2h ago',
      archetype: 'firewall'
    },
    {
      id: '2', 
      content: "I keep checking his Instagram stories. I know I shouldn't but I can't stop. How do you all resist the urge?",
      type: 'confession',
      reactions: 41,
      replies: 15,
      timeAgo: '4h ago',
      archetype: 'ghost'
    },
    {
      id: '3',
      content: "3 months free and I finally feel like myself again. To anyone reading this in the early days - it DOES get easier. Promise.",
      type: 'victory', 
      reactions: 127,
      replies: 34,
      timeAgo: '6h ago',
      archetype: 'secure'
    }
  ];

  const faqs = [
    {
      question: "What is CTRL+ALT+BLOCK?",
      answer: "CTRL+ALT+BLOCK is a digital healing platform designed specifically for people recovering from toxic relationships and heartbreak. We combine evidence-based psychology with gamification to make the healing process engaging and effective."
    },
    {
      question: "How does the REFORMAT PROTOCOL work?",
      answer: "The REFORMAT PROTOCOL is our systematic approach to heartbreak recovery. It includes personalized daily rituals, AI-powered therapy tools, anonymous community support, and gamified progress tracking with XP, levels, and achievements."
    },
    {
      question: "Is my identity really anonymous?",
      answer: "Yes. You create a digital alias (codename) that protects your real identity. All community interactions use only your chosen codename. Your personal healing data is encrypted and never shared with other users."
    },
    {
      question: "What happens in an emergency or crisis?",
      answer: "We have built-in emergency protocols including crisis hotline access, guided breathing exercises, and emergency affirmations. Our platform also connects you to professional mental health resources when needed."
    }
  ];

  const features = [
    {
      icon: <Gamepad2 className="h-8 w-8" />,
      title: "Gamified Healing Journey",
      description: "Track progress with XP points, levels, badges, and streak counters. Turn recovery into an engaging RPG experience.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Therapy Tools", 
      description: "24/7 access to closure simulators, letter generators, reframing tools, and voice therapy sessions.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Anonymous Community",
      description: "Share struggles and victories on the Wall of Wounds. Connect with others without compromising privacy.",
      gradient: "from-blue-500 to-cyan-500"
    }
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'victory': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'confession': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getArchetypeEmoji = (archetype?: string) => {
    switch (archetype) {
      case 'firewall': return '';
      case 'ghost': return '';
      case 'secure': return '';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
              Heal. Level Up. <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Break Free.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              The world's first gamified heartbreak recovery platform. Transform your pain into power with 
              <span className="text-purple-400 font-bold"> CTRL+ALT+BLOCK</span> - 
              where healing meets gaming psychology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/(marketing)/sign-up">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-4 text-white border-0"
                >
                   Start Healing Journey
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/(marketing)/sign-in">
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/20 text-lg px-8 py-4"
                >
                   Access Console
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Live Wall of Wounds Preview */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <Sparkles className="h-8 w-8 inline mr-3 text-pink-400" />
            Live from the Wall of Wounds
          </h2>
          <p className="text-gray-400 text-lg">
            Real healing moments from our anonymous community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mockWallPosts.map((post) => (
            <Card key={post.id} className="bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="text-2xl">
                    {getArchetypeEmoji(post.archetype)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={`text-xs ${getTypeColor(post.type)} border`}>
                        {post.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-400">{post.timeAgo}</span>
                    </div>
                    <Quote className="h-4 w-4 text-gray-400 mb-2" />
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {post.content}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1 text-red-400" />
                        {post.reactions}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1 text-blue-400" />
                        {post.replies}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/(dashboard)/wall-enhanced">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Join the Wall of Wounds
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why CTRL+ALT+BLOCK Works
          </h2>
          <p className="text-gray-400 text-lg">
            Revolutionary healing through the psychology of gaming
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${feature.gradient} mb-6`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need to know about healing with CTRL+ALT+BLOCK
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="bg-gray-800/50 border border-gray-600/50">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </h3>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
