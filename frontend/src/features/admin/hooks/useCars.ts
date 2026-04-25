import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { CarOut } from '@/types'

export function useCars() {
  return useQuery({
    queryKey: ['cars'],
    queryFn: () => apiClient.get<CarOut[]>('/cars/'),
  })
}
