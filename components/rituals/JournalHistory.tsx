'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Calendar,
  Search,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Crown,
  Clock
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

interface JournalHistoryProps {
  isOpen: boolean
  onClose: () => void
  ritualCode?: string // If provided, show only entries for this ritual
}

interface JournalEntry {
  id: string
  ritualCode: string
  ritualTitle: string
  performedAt: string
  mood: number
  whatIDid: string
  howIFeel: string
  tags: string
  source: string
  bytesAwarded: number
  createdAt: string
}

export function JournalHistory({ isOpen, onClose, ritualCode = 'all' }: JournalHistoryProps) {
  const { user } = useAuth()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRitual, setFilterRitual] = useState(ritualCode)
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const isPremium = user?.subscriptionTier === 'premium'
  const entriesPerPage = 5

  useEffect(() => {
    if (isOpen) {
      fetchEntries()
    }
  }, [isOpen, filterRitual])

  const fetchEntries = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/rituals/${filterRitual}/journal?limit=50`)
      if (response.ok) {
        const data = await response.json()
        setEntries(data.entries || [])
        setHasMore(data.hasMore)
      }
    } catch (error) {
      console.error('Failed to fetch journal entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const response = await fetch('/api/journal/export', {
        method: 'POST'
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `ritual-journal-export-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }

  const getMoodEmoji = (mood: number) => {
    const emojis = ['😢', '😔', '😐', '🙂', '😊', '😄', '🤗']
    return emojis[mood - 1] || '😐'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredEntries = entries.filter(entry => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      entry.ritualTitle?.toLowerCase().includes(search) ||
      entry.whatIDid?.toLowerCase().includes(search) ||
      entry.howIFeel?.toLowerCase().includes(search) ||
      entry.tags?.toLowerCase().includes(search)
    )
  })

  const paginatedEntries = filteredEntries.slice(
    currentPage * entriesPerPage,
    (currentPage + 1) * entriesPerPage
  )

  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-900 border-gray-700 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Journal History
            {!isPremium && (
              <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                Last 14 entries
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Controls */}
          <div className="flex-shrink-0 space-y-4 mb-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search entries..."
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <Button
                variant="outline"
                onClick={handleExport}
                className="border-gray-600 text-gray-400 hover:text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Filter by ritual */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterRitual === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterRitual('all')}
                className={filterRitual === 'all' ? 'bg-purple-600' : 'border-gray-600 text-gray-400'}
              >
                All Rituals
              </Button>
              {/* Add more filter buttons based on unique ritual codes */}
            </div>
          </div>

          {/* Entries List */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : paginatedEntries.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                {searchTerm ? 'No entries match your search.' : 'No journal entries yet. Complete a ritual to start journaling!'}
              </div>
            ) : (
              paginatedEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-white">{entry.ritualTitle}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Calendar className="w-3 h-3" />
                            {formatDate(entry.createdAt)}
                            <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
                          </div>
                        </div>
                        
                        {entry.bytesAwarded > 0 && (
                          <div className="flex gap-1">
                            {entry.bytesAwarded > 0 && (
                              <Badge className="bg-blue-600 text-white text-xs">
                                +{entry.bytesAwarded} Bytes
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        {entry.whatIDid && (
                          <div>
                            <div className="text-xs font-medium text-gray-400 mb-1">What I did:</div>
                            <p className="text-gray-200 text-sm">{entry.whatIDid}</p>
                          </div>
                        )}
                        
                        {entry.howIFeel && (
                          <div>
                            <div className="text-xs font-medium text-gray-400 mb-1">How I feel:</div>
                            <p className="text-gray-200 text-sm">{entry.howIFeel}</p>
                          </div>
                        )}

                        {entry.tags && (
                          <div className="flex items-center gap-1 flex-wrap">
                            {entry.tags.split(',').map((tag, i) => (
                              <Badge key={i} variant="outline" className="border-gray-600 text-gray-400 text-xs">
                                {tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex-shrink-0 flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="border-gray-600 text-gray-400"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <span className="text-sm text-gray-400">
                Page {currentPage + 1} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="border-gray-600 text-gray-400"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}

          {!isPremium && (
            <div className="flex-shrink-0 text-center mt-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <Crown className="w-4 h-4" />
                Upgrade to Premium for full history, AI insights, and voice-to-text
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
