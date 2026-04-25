import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Role } from '@/types'

interface AuthState {
  token: string | null
  email: string | null
  role: Role | null
  login: (token: string, email: string, role: Role) => void
  logout: () => void
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      email: null,
      role: null,
      login: (token, email, role) => set({ token, email, role }),
      logout: () => {
        set({ token: null, email: null, role: null })
        if (typeof document !== 'undefined') {
          document.cookie = 'token=; path=/; max-age=0'
        }
      },
      isAdmin: () => get().role === 'admin',
    }),
    {
      name: 'auth-storage',
    }
  )
)
