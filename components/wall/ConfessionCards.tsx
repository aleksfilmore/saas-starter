"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Heart, 
  Ghost, 
  Flame, 
  Mirror, 
  Scissors, 
  MoreHorizontal,
  Share,
  Flag,
  TrendingUp,
  Clock,
  Zap,
  Download,
  Copy
} from 'lucide-react'

interface Confession {
  id: string
  text: string
  glitchTitle: string
  emotionTag?: string
  timestamp: Date
  reactions: {
    '💔': number
    '👻': number
    '🔥': number
    '🪞': number
    '✂️': number
    '🫠': number
  }
  xpEarned: number
  isViral?: boolean
  isFeatured?: boolean
}

const emotionTags = [
  { value: 'grief', label: 'Grief', color: 'bg-blue-100 text-blue-800' },
  { value: 'rage', label: 'Rage', color: 'bg-red-100 text-red-800' },
  { value: 'relapse', label: 'Relapse', color: 'bg-orange-100 text-orange-800' },
  { value: 'petty', label: 'Petty', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'freefall', label: 'Freefall', color: 'bg-purple-100 text-purple-800' },
  { value: 'glow-up', label: 'Glow-Up', color: 'bg-green-100 text-green-800' }
]

const sampleConfessions: Confession[] = [
  {
    id: '1',
    text: 'He watched my story. That was it. That was all it took to ruin the progress.',
    glitchTitle: '// Ghost_47a',
    emotionTag: 'relapse',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    reactions: { '💔': 247, '👻': 89, '🔥': 12, '🪞': 45, '✂️': 3, '🫠': 156 },
    xpEarned: 15,
    isViral: true
  },
  {
    id: '2',
    text: 'I blocked him on everything. Except the one app I knew he never used. Just in case.',
    glitchTitle: '// Relapse.3.0',
    emotionTag: 'grief',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    reactions: { '💔': 189, '👻': 234, '🔥': 67, '🪞': 23, '✂️': 8, '🫠': 112 },
    xpEarned: 20,
    isFeatured: true
  },
  {
    id: '3',
    text: 'I kept apologizing for the way he treated me.',
    glitchTitle: '// SorryLoop',
    emotionTag: 'rage',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    reactions: { '💔': 134, '👻': 45, '🔥': 298, '🪞': 67, '✂️': 89, '🫠': 78 },
    xpEarned: 25
  },
  {
    id: '4',
    text: 'He told me I was too emotional while crying about his ex.',
    glitchTitle: '// RedFlag.OS',
    emotionTag: 'petty',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    reactions: { '💔': 89, '👻': 12, '🔥': 445, '🪞': 234, '✂️': 167, '🫠': 34 },
    xpEarned: 30,
    isViral: true
  },
  {
    id: '5',
    text: 'I wasn\'t the one. I was the almost. The warm-up. The "thank you, next."',
    glitchTitle: '// Almost.exe',
    emotionTag: 'grief',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    reactions: { '💔': 567, '👻': 89, '🔥': 23, '🪞': 445, '✂️': 12, '🫠': 234 },
    xpEarned: 35,
    isViral: true,
    isFeatured: true
  }
]

export default function ConfessionCards() {
  const [confessions, setConfessions] = useState<Confession[]>(sampleConfessions)
  const [newConfession, setNewConfession] = useState('')
  const [selectedEmotion, setSelectedEmotion] = useState<string>('')
  const [customTitle, setCustomTitle] = useState('')
  const [activeFilter, setActiveFilter] = useState('latest')
  const [showShareModal, setShowShareModal] = useState<string | null>(null)

  const generateGlitchTitle = () => {
    const prefixes = ['Ghost', 'Error', 'Void', 'Relapse', 'Memory', 'Signal', 'Data', 'System']
    const suffixes = ['47a', '404', '3.0', 'exe', 'OS', 'wav', 'tmp', '2.1']
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
    return `// ${prefix}_${suffix}`
  }

  const handleSubmitConfession = () => {
    if (newConfession.trim()) {
      const confession: Confession = {
        id: Date.now().toString(),
        text: newConfession,
        glitchTitle: customTitle || generateGlitchTitle(),
        emotionTag: selectedEmotion,
        timestamp: new Date(),
        reactions: { '💔': 0, '👻': 0, '🔥': 0, '🪞': 0, '✂️': 0, '🫠': 0 },
        xpEarned: Math.floor(Math.random() * 20) + 10
      }
      
      setConfessions([confession, ...confessions])
      setNewConfession('')
      setSelectedEmotion('')
      setCustomTitle('')
    }
  }

  const handleReaction = (confessionId: string, emoji: keyof Confession['reactions']) => {
    setConfessions(confessions.map(confession => 
      confession.id === confessionId 
        ? { ...confession, reactions: { ...confession.reactions, [emoji]: confession.reactions[emoji] + 1 } }
        : confession
    ))
  }

  const getFilteredConfessions = () => {
    let filtered = [...confessions]
    
    switch (activeFilter) {
      case 'trending':
        return filtered.sort((a, b) => {
          const aTotal = Object.values(a.reactions).reduce((sum, count) => sum + count, 0)
          const bTotal = Object.values(b.reactions).reduce((sum, count) => sum + count, 0)
          return bTotal - aTotal
        })
      case 'brutal':
        return filtered.filter(c => c.isViral || c.isFeatured)
      case 'grief':
      case 'rage':
      case 'relapse':
      case 'petty':
      case 'freefall':
      case 'glow-up':
        return filtered.filter(c => c.emotionTag === activeFilter)
      default:
        return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    }
  }

  const getEmotionColor = (emotion?: string) => {
    const tag = emotionTags.find(t => t.value === emotion)
    return tag?.color || 'bg-gray-100 text-gray-800'
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const ConfessionCard = ({ confession }: { confession: Confession }) => {
    const totalReactions = Object.values(confession.reactions).reduce((sum, count) => sum + count, 0)
    
    return (
      <Card className={`transition-all duration-200 hover:shadow-lg ${
        confession.isViral ? 'border-red-200 bg-red-50/30' : ''
      } ${confession.isFeatured ? 'border-purple-200 bg-purple-50/30' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <code className="text-sm font-mono text-purple-600 bg-purple-100 px-2 py-1 rounded">
                {confession.glitchTitle}
              </code>
              {confession.emotionTag && (
                <Badge className={getEmotionColor(confession.emotionTag)} variant="secondary">
                  {confession.emotionTag}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {confession.isViral && (
                <Badge className="bg-red-100 text-red-800">🔥 VIRAL</Badge>
              )}
              {confession.isFeatured && (
                <Badge className="bg-purple-100 text-purple-800">⭐ FEATURED</Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowShareModal(confession.id)}
              >
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <blockquote className="text-lg leading-relaxed italic text-gray-800 border-l-4 border-gray-300 pl-4">
            "{confession.text}"
          </blockquote>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {Object.entries(confession.reactions).map(([emoji, count]) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 hover:bg-gray-100"
                  onClick={() => handleReaction(confession.id, emoji as keyof Confession['reactions'])}
                >
                  <span className="text-lg mr-1">{emoji}</span>
                  <span className="text-xs text-gray-600">{count}</span>
                </Button>
              ))}
            </div>
            
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <Zap className="h-3 w-3" />
                <span>+{confession.xpEarned} XP</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(confession.timestamp)}</span>
              </span>
              <span>{totalReactions} reactions</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
          Wall of Wounds
        </h1>
        <p className="text-gray-600 text-lg">
          Anonymous confessions from the digital heartbreak frontlines. 
          Raw, glitched, witnessed.
        </p>
      </div>

      {/* Confession Input */}
      <Card className="border-2 border-dashed border-purple-200">
        <CardHeader>
          <CardTitle>What's the one thing you can't say out loud today?</CardTitle>
          <CardDescription>
            Anonymous. Permanent. Witnessed by strangers who get it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Type your confession here... (max 500 characters)"
            value={newConfession}
            onChange={(e) => setNewConfession(e.target.value.slice(0, 500))}
            className="min-h-[100px] resize-none"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
              <SelectTrigger>
                <SelectValue placeholder="Add your current state (optional)" />
              </SelectTrigger>
              <SelectContent>
                {emotionTags.map(tag => (
                  <SelectItem key={tag.value} value={tag.value}>
                    {tag.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <input
              type="text"
              placeholder="Custom glitch title (or auto-generate)"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {newConfession.length}/500 characters
            </span>
            <Button 
              onClick={handleSubmitConfession}
              disabled={!newConfession.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Submit Wound +{Math.floor(Math.random() * 20) + 10} XP
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'latest', label: 'Latest', icon: Clock },
          { id: 'trending', label: 'Trending', icon: TrendingUp },
          { id: 'brutal', label: "Today's Most Brutal", icon: Flame },
          ...emotionTags.map(tag => ({ id: tag.value, label: tag.label, icon: Heart }))
        ].map(filter => {
          const Icon = filter.icon
          return (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className="flex items-center space-x-1"
            >
              <Icon className="h-3 w-3" />
              <span>{filter.label}</span>
            </Button>
          )
        })}
      </div>

      {/* Confessions Feed */}
      <div className="space-y-4">
        {getFilteredConfessions().map(confession => (
          <ConfessionCard key={confession.id} confession={confession} />
        ))}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Share Confession Card</CardTitle>
              <CardDescription>
                Create a viral confession card for social media
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-br from-purple-900 to-black p-6 rounded-lg text-white text-center">
                <div className="text-sm font-mono text-purple-300 mb-2">
                  {confessions.find(c => c.id === showShareModal)?.glitchTitle}
                </div>
                <blockquote className="text-lg italic mb-4">
                  "{confessions.find(c => c.id === showShareModal)?.text}"
                </blockquote>
                <div className="text-xs text-gray-400">
                  Wall of Wounds — ctrlaltblock.com
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download PNG
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => setShowShareModal(null)}
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
