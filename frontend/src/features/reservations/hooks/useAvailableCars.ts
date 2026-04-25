import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { CarOut } from '@/types'

export function useAvailableCars(start: string | null, end: string | null) {
  return useQuery({
    queryKey: ['available-cars', start, end],
    queryFn: () =>
      apiClient.get<CarOut[]>(
        `/cars/available?start=${encodeURIComponent(start!)}&end=${encodeURIComponent(end!)}`
      ),
    enabled: !!start && !!end,
  })
}
