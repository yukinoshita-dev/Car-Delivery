import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

interface MileagePayload {
  id: number
  mileage_used?: number
  not_used: boolean
}

export function useSubmitMileage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, mileage_used, not_used }: MileagePayload) =>
      apiClient.put(`/reservations/${id}`, {
        status: 'completed',
        mileage_used: not_used ? 0 : (mileage_used ?? 0),
        not_used,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-mileage'] })
      queryClient.invalidateQueries({ queryKey: ['my-reservations'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}
