import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { ReservationDetail } from '@/types'

export function usePendingMileage() {
  return useQuery({
    queryKey: ['pending-mileage'],
    queryFn: () => apiClient.get<ReservationDetail[]>('/reservations/pending-mileage'),
  })
}
