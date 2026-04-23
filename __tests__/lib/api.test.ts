import { describe, it, expect, vi, beforeEach } from 'vitest'

// Zustand store のモック
vi.mock('@/features/auth/store', () => ({
  useAuthStore: {
    getState: vi.fn(() => ({ token: 'test-token-123' })),
  },
}))

import { apiClient } from '@/lib/api'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('apiClient', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('GETリクエストに Authorization ヘッダーを付与する', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'ok' }),
    })

    await apiClient.get('/cars')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/cars'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token-123',
        }),
      })
    )
  })

  it('POSTリクエストに Content-Type と body を付与する', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1 }),
    })

    await apiClient.post('/cars', { name: 'プリウス1号' })

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/cars'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token-123',
        }),
        body: JSON.stringify({ name: 'プリウス1号' }),
      })
    )
  })

  it('レスポンスが ok でない場合は Error をスローする', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ detail: 'Unauthorized' }),
    })

    await expect(apiClient.get('/cars')).rejects.toThrow('Unauthorized')
  })

  it('token が null のとき Authorization ヘッダーを付与しない', async () => {
    const { useAuthStore } = await import('@/features/auth/store')
    vi.mocked(useAuthStore.getState).mockReturnValueOnce({ token: null } as any)

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })

    await apiClient.get('/cars')

    const callArgs = mockFetch.mock.calls[0][1] as RequestInit
    const headers = callArgs.headers as Record<string, string>
    expect(headers.Authorization).toBeUndefined()
  })
})
