const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

interface FetchOptions {
  method?: string
  body?: unknown
  params?: Record<string, string>
}

async function adminFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = new URL(`${API}${endpoint}`)
  if (options.params) {
    Object.entries(options.params).forEach(([k, v]) => url.searchParams.set(k, v))
  }

  const res = await fetch(url.toString(), {
    method: options.method ?? 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const body = await res.json()
  if (!res.ok || !body.success) {
    throw { status: res.status, message: body.message ?? 'API error', errors: body.errors }
  }
  return body.data as T
}

export function adminList<T>(endpoint: string, params?: Record<string, string>) {
  return adminFetch<T[]>(endpoint, { params })
}

export function adminGet<T>(endpoint: string) {
  return adminFetch<T>(endpoint)
}

export function adminCreate<T>(endpoint: string, data: unknown) {
  return adminFetch<T>(endpoint, { method: 'POST', body: data })
}

export function adminUpdate<T>(endpoint: string, data: unknown) {
  return adminFetch<T>(endpoint, { method: 'PUT', body: data })
}

export function adminDelete(endpoint: string) {
  return adminFetch<void>(endpoint, { method: 'DELETE' })
}

export { API }
