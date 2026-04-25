import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'

vi.mock('@/lib/api', () => ({
  apiClient: { get: vi.fn(), put: vi.fn() },
}))

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return createElement(QueryClientProvider, { client: qc }, children)
}

const mockToday = [
  {
    id: 1, car_id: 1, car_name: 'プリウス1号', user_id: 2, user_name: '田中太郎',
    user_email: 'user@demo.com', destination: '新宿区役所', purpose: '書類提出',
    start_datetime: '2026-04-25T09:00:00', end_datetime: '2026-04-25T12:00:00', status: 'approved' as const,
  },
]

const mockPending = [
  {
    id: 3, user_id: 2, car_id: 1, car_name: 'プリウス1号', user_name: '田中太郎',
    user_email: 'user@demo.com', destination: '横浜市役所', purpose: '打ち合わせ',
    start_datetime: '2026-04-26T10:00:00', end_datetime: '2026-04-26T13:00:00',
    status: 'pending' as const, mileage_used: 0, note: null, created_at: '2026-04-25T00:00:00',
  },
]

describe('useTodaySchedule', () => {
  beforeEach(() => vi.clearAllMocks())

  it('today schedule を取得する', async () => {
    const { apiClient } = await import('@/lib/api')
    vi.mocked(apiClient.get).mockResolvedValueOnce(mockToday)
    const { useTodaySchedule } = await import('@/features/dashboard/hooks/useTodaySchedule')
    const { result } = renderHook(() => useTodaySchedule(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data![0].car_name).toBe('プリウス1号')
  })
})

describe('usePendingApprovals', () => {
  beforeEach(() => vi.clearAllMocks())

  it('pending 予約一覧を取得する', async () => {
    const { apiClient } = await import('@/lib/api')
    vi.mocked(apiClient.get).mockResolvedValueOnce(mockPending)
    const { usePendingApprovals } = await import('@/features/dashboard/hooks/usePendingApprovals')
    const { result } = renderHook(() => usePendingApprovals(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data![0].status).toBe('pending')
  })
})

describe('useApproveReservation', () => {
  beforeEach(() => vi.clearAllMocks())

  it('承認時に PUT /reservations/3 を呼ぶ', async () => {
    const { apiClient } = await import('@/lib/api')
    vi.mocked(apiClient.put).mockResolvedValueOnce({ ...mockPending[0], status: 'approved' })
    const { useApproveReservation } = await import('@/features/dashboard/hooks/useApproveReservation')
    const { result } = renderHook(() => useApproveReservation(), { wrapper })
    await act(async () => {
      await result.current.mutateAsync({ id: 3, status: 'approved' })
    })
    expect(apiClient.put).toHaveBeenCalledWith('/reservations/3', { status: 'approved' })
  })
})
