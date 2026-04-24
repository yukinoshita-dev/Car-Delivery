import { create } from 'zustand'

interface UIState {
  collapsed: boolean
  toggleSidebar: () => void
}

export const useUIStore = create<UIState>()((set) => ({
  collapsed: false,
  toggleSidebar: () => set((state) => ({ collapsed: !state.collapsed })),
}))
