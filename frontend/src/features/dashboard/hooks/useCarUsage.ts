import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

export interface CarUsageItem {
  car: string
  count: number
}

export function useCarUsage() {
  return useQuery({
    queryKey: ['car-usage'],
    queryFn: () => apiClient.get<CarUsageItem[]>('/dashboard/car-usage'),
  })
}
