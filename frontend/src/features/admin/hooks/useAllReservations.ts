import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { ReservationDetail } from '@/types'

export function useAllReservations(status?: string) {
  return useQuery({
    queryKey: ['all-reservations', status],
    queryFn: () => apiClient.get<ReservationDetail[]>(
      status ? `/reservations/?status=${status}` : '/reservations/'
    ),
  })
}
