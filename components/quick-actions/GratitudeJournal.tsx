"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Plus, Trash2, Heart, Sparkles, CheckCircle2, Calendar } from "lucide-react";

interface GratitudeEntry {
  id: string;
  text: string;
  category: 'growth' | 'freedom' | 'support' | 'self' | 'future';
  timestamp: Date;
}

const GRATITUDE_PROMPTS = [
  {
    category: 'growth' as const,
    icon: '🌱',
    prompts: [
      "Something I learned about myself recently",
      "A skill I've developed since the breakup",
      "A boundary I successfully maintained",
      "A moment I chose myself over them"
    ]
  },
  {
    category: 'freedom' as const,
    icon: '🦋',
    prompts: [
      "Something I can do now that I couldn't before",
      "A toxic behavior I no longer tolerate",
      "Space in my life that feels lighter",
      "A choice I made just for me"
    ]
  },
  {
    category: 'support' as const,
    icon: '🤝',
    prompts: [
      "Someone who showed up for me",
      "A community that makes me feel seen",
      "Words of encouragement I received",
      "A moment of unexpected kindness"
    ]
  },
  {
    category: 'self' as const,
    icon: '💎',
    prompts: [
      "Something I like about my appearance today",
      "A quality that makes me a good friend",
      "A way I've shown myself compassion",
      "Something my body did for me today"
    ]
  },
  {
    category: 'future' as const,
    icon: '🌟',
    prompts: [
      "Something I'm excited to experience",
      "A goal I'm working toward",
      "A dream that feels more possible now",
      "A version of myself I'm becoming"
    ]
  }
];

interface GratitudeJournalProps {
  onComplete?: (entries: GratitudeEntry[]) => void;
}

export function GratitudeJournal({ onComplete }: GratitudeJournalProps) {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GratitudeEntry['category']>('growth');
  const [isComplete, setIsComplete] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);

  const addEntry = () => {
    if (currentEntry.trim()) {
      const newEntry: GratitudeEntry = {
        id: Date.now().toString(),
        text: currentEntry.trim(),
        category: selectedCategory,
        timestamp: new Date()
      };
      setEntries([...entries, newEntry]);
      setCurrentEntry('');
    }
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const usePrompt = (prompt: string) => {
    setCurrentEntry(prompt);
    setShowPrompts(false);
  };

  const handleComplete = async () => {
    if (entries.length > 0) {
      setIsComplete(true);
      
      try {
        // Calculate total word count
        const totalWordCount = entries.reduce((total, entry) => 
          total + entry.text.split(/\s+/).length, 0
        );
        
        // Sync with API for cross-platform support
        await fetch('/api/quickactions/gratitude', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            entries: entries,
            totalWordCount: totalWordCount
          })
        });
      } catch (error) {
        console.error('Failed to sync gratitude journal:', error);
      }
      
      onComplete?.(entries);
      
      // Auto-close after 4 seconds
      setTimeout(() => {
        setIsComplete(false);
        setEntries([]);
        setCurrentEntry('');
      }, 4000);
    }
  };

  const getCategoryColor = (category: GratitudeEntry['category']) => {
    const colors = {
      growth: 'bg-green-500/20 text-green-400 border-green-500/50',
      freedom: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      support: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      self: 'bg-pink-500/20 text-pink-400 border-pink-500/50',
      future: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
    };
    return colors[category];
  };

  const getCategoryIcon = (category: GratitudeEntry['category']) => {
    const categoryData = GRATITUDE_PROMPTS.find(p => p.category === category);
    return categoryData?.icon || '✨';
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-purple-200 text-center text-sm">
          <BookOpen className="w-6 h-6 mx-auto mb-2" />
          Gratitude Journal
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center">
            ✨ Gratitude Journal
          </DialogTitle>
        </DialogHeader>

        {!isComplete ? (
          <div className="space-y-6">
            <p className="text-gray-300 text-center">
              What are you grateful for today? Even tiny wins count.
            </p>

            {/* Category Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">Category</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {GRATITUDE_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.category}
                    onClick={() => setSelectedCategory(prompt.category)}
                    className={`p-3 rounded-lg border transition-all ${
                      selectedCategory === prompt.category
                        ? getCategoryColor(prompt.category)
                        : 'bg-gray-800 border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-center">
                      <span className="text-lg">{prompt.icon}</span>
                      <p className="text-xs font-medium capitalize mt-1">
                        {prompt.category}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Entry Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-300">
                  What are you grateful for?
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPrompts(!showPrompts)}
                  className="text-xs"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Need inspiration?
                </Button>
              </div>

              {showPrompts && (
                <Card className="bg-gray-800 border-gray-600">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-white">
                      {getCategoryIcon(selectedCategory)} {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Prompts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {GRATITUDE_PROMPTS.find(p => p.category === selectedCategory)?.prompts.map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentEntry(currentEntry + (currentEntry ? '\n\n' : '') + prompt + '\n');
                            setShowPrompts(false);
                          }}
                          className="w-full text-left p-2 rounded bg-gray-700 hover:bg-gray-600 text-sm text-gray-300 transition-colors"
                        >
                          &quot;{prompt}&quot;
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <textarea
                value={currentEntry}
                onChange={(e) => setCurrentEntry(e.target.value)}
                placeholder="I'm grateful for..."
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none"
                rows={3}
              />
              
              <Button 
                onClick={addEntry}
                disabled={!currentEntry.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Gratitude Entry
              </Button>
            </div>

            {/* Current Entries */}
            {entries.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-white">Today's Gratitude ({entries.length})</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {entries.map((entry) => (
                    <div key={entry.id} className="bg-gray-800 border border-gray-600 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span>{getCategoryIcon(entry.category)}</span>
                            <Badge className={getCategoryColor(entry.category)}>
                              {entry.category}
                            </Badge>
                          </div>
                          <p className="text-gray-300 text-sm">{entry.text}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEntry(entry.id)}
                          className="text-gray-400 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={handleComplete}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Complete Gratitude Session
                </Button>
              </div>
            )}

            {entries.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-600 rounded-lg">
                <Heart className="w-12 h-12 mx-auto text-gray-500 mb-3" />
                <p className="text-gray-400">Start by adding your first gratitude entry</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-6 py-8">
            <div className="text-6xl mb-4">🙏</div>
            <h3 className="text-2xl font-bold text-green-400">Gratitude Logged!</h3>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-300 mb-2">
                {entries.length} gratitude {entries.length === 1 ? 'entry' : 'entries'} saved
              </p>
              <div className="flex justify-center space-x-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                  +{entries.length * 15} XP
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                  +{entries.length * 10} Bytes
                </Badge>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Gratitude practice strengthens your resilience and shifts your focus to growth
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
