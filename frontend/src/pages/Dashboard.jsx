import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import ProblemList from '../components/ProblemList'
import AuthModal from '../components/AuthModal'
import { Search, Filter } from 'lucide-react'

const Dashboard = () => {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' })
  const [searchTerm, setSearchTerm] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [problems, setProblems] = useState([])

  useEffect(() => {
    // api use karnhi ha
    setProblems([
      { id: 1, title: 'Two Sum', difficulty: 'Easy', acceptance: 49.2 },
      { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', acceptance: 40.1 },
      { id: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', acceptance: 33.8 },
      { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', acceptance: 35.4 },
      { id: 5, title: 'Longest Palindromic Substring', difficulty: 'Medium', acceptance: 32.5 },
      { id: 6, title: 'Reverse Integer', difficulty: 'Easy', acceptance: 27.3 },
      { id: 7, title: 'String to Integer (atoi)', difficulty: 'Medium', acceptance: 16.5 },
      { id: 8, title: 'Palindrome Number', difficulty: 'Easy', acceptance: 52.7 },
      { id: 9, title: 'Regular Expression Matching', difficulty: 'Hard', acceptance: 27.9 },
      { id: 10, title: 'Container With Most Water', difficulty: 'Medium', acceptance: 54.2 },
    ])
  }, [])

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = difficultyFilter === 'all' || 
      problem.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
    return matchesSearch && matchesDifficulty
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar
        onLoginClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
        onRegisterClick={() => setAuthModal({ isOpen: true, mode: 'register' })}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Problem Set
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Practice coding problems and improve your skills
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <ProblemList problems={filteredProblems} />
      </div>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        initialMode={authModal.mode}
      />
    </div>
  )
}

export default Dashboard
