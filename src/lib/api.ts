import { useAuthStore } from '@/features/auth/store'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

function getHeaders(): Record<string, string> {
  const token = useAuthStore.getState().token
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { headers: initHeaders, ...restInit } = init
  const extraHeaders: Record<string, string> =
    initHeaders instanceof Headers
      ? Object.fromEntries(initHeaders.entries())
      : Array.isArray(initHeaders)
      ? Object.fromEntries(initHeaders)
      : (initHeaders as Record<string, string> | undefined) ?? {}

  const res = await fetch(`${BASE_URL}${path}`, {
    ...restInit,
    headers: {
      ...getHeaders(),
      ...extraHeaders,
    },
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(error.detail ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
