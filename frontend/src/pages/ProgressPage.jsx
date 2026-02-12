import Navbar from '../components/Navbar'
import { TrendingUp, Target, Zap } from 'lucide-react'

const ProgressPage = () => {
  const weeklyProgress = [
    { day: 'Mon', solved: 3 },
    { day: 'Tue', solved: 5 },
    { day: 'Wed', solved: 2 },
    { day: 'Thu', solved: 7 },
    { day: 'Fri', solved: 4 },
    { day: 'Sat', solved: 6 },
    { day: 'Sun', solved: 3 },
  ]

  const maxSolved = Math.max(...weeklyProgress.map(d => d.solved))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          My Progress
        </h1>

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
            <p className="text-3xl font-bold text-gray-900 dark:text-white">7 days</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Weekly Goal
              </h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">30/50</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Best Streak
              </h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">21 days</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            This Week's Activity
          </h2>
          
          <div className="flex items-end justify-between gap-4 h-64">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-48">
                  <div 
                    className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                    style={{ height: `${(day.solved / maxSolved) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {day.day}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {day.solved}
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
