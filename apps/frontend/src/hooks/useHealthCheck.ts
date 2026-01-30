import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api'

export interface HealthResponse {
  status: 'ok' | 'error' | 'degraded'
  timestamp: string
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiGet<HealthResponse>('/health'),
    // Uses global defaults: staleTime 5min, retry 3, refetchOnWindowFocus true
  })
}
