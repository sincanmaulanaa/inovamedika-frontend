import { QueryClient } from '@tanstack/react-query'
import { isRetryableApiError } from '@/lib/http/api-error'

const QUERY_STALE_TIME_MS = 30_000
const QUERY_GARBAGE_COLLECTION_TIME_MS = 5 * 60_000

export function shouldRetryServerQuery(
  failureCount: number,
  error: unknown,
): boolean {
  return failureCount < 1 && isRetryableApiError(error)
}

export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
      queries: {
        gcTime: QUERY_GARBAGE_COLLECTION_TIME_MS,
        refetchOnWindowFocus: false,
        retry: shouldRetryServerQuery,
        staleTime: QUERY_STALE_TIME_MS,
      },
    },
  })
}
