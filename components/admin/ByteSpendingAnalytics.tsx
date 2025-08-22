'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Coins, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  DollarSign,
  Users,
  Activity,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Filter
} from 'lucide-react'
import { motion } from 'framer-motion'

interface ByteAnalyticsData {
  totalEarned: number
  totalSpent: number
  totalPurchased: number
  activeUsers: number
  dailyEarning: Array<{ date: string; amount: number }>
  dailySpending: Array<{ date: string; amount: number }>
  earningByActivity: Array<{ activity: string; amount: number; percentage: number }>
  spendingByCategory: Array<{ category: string; amount: number; percentage: number }>
  userDistribution: {
    earners: number
    spenders: number
    purchasers: number
  }
  monthlyTrends: {
    earning: number
    spending: number
    netFlow: number
  }
}

interface ByteSpendingAnalyticsProps {
  className?: string
}

export function ByteSpendingAnalytics({ className = "" }: ByteSpendingAnalyticsProps) {
  const [data, setData] = useState<ByteAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [activeView, setActiveView] = useState<'overview' | 'earning' | 'spending' | 'users'>('overview')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/bytes-analytics?range=${timeRange}`)
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      }
    } catch (error) {
      console.error('Failed to fetch byte analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = async () => {
    try {
      const response = await fetch(`/api/admin/bytes-analytics/export?range=${timeRange}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `bytes-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  // Mock data for development
  const mockData: ByteAnalyticsData = {
    totalEarned: 45680,
    totalSpent: 23450,
    totalPurchased: 8900,
    activeUsers: 342,
    dailyEarning: [
      { date: '2025-08-15', amount: 1200 },
      { date: '2025-08-16', amount: 1450 },
      { date: '2025-08-17', amount: 1100 },
      { date: '2025-08-18', amount: 1600 },
      { date: '2025-08-19', amount: 1350 },
      { date: '2025-08-20', amount: 1800 },
      { date: '2025-08-21', amount: 1500 }
    ],
    dailySpending: [
      { date: '2025-08-15', amount: 800 },
      { date: '2025-08-16', amount: 950 },
      { date: '2025-08-17', amount: 750 },
      { date: '2025-08-18', amount: 1100 },
      { date: '2025-08-19', amount: 900 },
      { date: '2025-08-20', amount: 1200 },
      { date: '2025-08-21', amount: 1000 }
    ],
    earningByActivity: [
      { activity: 'Daily Rituals', amount: 18500, percentage: 42 },
      { activity: 'Check-ins', amount: 12200, percentage: 28 },
      { activity: 'Wall Posts', amount: 8900, percentage: 20 },
      { activity: 'Reactions', amount: 3100, percentage: 7 },
      { activity: 'AI Therapy', amount: 1380, percentage: 3 }
    ],
    spendingByCategory: [
      { category: 'AI Therapy Messages', amount: 14500, percentage: 62 },
      { category: 'Premium Features', amount: 6200, percentage: 26 },
      { category: 'Badge Boosts', amount: 2750, percentage: 12 }
    ],
    userDistribution: {
      earners: 298,
      spenders: 156,
      purchasers: 43
    },
    monthlyTrends: {
      earning: 12.5,
      spending: 8.3,
      netFlow: 22230
    }
  }

  const displayData = data || mockData

  if (loading && !data) {
    return (
      <Card className={`bg-gray-800 border-gray-700 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 text-purple-400 animate-spin" />
            <span className="ml-2 text-gray-300">Loading analytics...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart3 className="h-6 w-6 text-purple-400" />
              Bytes Economy Analytics
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-700 rounded-lg p-1">
                {(['7d', '30d', '90d'] as const).map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 text-xs ${
                      timeRange === range 
                        ? 'bg-purple-600 text-white' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {range}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={exportData}
                className="border-gray-600 text-gray-300 hover:text-white"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAnalytics}
                disabled={loading}
                className="border-gray-600 text-gray-300 hover:text-white"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Earned</p>
                <p className="text-2xl font-bold text-green-400">
                  {displayData.totalEarned.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              +{displayData.monthlyTrends.earning}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Spent</p>
                <p className="text-2xl font-bold text-red-400">
                  {displayData.totalSpent.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-red-500/20 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              +{displayData.monthlyTrends.spending}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Purchased</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {displayData.totalPurchased.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Real money transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-blue-400">
                  {displayData.activeUsers}
                </p>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Earning/spending bytes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* View Navigation */}
      <div className="flex gap-1 bg-gray-700/50 rounded-lg p-1">
        {(['overview', 'earning', 'spending', 'users'] as const).map((view) => (
          <Button
            key={view}
            variant={activeView === view ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView(view)}
            className={`flex-1 ${
              activeView === view 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {view === 'overview' && <Activity className="h-4 w-4 mr-1" />}
            {view === 'earning' && <TrendingUp className="h-4 w-4 mr-1" />}
            {view === 'spending' && <TrendingDown className="h-4 w-4 mr-1" />}
            {view === 'users' && <Users className="h-4 w-4 mr-1" />}
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </Button>
        ))}
      </div>

      {/* Content based on active view */}
      {activeView === 'earning' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Earning by Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {displayData.earningByActivity.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-purple-400" />
                      <span className="text-gray-300">{item.activity}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">
                        {item.amount.toLocaleString()}B
                      </div>
                      <div className="text-xs text-gray-400">
                        {item.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Daily Earning Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {displayData.dailyEarning.slice(-7).map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">
                      {new Date(day.date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="bg-green-500 h-2 rounded"
                        style={{ width: `${(day.amount / 2000) * 100}px` }}
                      />
                      <span className="text-green-400 font-medium text-sm">
                        {day.amount}B
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeView === 'spending' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {displayData.spendingByCategory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <span className="text-gray-300">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">
                        {item.amount.toLocaleString()}B
                      </div>
                      <div className="text-xs text-gray-400">
                        {item.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Daily Spending Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {displayData.dailySpending.slice(-7).map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">
                      {new Date(day.date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="bg-red-500 h-2 rounded"
                        style={{ width: `${(day.amount / 1500) * 100}px` }}
                      />
                      <span className="text-red-400 font-medium text-sm">
                        {day.amount}B
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeView === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Earners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {displayData.userDistribution.earners}
                </div>
                <p className="text-gray-400 text-sm">
                  Users earning bytes
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Spenders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">
                  {displayData.userDistribution.spenders}
                </div>
                <p className="text-gray-400 text-sm">
                  Users spending bytes
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Purchasers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {displayData.userDistribution.purchasers}
                </div>
                <p className="text-gray-400 text-sm">
                  Users buying bytes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeView === 'overview' && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Economic Health Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">
                  {displayData.monthlyTrends.netFlow.toLocaleString()}B
                </div>
                <p className="text-gray-400 text-sm">Net Byte Flow</p>
                <p className="text-xs text-gray-500 mt-1">
                  Earned - Spent this month
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">
                  {Math.round((displayData.totalSpent / displayData.totalEarned) * 100)}%
                </div>
                <p className="text-gray-400 text-sm">Utilization Rate</p>
                <p className="text-xs text-gray-500 mt-1">
                  Bytes spent vs earned
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">
                  {Math.round((displayData.userDistribution.spenders / displayData.userDistribution.earners) * 100)}%
                </div>
                <p className="text-gray-400 text-sm">Conversion Rate</p>
                <p className="text-xs text-gray-500 mt-1">
                  Earners who spend
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ByteSpendingAnalytics
