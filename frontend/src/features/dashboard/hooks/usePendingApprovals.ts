import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { ReservationDetail } from '@/types'

export function usePendingApprovals() {
  return useQuery({
    queryKey: ['pending-approvals'],
    queryFn: () => apiClient.get<ReservationDetail[]>('/reservations?status=pending'),
  })
}
