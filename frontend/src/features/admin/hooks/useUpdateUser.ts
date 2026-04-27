import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { UserOut } from '@/types'

export interface UserUpdatePayload {
  name?: string
  role?: 'admin' | 'user'
  is_active?: boolean
  password?: string
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserUpdatePayload }) =>
      apiClient.put<UserOut>(`/users/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}
