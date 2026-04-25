import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { UserOut } from '@/types'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.get<UserOut[]>('/users/'),
  })
}
