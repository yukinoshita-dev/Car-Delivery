import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { Reservation, ReservationCreateRequest } from '@/types'

export function useCreateReservation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ReservationCreateRequest) =>
      apiClient.post<Reservation>('/reservations/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reservations'] })
      queryClient.invalidateQueries({ queryKey: ['today-schedule'] })
    },
  })
}
