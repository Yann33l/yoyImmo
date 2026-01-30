import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useHealthCheck } from './useHealthCheck'
import * as api from '@/services/api'
import type { ReactNode } from 'react'

vi.mock('@/services/api')

describe('useHealthCheck', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })
    vi.clearAllMocks()
  })

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  it('fetches health status successfully', async () => {
    const mockData = { status: 'ok' as const, timestamp: '2024-01-01T00:00:00.000Z' }
    vi.mocked(api.apiGet).mockResolvedValue(mockData)

    const { result } = renderHook(() => useHealthCheck(), { wrapper })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockData)
    expect(api.apiGet).toHaveBeenCalledWith('/health')
  })

  it('handles error state', async () => {
    vi.mocked(api.apiGet).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useHealthCheck(), { wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeTruthy()
  })

  it('uses correct query key', () => {
    const { result } = renderHook(() => useHealthCheck(), { wrapper })

    // Query key should be accessible via queryClient
    const queries = queryClient.getQueryCache().getAll()
    expect(queries.length).toBeGreaterThan(0)
    expect(queries[0].queryKey).toEqual(['health'])
  })
})
