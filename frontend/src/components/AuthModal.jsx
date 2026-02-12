import { useState } from 'react'
import { X, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode) // 'login', 'register', 'forgot'
  const [formData, setFormData] = useState({
    identifier: '', // Can be email or username for login
    username: '',
    email: '',
    password: ''
  })
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const { login } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (mode === 'forgot') {
      // TODO: Replace with actual API call to your backend
      // Example API call for forgot password:
      // await axios.post('/api/auth/forgot-password', { email: formData.email })
      
      // Mock forgot password for demo
      setResetEmailSent(true)
      setTimeout(() => {
        setResetEmailSent(false)
        setMode('login')
      }, 3000)
      return
    }
    
    // TODO: Replace with actual API call to your backend
    // The backend will return user data with role based on credentials
    // Example API call for login:
    // const response = await axios.post('/api/auth/login', {
    //   identifier: formData.identifier, // email or username
    //   password: formData.password
    // })
    // 
    // Example API call for register:
    // const response = await axios.post('/api/auth/register', {
    //   username: formData.username,
    //   email: formData.email,
    //   password: formData.password
    // })
    // 
    // login(response.data.user)
    // localStorage.setItem('token', response.data.token)
    
    // Mock authentication for demo
    const userData = {
      id: Date.now(),
      username: mode === 'login' ? formData.identifier : formData.username,
      email: formData.email,
      role: 'user' // Backend will set this to 'admin' if credentials match admin account
    }
    
    login(userData)
    onClose()
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md mx-4 p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="mb-6">
          {mode === 'forgot' && (
            <button
              onClick={() => setMode('login')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </button>
          )}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {mode === 'login' && 'Sign In'}
            {mode === 'register' && 'Create Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          {mode === 'forgot' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          )}
        </div>

        {resetEmailSent ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
            <p className="text-green-800 dark:text-green-200 font-medium">
              Password reset link sent!
            </p>
            <p className="text-sm text-green-600 dark:text-green-300 mt-1">
              Check your email for instructions.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'forgot' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your email"
              />
            </div>
          ) : mode === 'login' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email or Username
              </label>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your email or username"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </>
          )}

          {mode !== 'forgot' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your password"
              />
            </div>
          )}

          {mode === 'login' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            {mode === 'login' && 'Sign In'}
            {mode === 'register' && 'Create Account'}
            {mode === 'forgot' && 'Send Reset Link'}
          </button>
        </form>
        )}

        {mode !== 'forgot' && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {mode === 'login' 
                ? "Don't have an account? Register" 
                : 'Already have an account? Sign In'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthModal
