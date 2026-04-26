import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { ReservationDetail } from '@/types'

export function useCompleteMyReservation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, mileage_used }: { id: number; mileage_used: number }) =>
      apiClient.put<ReservationDetail>(`/reservations/${id}`, {
        status: 'completed',
        mileage_used,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reservations'] })
      queryClient.invalidateQueries({ queryKey: ['all-reservations'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}
