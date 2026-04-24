import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { useAuthStore } from '@/features/auth/store'
import type { LoginRequest, LoginResponse } from '@/types'

export function useLogin() {
  const { login } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: LoginRequest) =>
      apiClient.post<LoginResponse>('/auth/login', data),
    onSuccess: (res) => {
      login(res.access_token, res.email, res.role)
      document.cookie = `token=${res.access_token}; path=/; max-age=86400`
      router.push('/dashboard')
    },
  })
}
