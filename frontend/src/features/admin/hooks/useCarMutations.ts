import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { CarOut, CarCreate, CarUpdate } from '@/types'

export function useCreateCar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CarCreate) => apiClient.post<CarOut>('/cars/', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cars'] }),
  })
}

export function useUpdateCar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CarUpdate }) =>
      apiClient.put<CarOut>(`/cars/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cars'] }),
  })
}

export function useDeleteCar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => apiClient.delete<void>(`/cars/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cars'] }),
  })
}
