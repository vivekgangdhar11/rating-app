import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 with one-time refresh attempt
let isRefreshing = false
let pendingRequests = []

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response && error.response.status === 401 && !original._retry) {
      original._retry = true
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }

      isRefreshing = true
      try {
        const resp = await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/users/refresh', {}, {
          headers: { Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '' }
        })
        const newToken = resp.data.token
        localStorage.setItem('token', newToken)
        pendingRequests.forEach(({ resolve }) => resolve(newToken))
        pendingRequests = []
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch (e) {
        pendingRequests.forEach(({ reject }) => reject(e))
        pendingRequests = []
        localStorage.removeItem('token')
        window.location.href = '/login'
        return Promise.reject(e)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export default api


