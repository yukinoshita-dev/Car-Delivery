import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { ReservationForm } from '@/features/reservations/components/ReservationForm'

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))

vi.mock('@/features/reservations/hooks/useAvailableCars', () => ({
  useAvailableCars: vi.fn(() => ({
    data: [{ id: 1, name: 'プリウス1号', plate_number: '品川300あ1234',
              capacity: 5, is_available: true, model: null, total_mileage: 0, created_at: '' }],
    isLoading: false,
  })),
}))

vi.mock('@/features/reservations/hooks/useCreateReservation', () => ({
  useCreateReservation: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
  })),
}))

vi.mock('@/features/reservations/components/DateTimePicker', () => ({
  DateTimePicker: ({ onChange, value }: { onChange: (v: string) => void; value: string }) => (
    <input
      data-testid="datetime-picker"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}))

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient()
  return createElement(QueryClientProvider, { client: qc }, children)
}

describe('ReservationForm', () => {
  it('フォームの主要な入力欄が表示される', () => {
    render(<ReservationForm />, { wrapper })
    expect(screen.getByLabelText(/行先/)).toBeInTheDocument()
    expect(screen.getByLabelText(/目的/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '申請する' })).toBeInTheDocument()
  })

  it('行先を空にして送信するとバリデーションエラーが表示される', async () => {
    render(<ReservationForm />, { wrapper })
    await userEvent.click(screen.getByRole('button', { name: '申請する' }))
    await waitFor(() => {
      expect(screen.getByText(/行先を入力してください/)).toBeInTheDocument()
    })
  })
})
