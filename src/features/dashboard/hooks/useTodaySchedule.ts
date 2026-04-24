import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { TodayReservation } from '@/types'

export function useTodaySchedule() {
  return useQuery({
    queryKey: ['today-schedule'],
    queryFn: () => apiClient.get<TodayReservation[]>('/dashboard/today'),
  })
}
