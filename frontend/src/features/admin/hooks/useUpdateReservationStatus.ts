import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { ReservationDetail, ReservationStatus } from '@/types'

interface UpdateStatusParams {
  id: number
  status: ReservationStatus
  mileage_used?: number
}

export function useUpdateReservationStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, mileage_used }: UpdateStatusParams) =>
      apiClient.put<ReservationDetail>(`/reservations/${id}`, {
        status,
        ...(mileage_used !== undefined ? { mileage_used } : {}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-reservations'] })
      queryClient.invalidateQueries({ queryKey: ['today-schedule'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] })
    },
  })
}
