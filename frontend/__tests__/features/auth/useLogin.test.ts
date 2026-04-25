import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useAuthStore } from '@/features/auth/store'
import { useLogin } from '@/features/auth/hooks/useLogin'

vi.mock('@/lib/api', () => ({
  apiClient: {
    post: vi.fn(),
  },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return createElement(QueryClientProvider, { client: qc }, children)
}

describe('useLogin', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, email: null, role: null })
    document.cookie = 'token=; max-age=0'
    vi.clearAllMocks()
  })

  it('ログイン成功時に Zustand store を更新する', async () => {
    const { apiClient } = await import('@/lib/api')
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      access_token: 'jwt-abc',
      token_type: 'bearer',
      role: 'admin',
      email: 'admin@example.com',
    })

    const { result } = renderHook(() => useLogin(), { wrapper })
    await act(async () => {
      await result.current.mutateAsync({
        email: 'admin@example.com',
        password: 'any',
        role: 'admin',
      })
    })

    const { token, email, role } = useAuthStore.getState()
    expect(token).toBe('jwt-abc')
    expect(email).toBe('admin@example.com')
    expect(role).toBe('admin')
  })

  it('ログイン成功時に token Cookie をセットする', async () => {
    const { apiClient } = await import('@/lib/api')
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      access_token: 'jwt-abc',
      token_type: 'bearer',
      role: 'user',
      email: 'user@example.com',
    })

    const { result } = renderHook(() => useLogin(), { wrapper })
    await act(async () => {
      await result.current.mutateAsync({
        email: 'user@example.com',
        password: 'any',
        role: 'user',
      })
    })

    expect(document.cookie).toContain('token=jwt-abc')
  })
})
