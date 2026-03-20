import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Important: Send cookies with requests
})

// Add token to requests if available (backend uses cookies, but keep this for compatibility)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auto-logout on 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// Auth APIs - Connected to backend
export const authAPI = {
  login: (credentials) => api.post('/user/login', credentials), // credentials: { identifier, password }
  register: (userData) => api.post('/user/register', userData), // userData: { username, email, password }
  logout: () => api.post('/user/logout'),
  getProfile: () => api.get('/user/getProfile')
}

// Problem APIs - NOT YET CONNECTED (backend endpoints not mounted)
export const problemAPI = {
  getAll: (filters) => api.get('/problems', { params: filters }),
  getById: (id) => api.get(`/problems/${id}`),
  create: (problemData) => api.post('/problems', problemData),
  update: (id, problemData) => api.put(`/problems/${id}`, problemData),
  delete: (id) => api.delete(`/problems/${id}`)
}

// Compiler API - NOT YET AVAILABLE (backend endpoint doesn't exist)
export const compilerAPI = {
  runCode: (data) => api.post('/compile', data)
}

export default api
