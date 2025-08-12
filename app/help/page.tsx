"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SiteFooter } from '@/components/layout/SiteFooter';
import Link from 'next/link';
import { 
  HelpCircle, ChevronDown, ChevronUp, Search, 
  ArrowLeft, BookOpen, Video, FileText, MessageCircle,
  Shield, Heart, Zap, Settings
} from 'lucide-react';

export default function HelpCenterPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      title: "Getting Started",
      icon: <Heart className="h-5 w-5" />,
      color: "text-pink-400",
      faqs: [
        {
          question: "How do I create my account?",
          answer: "Click 'Start Free Quiz' on our homepage. The quiz helps us understand your healing journey and creates your personalized account. You'll start in Ghost Mode (free) with access to basic features."
        },
        {
          question: "What's the difference between Ghost Mode and Firewall Mode?",
          answer: "Ghost Mode is free and includes 1 daily ritual, basic no-contact tracker (24h shield), Wall of Wounds reading/reacting, and 5 AI chat messages daily. Firewall Mode ($9.99/month) includes 2 personalized rituals + rerolls, enhanced tracker (48h + auto-shield), posting on Wall of Wounds, unlimited AI chat, and advanced insights."
        },
        {
          question: "Do I need to provide personal information?",
          answer: "We prioritize your privacy. You only need an email to get started. You can use a codename instead of your real name, and all data is encrypted and anonymous."
        }
      ]
    },
    {
      title: "Daily Rituals",
      icon: <Zap className="h-5 w-5" />,
      color: "text-purple-400",
      faqs: [
        {
          question: "How do daily rituals work?",
          answer: "Every day, you receive personalized healing activities based on your emotional archetype and progress. Ghost Mode users get 1 ritual from our free pool, while Firewall Mode users get 2 personalized rituals plus the ability to reroll if needed."
        },
        {
          question: "What if I miss a day?",
          answer: "No worries! Your healing journey isn't about perfection. You can catch up on missed rituals, and your progress tracking will reflect your overall patterns rather than punishing missed days."
        },
        {
          question: "Can I suggest new rituals?",
          answer: "Absolutely! We love community input. Contact us through the Help Center with your suggestions, and our therapy team reviews all submissions for potential inclusion."
        }
      ]
    },
    {
      title: "No-Contact Tracker",
      icon: <Shield className="h-5 w-5" />,
      color: "text-green-400",
      faqs: [
        {
          question: "How does the no-contact tracker help?",
          answer: "Our tracker helps you maintain boundaries with your ex. Ghost Mode provides 24-hour shields, while Firewall Mode offers 48-hour shields with automatic activation. It gamifies your healing by showing streak progress and celebrating milestones."
        },
        {
          question: "What if I break no-contact?",
          answer: "Breaking no-contact doesn't mean failure - it's part of the healing process. The tracker resets, but your overall progress and insights remain. Use it as a learning opportunity to understand your triggers."
        },
        {
          question: "Can I customize my no-contact goals?",
          answer: "Yes! Firewall Mode allows custom shield durations and automatic triggers. You can set personalized goals based on your specific situation and healing timeline."
        }
      ]
    },
    {
      title: "AI Chat & Support",
      icon: <MessageCircle className="h-5 w-5" />,
      color: "text-blue-400",
      faqs: [
        {
          question: "How does the AI chat work?",
          answer: "Our AI provides personalized emotional support and coping strategies. Ghost Mode includes 5 free messages daily, while Firewall Mode offers unlimited chat with different AI personas (supportive friend, wise mentor, etc.)."
        },
        {
          question: "Is the AI chat confidential?",
          answer: "Yes, all conversations are encrypted and anonymous. Our AI is trained on therapeutic principles but isn't a replacement for professional therapy. For crisis situations, please use our Crisis Support resources."
        },
        {
          question: "When should I seek professional help?",
          answer: "While our platform provides valuable support, please seek professional help if you're experiencing severe depression, anxiety, suicidal thoughts, or if your situation involves abuse. Our Crisis Support page has immediate resources."
        }
      ]
    }
  ];

  const tutorials = [
    {
      title: "Setting Up Your Profile",
      description: "Learn how to personalize your healing journey",
      type: "video",
      duration: "3 min",
      link: "/tutorials/profile-setup"
    },
    {
      title: "Maximizing Daily Rituals",
      description: "Get the most out of your daily healing activities",
      type: "guide",
      duration: "5 min read",
      link: "/tutorials/daily-rituals"
    },
    {
      title: "Understanding Your Progress",
      description: "How to read your analytics and insights",
      type: "guide",
      duration: "4 min read",
      link: "/tutorials/progress-tracking"
    },
    {
      title: "Using the Wall of Wounds",
      description: "Connect with the community safely and effectively",
      type: "video",
      duration: "6 min",
      link: "/tutorials/wall-of-wounds"
    }
  ];

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <header className="w-full border-b border-gray-600/30 bg-gray-800/60 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1 text-xl font-extrabold tracking-tight text-white">
              <span>CTRL</span>
              <span className="text-gray-400">+</span>
              <span>ALT</span>
              <span className="text-gray-400">+</span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BLOCK</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" className="text-white hover:text-purple-400">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
            <HelpCircle className="h-10 w-10 mr-3 text-purple-400" />
            Help Center
          </h1>
          <p className="text-gray-300 text-lg">
            Find answers, tutorials, and support for your healing journey
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gray-800/50 border-gray-600 hover:border-purple-500 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Settings className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Account Settings</h3>
              <p className="text-gray-400 text-sm">Manage your profile and preferences</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-600 hover:border-green-500 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Privacy & Security</h3>
              <p className="text-gray-400 text-sm">Learn about our privacy practices</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-600 hover:border-pink-500 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-pink-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Contact Support</h3>
              <p className="text-gray-400 text-sm">Get help from our team</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-600 hover:border-red-500 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 text-red-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Crisis Support</h3>
              <p className="text-gray-400 text-sm">Immediate help resources</p>
            </CardContent>
          </Card>
        </div>

        {/* Tutorials Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <BookOpen className="h-6 w-6 mr-3 text-blue-400" />
            Tutorials & Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tutorials.map((tutorial, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-600 hover:border-blue-400 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      {tutorial.type === 'video' ? (
                        <Video className="h-5 w-5 text-blue-400 mr-2" />
                      ) : (
                        <FileText className="h-5 w-5 text-green-400 mr-2" />
                      )}
                      <span className="text-xs text-gray-400 uppercase">{tutorial.type}</span>
                    </div>
                    <span className="text-xs text-gray-400">{tutorial.duration}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{tutorial.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{tutorial.description}</p>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white">
                    {tutorial.type === 'video' ? 'Watch Tutorial' : 'Read Guide'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <HelpCircle className="h-6 w-6 mr-3 text-purple-400" />
            Frequently Asked Questions
          </h2>
          
          {filteredFaqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className={category.color}>{category.icon}</span>
                <span className="ml-2">{category.title}</span>
              </h3>
              
              <div className="space-y-3">
                {category.faqs.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 100 + faqIndex;
                  return (
                    <Card key={faqIndex} className="bg-gray-800/50 border-gray-600">
                      <CardContent className="p-0">
                        <button
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                          onClick={() => setExpandedFaq(expandedFaq === globalIndex ? null : globalIndex)}
                        >
                          <span className="text-white font-medium">{faq.question}</span>
                          {expandedFaq === globalIndex ? (
                            <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        
                        {expandedFaq === globalIndex && (
                          <div className="px-6 pb-6">
                            <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Still Need Help?</h3>
              <p className="text-gray-300 mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Contact Support
                  </Button>
                </Link>
                <Link href="/crisis-support">
                  <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                    Crisis Support
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
