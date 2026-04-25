import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { ReservationRow } from '@/features/admin/components/ReservationRow'
import type { ReservationDetail } from '@/types'

vi.mock('@/features/dashboard/hooks/useApproveReservation', () => ({
  useApproveReservation: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}))

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient()
  return createElement(QueryClientProvider, { client: qc }, children)
}

const base: ReservationDetail = {
  id: 1, user_id: 2, car_id: 1, car_name: 'プリウス1号', user_name: '田中太郎',
  user_email: 'user@demo.com', destination: '新宿区役所', purpose: '書類提出',
  start_datetime: '2026-04-26T10:00:00', end_datetime: '2026-04-26T13:00:00',
  status: 'pending', mileage_used: 0, note: null, created_at: '2026-04-25T00:00:00',
}

describe('ReservationRow', () => {
  it('pending の予約 → 承認・却下ボタンが表示される', () => {
    render(<ReservationRow reservation={base} />, { wrapper })
    expect(screen.getByRole('button', { name: '承認' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '却下' })).toBeInTheDocument()
  })

  it('approved の予約 → ボタンが表示されない', () => {
    render(<ReservationRow reservation={{ ...base, status: 'approved' }} />, { wrapper })
    expect(screen.queryByRole('button', { name: '承認' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '却下' })).not.toBeInTheDocument()
  })
})
