import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '@/features/auth/store'

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, email: null, role: null })
  })

  it('初期状態では token / email / role がすべて null', () => {
    const { token, email, role } = useAuthStore.getState()
    expect(token).toBeNull()
    expect(email).toBeNull()
    expect(role).toBeNull()
  })

  it('login() で token / email / role が保存される', () => {
    useAuthStore.getState().login('jwt-token-abc', 'test@example.com', 'user')
    const { token, email, role } = useAuthStore.getState()
    expect(token).toBe('jwt-token-abc')
    expect(email).toBe('test@example.com')
    expect(role).toBe('user')
  })

  it('logout() で token / email / role がリセットされる', () => {
    useAuthStore.getState().login('jwt-token-abc', 'test@example.com', 'admin')
    useAuthStore.getState().logout()
    const { token, email, role } = useAuthStore.getState()
    expect(token).toBeNull()
    expect(email).toBeNull()
    expect(role).toBeNull()
  })

  it('isAdmin() は role が admin のとき true を返す', () => {
    useAuthStore.getState().login('token', 'admin@example.com', 'admin')
    expect(useAuthStore.getState().isAdmin()).toBe(true)
  })

  it('isAdmin() は role が user のとき false を返す', () => {
    useAuthStore.getState().login('token', 'user@example.com', 'user')
    expect(useAuthStore.getState().isAdmin()).toBe(false)
  })
})
