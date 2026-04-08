import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true 
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname
      if (currentPath !== '/' && !currentPath.includes('/problem/')) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => api.post('/user/login', credentials), 
  register: (userData) => api.post('/user/register', userData), 
  logout: () => api.post('/user/logout'),
  getProfile: () => api.get('/user/getProfile')
}

export const problemAPI = {
  getAll: (filters) => api.get('/problem', { params: filters }),
  getById: (id) => api.get(`/problem/${id}`),
  create: (problemData) => api.post('/problem/create', problemData),
  update: (id, problemData) => api.put(`/problem/update/${id}`, problemData),
  delete: (id) => api.delete(`/problem/delete/${id}`),
  getUserProblems: () => api.get('/problem/user')
}

export const submissionAPI = {
  runCode: (problemId, data) => api.post(`/submission/run/${problemId}`, data),
  submitCode: (problemId, data) => api.post(`/submission/submit/${problemId}`, data)
}

export const compilerAPI = {
  runCode: (data) => api.post('/compile', data)
}

export default api
