import { api } from './api'

interface ToastService {
  showError: (title: string, description?: string) => void
}

let toastService: ToastService | null = null

export function setupApiErrorHandling(toast: ToastService) {
  toastService = toast
}

// Enhanced error interceptor that uses toast notifications
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (toastService && error.response) {
      const status = error.response.status

      if (status === 401) {
        toastService.showError(
          'Authentication Required',
          'Please log in to continue'
        )
      } else if (status === 403) {
        toastService.showError(
          'Access Denied',
          'You do not have permission to perform this action'
        )
      } else if (status === 500) {
        toastService.showError(
          'Server Error',
          'An unexpected error occurred. Please try again later'
        )
      } else if (status >= 400 && status < 500) {
        toastService.showError(
          'Request Failed',
          error.response.data?.message || 'The request could not be completed'
        )
      }
    }

    return Promise.reject(error)
  }
)
