import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'

vi.mock('@/lib/api', () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return createElement(QueryClientProvider, { client: qc }, children)
}

const mockCar = {
  id: 1,
  name: 'プリウス1号',
  plate_number: '品川300あ1234',
  model: null,
  capacity: 5,
  is_available: true,
  total_mileage: 0,
  created_at: '2026-04-25T00:00:00',
}

describe('useCars', () => {
  beforeEach(() => vi.clearAllMocks())

  it('GET /cars/ を呼ぶ', async () => {
    const { apiClient } = await import('@/lib/api')
    vi.mocked(apiClient.get).mockResolvedValueOnce([mockCar])
    const { useCars } = await import('@/features/admin/hooks/useCars')
    const { result } = renderHook(() => useCars(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(apiClient.get).toHaveBeenCalledWith('/cars/')
  })
})
