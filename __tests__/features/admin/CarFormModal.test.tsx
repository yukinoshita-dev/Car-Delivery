import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { CarFormModal } from '@/features/admin/components/CarFormModal'

vi.mock('@/features/admin/hooks/useCarMutations', () => ({
  useCreateCar: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useUpdateCar: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}))

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient()
  return createElement(QueryClientProvider, { client: qc }, children)
}

describe('CarFormModal (Create mode)', () => {
  it('車両名・ナンバー入力欄が表示される', () => {
    render(<CarFormModal open={true} onOpenChange={vi.fn()} />, { wrapper })
    expect(screen.getByLabelText(/車両名/)).toBeInTheDocument()
    expect(screen.getByLabelText(/ナンバー/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '追加する' })).toBeInTheDocument()
  })

  it('車両名を空にして送信するとバリデーションエラーが表示される', async () => {
    render(<CarFormModal open={true} onOpenChange={vi.fn()} />, { wrapper })
    await userEvent.click(screen.getByRole('button', { name: '追加する' }))
    await waitFor(() => {
      expect(screen.getByText(/車両名を入力してください/)).toBeInTheDocument()
    })
  })
})
