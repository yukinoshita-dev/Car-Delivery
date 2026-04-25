import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'

vi.mock('@/lib/api', () => ({
  apiClient: { get: vi.fn() },
}))

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return createElement(QueryClientProvider, { client: qc }, children)
}

const mockReservations = [
  {
    id: 1, user_id: 2, car_id: 1, car_name: 'プリウス1号', user_name: '田中太郎',
    user_email: 'user@demo.com', destination: '新宿区役所', purpose: '書類提出',
    start_datetime: '2026-04-26T10:00:00', end_datetime: '2026-04-26T13:00:00',
    status: 'pending' as const, mileage_used: 0, note: null, created_at: '2026-04-25T00:00:00',
  },
]

describe('useAllReservations', () => {
  beforeEach(() => vi.clearAllMocks())

  it('status 未指定 → GET /reservations/ を呼ぶ', async () => {
    const { apiClient } = await import('@/lib/api')
    vi.mocked(apiClient.get).mockResolvedValueOnce(mockReservations)
    const { useAllReservations } = await import('@/features/admin/hooks/useAllReservations')
    const { result } = renderHook(() => useAllReservations(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(apiClient.get).toHaveBeenCalledWith('/reservations/')
  })

  it('status="pending" → GET /reservations/?status=pending を呼ぶ', async () => {
    const { apiClient } = await import('@/lib/api')
    vi.mocked(apiClient.get).mockResolvedValueOnce(mockReservations)
    const { useAllReservations } = await import('@/features/admin/hooks/useAllReservations')
    const { result } = renderHook(() => useAllReservations('pending'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(apiClient.get).toHaveBeenCalledWith('/reservations/?status=pending')
  })
})
