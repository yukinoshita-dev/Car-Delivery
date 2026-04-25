import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useLogin } from '@/features/auth/hooks/useLogin'

// useLogin フックのモック
vi.mock('@/features/auth/hooks/useLogin', () => ({
  useLogin: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
  })),
}))

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return createElement(QueryClientProvider, { client: qc }, children)
}

describe('LoginForm', () => {
  it('デモ告知バナーが表示される', () => {
    render(<LoginForm />, { wrapper })
    expect(screen.getByText(/ポートフォリオ用のデモシステム/)).toBeInTheDocument()
  })

  it('「一般社員」「管理者」ボタンが表示される', () => {
    render(<LoginForm />, { wrapper })
    expect(screen.getByRole('button', { name: '一般社員' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '管理者' })).toBeInTheDocument()
  })

  it('メールアドレスとパスワードの入力欄がある', () => {
    render(<LoginForm />, { wrapper })
    expect(screen.getByLabelText(/メールアドレス/)).toBeInTheDocument()
    expect(screen.getByLabelText(/パスワード/)).toBeInTheDocument()
  })

  it('メールを空にして送信するとバリデーションエラーが表示される', async () => {
    render(<LoginForm />, { wrapper })
    await userEvent.click(screen.getByRole('button', { name: 'ログイン' }))
    await waitFor(() => {
      expect(screen.getByText(/メールアドレスを入力してください/)).toBeInTheDocument()
    })
  })

  it('ローディング中はボタンが無効化される', () => {
    vi.mocked(useLogin).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
      isError: false,
      error: null,
    } as ReturnType<typeof useLogin>)

    render(<LoginForm />, { wrapper })
    expect(screen.getByRole('button', { name: 'ログイン中...' })).toBeDisabled()
  })
})
