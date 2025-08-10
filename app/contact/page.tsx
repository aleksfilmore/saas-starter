"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageCircle, Clock, CheckCircle } from 'lucide-react';

export default function ContactSupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact-support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '', priority: 'normal' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSubmitted) {
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
              <Link href="/">
                <Button variant="ghost" className="text-white hover:text-purple-400">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </nav>
        </header>

        {/* Success Message */}
        <div className="max-w-2xl mx-auto px-6 py-20">
          <Card className="bg-gray-800/50 border border-green-500/50 text-center">
            <CardContent className="p-12">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4">Message Sent!</h1>
              <p className="text-gray-300 text-lg mb-6">
                Thank you for contacting us. We've received your message and will respond within 24 hours.
              </p>
              <div className="space-y-4">
                <p className="text-gray-400 text-sm">
                  📧 A confirmation has been sent to your email address
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/contact">
                    <Button variant="outline" className="border-gray-500 text-gray-300 hover:text-white">
                      Send Another Message
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      Return Home
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            <Link href="/">
              <Button variant="ghost" className="text-white hover:text-purple-400">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Contact Form */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact Support
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Need help? Have a question? We're here for you. Send us a message and we'll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border border-gray-600/50">
              <CardContent className="p-6">
                <Mail className="h-8 w-8 text-purple-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Email Support</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Send us an email directly at:
                </p>
                <p className="text-purple-400 font-mono text-sm">
                  support@ctrlaltblock.com
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border border-gray-600/50">
              <CardContent className="p-6">
                <Clock className="h-8 w-8 text-green-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Response Time</h3>
                <p className="text-gray-300 text-sm mb-2">
                  We typically respond within:
                </p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">General inquiries</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">24 hours</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Urgent issues</span>
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">4 hours</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Crisis support</span>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">Immediate</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-900/20 border border-red-500/30">
              <CardContent className="p-6">
                <MessageCircle className="h-8 w-8 text-red-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Crisis Support</h3>
                <p className="text-gray-300 text-sm mb-3">
                  If you're in immediate crisis, please reach out to:
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-red-300">🇺🇸 National Suicide Prevention Lifeline: 988</p>
                  <p className="text-red-300">🇺🇸 Crisis Text Line: Text HOME to 741741</p>
                  <p className="text-red-300">🆘 Emergency Services: 911</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border border-gray-600/50">
              <CardHeader>
                <CardTitle className="text-white">Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        placeholder="What's this about?"
                      />
                    </div>
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-2">
                        Priority
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                      >
                        <option value="low">Low - General question</option>
                        <option value="normal">Normal - Standard inquiry</option>
                        <option value="high">High - Urgent issue</option>
                        <option value="critical">Critical - Account problem</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      placeholder="Please describe your question or issue in detail..."
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      * Required fields
                    </p>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-2"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
