import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials), // credentials: { identifier, password }
  register: (userData) => api.post('/auth/register', userData), // userData: { username, email, password }
  logout: () => api.post('/auth/logout')
}

// Problem APIs
export const problemAPI = {
  getAll: (filters) => api.get('/problems', { params: filters }),
  getById: (id) => api.get(`/problems/${id}`),
  create: (problemData) => api.post('/problems', problemData),
  update: (id, problemData) => api.put(`/problems/${id}`, problemData),
  delete: (id) => api.delete(`/problems/${id}`)
}

// Compiler API
export const compilerAPI = {
  runCode: (data) => api.post('/compile', data)
}

export default api
