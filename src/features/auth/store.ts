import { create } from 'zustand'

interface AuthState {
  token: string | null
  role: 'admin' | 'user' | null
  email: string | null
  setAuth: (token: string, role: 'admin' | 'user', email: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  email: null,
  setAuth: (token, role, email) => set({ token, role, email }),
  clearAuth: () => set({ token: null, role: null, email: null }),
}))
