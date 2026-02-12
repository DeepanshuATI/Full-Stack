import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import AuthModal from '../components/AuthModal'
import CodeEditor from '../components/CodeEditor'
import { Play, ChevronLeft, CheckCircle, XCircle, Loader } from 'lucide-react'

const ProblemPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' })
  const [problem, setProblem] = useState(null)
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  
  // Available programming languages
  const languages = [
    { value: 'javascript', label: 'JavaScript', extension: 'js' },
    { value: 'python', label: 'Python', extension: 'py' },
    { value: 'java', label: 'Java', extension: 'java' },
    { value: 'cpp', label: 'C++', extension: 'cpp' },
    { value: 'c', label: 'C', extension: 'c' },
    { value: 'csharp', label: 'C#', extension: 'cs' },
    { value: 'go', label: 'Go', extension: 'go' },
    { value: 'rust', label: 'Rust', extension: 'rs' },
    { value: 'typescript', label: 'TypeScript', extension: 'ts' },
    { value: 'php', label: 'PHP', extension: 'php' },
    { value: 'ruby', label: 'Ruby', extension: 'rb' },
    { value: 'swift', label: 'Swift', extension: 'swift' },
    { value: 'kotlin', label: 'Kotlin', extension: 'kt' },
  ]
  const [testResults, setTestResults] = useState(null)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    // Mock problem data - replace with API call
    setProblem({
      id: parseInt(id),
      title: 'Two Sum',
      difficulty: 'Easy',
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
      examples: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0,1]',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
        },
        {
          input: 'nums = [3,2,4], target = 6',
          output: '[1,2]',
          explanation: ''
        }
      ],
      constraints: [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9',
        'Only one valid answer exists.'
      ],
      starterCode: {
        javascript: `function twoSum(nums, target) {\n    // Write your code here\n    \n}`,
        python: `def twoSum(nums, target):\n    # Write your code here\n    pass`,
        java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        \n    }\n}`,
        cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n        \n    }\n};`,
        c: `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your code here\n    \n}`,
        csharp: `public class Solution {\n    public int[] TwoSum(int[] nums, int target) {\n        // Write your code here\n        \n    }\n}`,
        go: `func twoSum(nums []int, target int) []int {\n    // Write your code here\n    \n}`,
        rust: `impl Solution {\n    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n        // Write your code here\n        \n    }\n}`,
        typescript: `function twoSum(nums: number[], target: number): number[] {\n    // Write your code here\n    \n}`,
        php: `<?php\nclass Solution {\n    function twoSum($nums, $target) {\n        // Write your code here\n        \n    }\n}`,
        ruby: `def two_sum(nums, target)\n    # Write your code here\n    \nend`,
        swift: `class Solution {\n    func twoSum(_ nums: [Int], _ target: Int) -> [Int] {\n        // Write your code here\n        \n    }\n}`,
        kotlin: `class Solution {\n    fun twoSum(nums: IntArray, target: Int): IntArray {\n        // Write your code here\n        \n    }\n}`
      }
    })
  }, [id])

  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode[language] || '')
    }
  }, [problem, language])

  const handleRunCode = async () => {
    if (!isAuthenticated) {
      setAuthModal({ isOpen: true, mode: 'login' })
      return
    }

    setIsRunning(true)
    setTestResults(null)

    // TODO: Replace with actual API call to your backend compiler
    // Example API call:
    // try {
    //   const response = await axios.post('/api/compile', {
    //     code: code,
    //     language: language,
    //     problemId: id
    //   })
    //   setTestResults(response.data)
    // } catch (error) {
    //   console.error('Compilation error:', error)
    // } finally {
    //   setIsRunning(false)
    // }

    // Mock test execution for demo
    setTimeout(() => {
      setTestResults({
        passed: 2,
        total: 3,
        cases: [
          { input: '[2,7,11,15], 9', expected: '[0,1]', actual: '[0,1]', passed: true },
          { input: '[3,2,4], 6', expected: '[1,2]', actual: '[1,2]', passed: true },
          { input: '[3,3], 6', expected: '[0,1]', actual: 'null', passed: false }
        ]
      })
      setIsRunning(false)
    }, 2000)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
      case 'hard':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar
          onLoginClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
          onRegisterClick={() => setAuthModal({ isOpen: true, mode: 'register' })}
        />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navbar
        onLoginClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
        onRegisterClick={() => setAuthModal({ isOpen: true, mode: 'register' })}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Problems</span>
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Problem Description */}
          <div className="w-1/2 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto scrollbar-thin">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {problem.id}. {problem.title}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mb-6">
                  {problem.description}
                </p>

                <div className="space-y-4 mb-6">
                  {problem.examples.map((example, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <p className="font-semibold text-gray-900 dark:text-white mb-2">
                        Example {index + 1}:
                      </p>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Input:</span> {example.input}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Output:</span> {example.output}
                        </p>
                        {example.explanation && (
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Explanation:</span> {example.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Constraints:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {problem.constraints.map((constraint, index) => (
                      <li key={index}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Code Editor and Test Results */}
          <div className="w-1/2 flex flex-col bg-white dark:bg-gray-900">
            {/* Editor Header */}
            <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>

              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
              >
                {isRunning ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Run Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Editor */}
            <div className="flex-1 overflow-hidden">
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
              />
            </div>

            {/* Test Results */}
            {testResults && (
              <div className="border-t border-gray-200 dark:border-gray-800 p-4 max-h-64 overflow-y-auto scrollbar-thin">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Test Results: {testResults.passed}/{testResults.total} Passed
                  </h3>
                </div>
                <div className="space-y-2">
                  {testResults.cases.map((testCase, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        testCase.passed
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {testCase.passed ? (
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        )}
                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                          Test Case {index + 1}
                        </span>
                      </div>
                      <div className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                        <p><span className="font-medium">Input:</span> {testCase.input}</p>
                        <p><span className="font-medium">Expected:</span> {testCase.expected}</p>
                        <p><span className="font-medium">Actual:</span> {testCase.actual}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        initialMode={authModal.mode}
      />
    </div>
  )
}

export default ProblemPage
