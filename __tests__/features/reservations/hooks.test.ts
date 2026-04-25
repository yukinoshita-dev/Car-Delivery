import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'

vi.mock('@/lib/api', () => ({
  apiClient: { get: vi.fn(), post: vi.fn() },
}))

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return createElement(QueryClientProvider, { client: qc }, children)
}

const mockCars = [
  { id: 1, name: 'プリウス1号', plate_number: '品川300あ1234', model: 'Toyota Prius',
    capacity: 5, is_available: true, total_mileage: 12500, created_at: '2026-01-01T00:00:00' },
]

describe('useAvailableCars', () => {
  beforeEach(() => vi.clearAllMocks())

  it('start・end が null のときは fetch しない', async () => {
    const { apiClient } = await import('@/lib/api')
    const { useAvailableCars } = await import('@/features/reservations/hooks/useAvailableCars')
    const { result } = renderHook(() => useAvailableCars(null, null), { wrapper })
    await new Promise((r) => setTimeout(r, 50))
    expect(apiClient.get).not.toHaveBeenCalled()
    expect(result.current.data).toBeUndefined()
  })

  it('start・end が揃ったら空き車両を取得する', async () => {
    const { apiClient } = await import('@/lib/api')
    vi.mocked(apiClient.get).mockResolvedValueOnce(mockCars)
    const { useAvailableCars } = await import('@/features/reservations/hooks/useAvailableCars')
    const { result } = renderHook(
      () => useAvailableCars('2026-04-26T09:00:00', '2026-04-26T12:00:00'),
      { wrapper }
    )
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data![0].name).toBe('プリウス1号')
  })
})

describe('useCreateReservation', () => {
  beforeEach(() => vi.clearAllMocks())

  it('POST /reservations/ を呼ぶ', async () => {
    const { apiClient } = await import('@/lib/api')
    vi.mocked(apiClient.post).mockResolvedValueOnce({ id: 10, status: 'pending' })
    const { useCreateReservation } = await import('@/features/reservations/hooks/useCreateReservation')
    const { result } = renderHook(() => useCreateReservation(), { wrapper })
    await act(async () => {
      await result.current.mutateAsync({
        car_id: 1,
        start_datetime: '2026-04-26T09:00:00',
        end_datetime: '2026-04-26T12:00:00',
        destination: '新宿区役所',
        purpose: '書類提出',
      })
    })
    expect(apiClient.post).toHaveBeenCalledWith('/reservations/', expect.objectContaining({
      car_id: 1,
      destination: '新宿区役所',
    }))
  })
})
