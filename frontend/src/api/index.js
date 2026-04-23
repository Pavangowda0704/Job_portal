import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser    = (data) => API.post('/auth/login', data)
export const getMe        = ()     => API.get('/auth/me')
export const getAllJobs   = (params) => API.get('/jobs', { params })
export const getJobById  = (id)     => API.get(`/jobs/${id}`)
export const createJob   = (data)   => API.post('/jobs', data)
export const updateJob   = (id, data) => API.put(`/jobs/${id}`, data)
export const deleteJob   = (id)     => API.delete(`/jobs/${id}`)
export const applyToJob  = (id)     => API.post(`/jobs/${id}/apply`)

export default API