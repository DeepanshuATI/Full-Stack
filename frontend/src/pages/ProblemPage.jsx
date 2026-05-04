import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import AuthModal from '../components/AuthModal'
import CodeEditor from '../components/CodeEditor'
import { Play, ChevronLeft, CheckCircle, XCircle, Loader, Send, GripVertical, GripHorizontal, ChevronUp, ChevronDown } from 'lucide-react'
import { problemAPI, submissionAPI } from '../utils/api'

const ProblemPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' })
  const [problem, setProblem] = useState(null)
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [loading, setLoading] = useState(true)
  const [hasFetched, setHasFetched] = useState(false)
  
  useEffect(() => {
    setHasFetched(false)
    setTestResults(null)
  }, [id])
  
  const languages = [
    { value: 'javascript', label: 'JavaScript', extension: 'js' },
    { value: 'python', label: 'Python', extension: 'py' },
    { value: 'java', label: 'Java', extension: 'java' },
    { value: 'c++', label: 'C++', extension: 'cpp' },
    { value: 'ruby', label: 'Ruby', extension: 'rb' }
  ]
  const [testResults, setTestResults] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- Panel Resizing State ---
  const [leftPanelWidth, setLeftPanelWidth] = useState(45) // percentage
  const [resultPanelHeight, setResultPanelHeight] = useState(35) // percentage of right panel
  const [isResultOpen, setIsResultOpen] = useState(false)
  const containerRef = useRef(null)
  const isDraggingVertical = useRef(false)
  const isDraggingHorizontal = useRef(false)

  // Vertical divider drag (left/right split)
  const handleVerticalDragStart = useCallback((e) => {
    e.preventDefault()
    isDraggingVertical.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  // Horizontal divider drag (editor/results split)
  const handleHorizontalDragStart = useCallback((e) => {
    e.preventDefault()
    isDraggingHorizontal.current = true
    document.body.style.cursor = 'row-resize'
    document.body.style.userSelect = 'none'
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingVertical.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const newWidth = ((e.clientX - rect.left) / rect.width) * 100
        setLeftPanelWidth(Math.max(20, Math.min(70, newWidth)))
      }
      if (isDraggingHorizontal.current && containerRef.current) {
        const rightPanel = containerRef.current.querySelector('[data-right-panel]')
        if (rightPanel) {
          const rect = rightPanel.getBoundingClientRect()
          const bottomPos = ((rect.bottom - e.clientY) / rect.height) * 100
          setResultPanelHeight(Math.max(15, Math.min(70, bottomPos)))
        }
      }
    }

    const handleMouseUp = () => {
      isDraggingVertical.current = false
      isDraggingHorizontal.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // Auto-open result panel when results come in
  useEffect(() => {
    if (testResults) {
      setIsResultOpen(true)
    }
  }, [testResults])

  useEffect(() => {
    if (isAuthenticated && !hasFetched) {
      fetchProblem()
      setHasFetched(true)
    } else if (!isAuthenticated) {
      setAuthModal({ isOpen: true, mode: 'login' })
    }
  }, [id, isAuthenticated, hasFetched])

  const fetchProblem = async () => {
    try {
      setLoading(true)
      const response = await problemAPI.getById(id)
      const problemData = response.data
      
      const starterCodeMap = {}
      if (problemData.startcode && Array.isArray(problemData.startcode)) {
        problemData.startcode.forEach(item => {
          starterCodeMap[item.language] = item.initialcode
        })
      }

      const formattedExamples = problemData.visibletestCases?.map(tc => ({
        input: tc.input,
        output: tc.output,
        explanation: tc.explanation || ''
      })) || []

      setProblem({
        id: problemData._id,
        title: problemData.title,
        difficulty: problemData.difficulty.charAt(0).toUpperCase() + problemData.difficulty.slice(1),
        description: problemData.description,
        examples: formattedExamples,
        constraints: [],
        starterCode: starterCodeMap,
        tags: problemData.tags
      })
    } catch (error) {
      console.error('Error fetching problem:', error)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (problem && problem.starterCode) {
      const starter = problem.starterCode[language] || getDefaultStarterCode(language)
      setCode(starter)
    }
  }, [problem, language])

  const getDefaultStarterCode = (lang) => {
    const defaults = {
      javascript: '// Write your solution here\nfunction solution() {\n  \n}\n',
      python: '# Write your solution here\ndef solution():\n    pass\n',
      java: '// Write your solution here\npublic class Solution {\n    public void solution() {\n        \n    }\n}\n',
      'c++': '// Write your solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n',
      ruby: '# Write your solution here\ndef solution\n    \nend\n'
    }
    return defaults[lang] || '// Write your solution here\n'
  }

  const handleRunCode = async () => {
    if (!isAuthenticated) {
      setAuthModal({ isOpen: true, mode: 'login' })
      return
    }

    setIsRunning(true)
    setTestResults(null)

    try {
      const response = await submissionAPI.runCode(id, {
        code,
        language
      })

      const results = response.data
      
      let passed = 0
      const cases = results.map((result, index) => {
        const testCase = problem.examples[index]
        const isPassed = result.status.id === 3
        if (isPassed) passed++

        return {
          input: testCase?.input || 'N/A',
          expected: testCase?.output || 'N/A',
          actual: result.stdout?.trim() || result.stderr || result.compile_output || 'No output',
          passed: isPassed,
          status: result.status.description,
          time: result.time,
          memory: result.memory
        }
      })

      setTestResults({
        passed,
        total: results.length,
        cases
      })
    } catch (error) {
      console.error('Error running code:', error)
      setTestResults({
        passed: 0,
        total: 0,
        cases: [],
        error: error.response?.data?.message || 'Failed to run code'
      })
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmitCode = async () => {
    if (!isAuthenticated) {
      setAuthModal({ isOpen: true, mode: 'login' })
      return
    }

    setIsSubmitting(true)
    setTestResults(null)

    try {
      const response = await submissionAPI.submitCode(id, {
        code,
        language
      })

      const result = response.data

      setTestResults({
        passed: result.passed,
        total: result.total,
        status: result.status,
        runtime: result.runtime,
        memory: result.memory,
        errorMessage: result.errorMessage,
        submissionId: result.submissionId,
        isSubmission: true
      })
    } catch (error) {
      console.error('Error submitting code:', error)
      setTestResults({
        passed: 0,
        total: 0,
        status: 'error',
        error: error.response?.data?.message || 'Failed to submit code',
        isSubmission: true
      })
    } finally {
      setIsSubmitting(false)
    }
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar
          onLoginClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
          onRegisterClick={() => setAuthModal({ isOpen: true, mode: 'register' })}
        />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Please sign in to view problems</p>
            <button
              onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
        <AuthModal
          isOpen={authModal.isOpen}
          onClose={() => {
            setAuthModal({ ...authModal, isOpen: false })
            navigate('/')
          }}
          initialMode={authModal.mode}
        />
      </div>
    )
  }

  if (loading || !problem) {
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
    <div className="h-screen bg-gray-50 dark:bg-gray-950 flex flex-col overflow-hidden">
      <Navbar
        onLoginClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
        onRegisterClick={() => setAuthModal({ isOpen: true, mode: 'register' })}
      />

      {/* Top bar */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 flex-shrink-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Problems</span>
        </button>
      </div>

      {/* Main 3-panel area */}
      <div className="flex-1 flex overflow-hidden" ref={containerRef}>
        
        {/* LEFT PANEL: Problem Description */}
        <div 
          className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto scrollbar-thin flex-shrink-0"
          style={{ width: `${leftPanelWidth}%` }}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {problem.title}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mb-6">
                {problem.description}
              </p>

              {problem.examples && problem.examples.length > 0 && (
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
              )}

              {problem.constraints && problem.constraints.length > 0 && (
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
              )}
            </div>
          </div>
        </div>

        {/* VERTICAL RESIZE HANDLE */}
        <div
          className="w-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-500 cursor-col-resize flex items-center justify-center flex-shrink-0 transition-colors group"
          onMouseDown={handleVerticalDragStart}
        >
          <GripVertical className="w-3 h-3 text-gray-400 dark:text-gray-500 group-hover:text-white" />
        </div>

        {/* RIGHT PANEL: Code Editor + Results */}
        <div 
          className="flex flex-col bg-white dark:bg-gray-900 overflow-hidden"
          style={{ width: `${100 - leftPanelWidth}%` }}
          data-right-panel
        >
          {/* Editor Toolbar */}
          <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-2 flex items-center justify-between flex-shrink-0">
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

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting}
                className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium text-sm"
              >
                {isRunning ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Run</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSubmitCode}
                disabled={isRunning || isSubmitting}
                className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Code Editor Area */}
          <div 
            className="overflow-hidden"
            style={{ height: isResultOpen ? `${100 - resultPanelHeight}%` : '100%', transition: isDraggingHorizontal.current ? 'none' : 'height 0.2s ease' }}
          >
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
            />
          </div>

          {/* HORIZONTAL RESIZE HANDLE + Result Toggle */}
          {isResultOpen && (
            <div
              className="h-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-500 cursor-row-resize flex items-center justify-center flex-shrink-0 transition-colors group"
              onMouseDown={handleHorizontalDragStart}
            >
              <GripHorizontal className="w-3 h-3 text-gray-400 dark:text-gray-500 group-hover:text-white" />
            </div>
          )}

          {/* Result Panel Toggle Bar */}
          <div 
            className="flex items-center justify-between px-4 py-1.5 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 cursor-pointer flex-shrink-0"
            onClick={() => {
              if (testResults) setIsResultOpen(!isResultOpen)
            }}
          >
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {testResults 
                ? (testResults.isSubmission 
                    ? `Submission: ${testResults.status === 'accepted' ? 'Accepted' : 'Failed'}` 
                    : `Test Results: ${testResults.passed}/${testResults.total} Passed`)
                : 'Output'
              }
            </span>
            {testResults && (
              <button className="p-0.5">
                {isResultOpen ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                )}
              </button>
            )}
          </div>

          {/* Result Panel Content */}
          {isResultOpen && testResults && (
            <div 
              className="overflow-y-auto scrollbar-thin border-t border-gray-200 dark:border-gray-800 flex-shrink-0"
              style={{ height: `${resultPanelHeight}%` }}
            >
              <div className="p-4">
                {testResults.error ? (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200 font-medium">Error</p>
                    <p className="text-red-700 dark:text-red-300 text-sm mt-1">{testResults.error}</p>
                  </div>
                ) : testResults.isSubmission ? (
                  <div>
                    <div className={`p-4 rounded-lg border mb-3 ${
                      testResults.status === 'accepted'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Submission Result: {testResults.status === 'accepted' ? 'Accepted ✓' : 'Failed ✗'}
                      </h3>
                      <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                        <p>Test Cases Passed: {testResults.passed}/{testResults.total}</p>
                        {testResults.runtime && <p>Runtime: {testResults.runtime}s</p>}
                        {testResults.memory && <p>Memory: {testResults.memory} KB</p>}
                        {testResults.errorMessage && (
                          <p className="text-red-600 dark:text-red-400 mt-2">
                            Error: {testResults.errorMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Test Results: {testResults.passed}/{testResults.total} Passed
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {testResults.cases?.map((testCase, index) => (
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
                              Test Case {index + 1} - {testCase.status}
                            </span>
                          </div>
                          <div className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                            <p><span className="font-medium">Input:</span> {testCase.input}</p>
                            <p><span className="font-medium">Expected:</span> {testCase.expected}</p>
                            <p><span className="font-medium">Actual:</span> {testCase.actual}</p>
                            {testCase.time && <p><span className="font-medium">Time:</span> {testCase.time}s</p>}
                            {testCase.memory && <p><span className="font-medium">Memory:</span> {testCase.memory} KB</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
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
