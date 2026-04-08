import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../utils/api'

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode)
  const [formData, setFormData] = useState({
    emailId: '',
    firstName: '',
    lastName: '',
    age: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let response;

      if (mode === 'login') {
        response = await authAPI.login({
          emailId: formData.emailId,
          password: formData.password
        })
      } else {
        response = await authAPI.register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          emailId: formData.emailId,
          age: parseInt(formData.age),
          password: formData.password
        })
      }


      const backendUser = response?.data?.data

      const userData = {
        id: backendUser?._id || Date.now(),
        username: backendUser?.firstName || formData.firstName || formData.emailId.split('@')[0],
        email: backendUser?.emailId || formData.emailId,
        role: backendUser?.role || 'user'
      }

      localStorage.setItem('user', JSON.stringify(userData))
      login(userData)

      onClose()

      // Redirect based on role
      if (userData.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }

    } catch (err) {
      console.error('Authentication error:', err)
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Authentication failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {mode === 'login' && 'Sign In'}
            {mode === 'register' && 'Create Account'}
          </h2>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'login' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="emailId"
                value={formData.emailId}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                placeholder="Enter your email"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  minLength={3}
                  maxLength={20}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  minLength={3}
                  maxLength={20}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                  placeholder="Enter your last name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  min={10}
                  max={80}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                  placeholder="Enter your age"
                />
              </div>
            </>
          )}

          {mode !== 'forgot' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 pr-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {mode === 'register' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Password must be strong (min 8 chars, uppercase, lowercase, number, symbol)
                </p>
              )}
            </div>
          )}

          {mode === 'login' && (
            <div className="flex justify-end">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Forgot password?
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {mode !== 'forgot' && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              disabled={loading}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
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
