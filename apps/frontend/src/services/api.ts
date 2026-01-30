import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token when available
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Future: Add JWT token from auth context
    // const token = getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// Response interceptor configured via api-setup.ts for toast notifications
// Basic console logging kept as fallback
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Fallback console logging if toast not configured
    if (error.response?.status === 401) {
      console.warn('Unauthorized request - authentication required')
    }
    if (error.response?.status === 403) {
      console.warn('Forbidden - insufficient permissions')
    }
    if (error.response?.status === 500) {
      console.error('Server error:', error.message)
    }
    return Promise.reject(error)
  }
)

// Typed API methods
export const apiGet = <T>(url: string) =>
  api.get<T>(url).then(res => res.data)

export const apiPost = <T>(url: string, data?: unknown) =>
  api.post<T>(url, data).then(res => res.data)

export const apiPut = <T>(url: string, data?: unknown) =>
  api.put<T>(url, data).then(res => res.data)

export const apiPatch = <T>(url: string, data?: unknown) =>
  api.patch<T>(url, data).then(res => res.data)

export const apiDelete = <T>(url: string) =>
  api.delete<T>(url).then(res => res.data)
