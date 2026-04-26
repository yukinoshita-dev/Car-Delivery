import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { ReservationDetail, ReservationStatus } from '@/types'

export function useApproveReservation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, rejection_reason }: { id: number; status: Extract<ReservationStatus, 'approved' | 'cancelled'>; rejection_reason?: string }) =>
      apiClient.put<ReservationDetail>(`/reservations/${id}`, {
        status,
        ...(rejection_reason !== undefined ? { rejection_reason } : {}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['all-reservations'] })
      queryClient.invalidateQueries({ queryKey: ['my-reservations'] })
    },
  })
}
