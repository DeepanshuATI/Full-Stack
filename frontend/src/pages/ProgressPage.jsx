import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { authAPI } from '../utils/api'
import { TrendingUp, Target, Zap, Loader, ArrowLeft } from 'lucide-react'

const ProgressPage = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProgress()
  }, [])

  const fetchProgress = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await authAPI.getStats()
      setStats(response.data.data)
    } catch (err) {
      console.error('Error fetching progress:', err)
      setError('Failed to load progress data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Build weekly activity from recentActivity data
  const getWeeklyProgress = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date()
    const weekData = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const dayName = days[date.getDay()]
      
      const activity = stats?.recentActivity?.find(a => a._id === dateStr)
      weekData.push({
        day: dayName,
        date: dateStr,
        solved: activity?.accepted || 0,
        total: activity?.count || 0
      })
    }
    return weekData
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  const weeklyProgress = getWeeklyProgress()
  const maxSolved = Math.max(...weeklyProgress.map(d => d.total), 1)
  const totalThisWeek = weeklyProgress.reduce((sum, d) => sum + d.total, 0)
  const acceptedThisWeek = weeklyProgress.reduce((sum, d) => sum + d.solved, 0)

  // Calculate current streak from activity data
  const currentStreak = (() => {
    let streak = 0
    const today = new Date()
    for (let i = 0; i <= 6; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const activity = stats?.recentActivity?.find(a => a._id === dateStr)
      if (activity && activity.accepted > 0) {
        streak++
      } else if (i > 0) {
        break
      }
    }
    return streak
  })()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Problems
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          My Progress
        </h1>

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Current Streak
              </h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentStreak} day{currentStreak !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Solved
              </h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats?.problemsSolved || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Acceptance Rate
              </h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats?.acceptanceRate || 0}%
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              This Week's Activity
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {totalThisWeek} submission{totalThisWeek !== 1 ? 's' : ''} · {acceptedThisWeek} accepted
            </div>
          </div>
          
          <div className="flex items-end justify-between gap-4 h-64">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-48">
                  <div 
                    className="w-full bg-blue-500 rounded-t-lg transition-all duration-500 hover:bg-blue-600 relative group"
                    style={{ height: `${(day.total / maxSolved) * 100}%`, minHeight: day.total > 0 ? '8px' : '0px' }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {day.solved} accepted / {day.total} total
                    </div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {day.day}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {day.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressPage
