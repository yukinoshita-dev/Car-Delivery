import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

export interface MonthlyStatItem {
  month: string
  count: number
}

export function useMonthlyStats() {
  return useQuery({
    queryKey: ['monthly-stats'],
    queryFn: () => apiClient.get<MonthlyStatItem[]>('/dashboard/monthly'),
  })
}
