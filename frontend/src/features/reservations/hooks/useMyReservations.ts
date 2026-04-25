import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { ReservationDetail } from '@/types'

export function useMyReservations(limit = 50) {
  return useQuery({
    queryKey: ['my-reservations', limit],
    queryFn: () => apiClient.get<ReservationDetail[]>(`/reservations/me?limit=${limit}`),
  })
}
