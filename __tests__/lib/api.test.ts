import { describe, it, expect, vi, beforeEach } from 'vitest'

// Zustand store のモック
vi.mock('@/features/auth/store', () => ({
  useAuthStore: {
    getState: () => ({ token: 'test-token-123' }),
  },
}))

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

    const { apiClient } = await import('@/lib/api')
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

    const { apiClient } = await import('@/lib/api')
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

    const { apiClient } = await import('@/lib/api')
    await expect(apiClient.get('/cars')).rejects.toThrow()
  })
})
