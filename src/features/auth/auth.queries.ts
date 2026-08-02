import { queryOptions, useQuery, type QueryClient } from '@tanstack/react-query'
import { refreshSession, restoreSession } from '@/features/auth/auth.api'
import { authKeys } from '@/features/auth/auth.keys'
import type { AuthSession } from '@/features/auth/auth.types'

const authSessionQueryOptions = queryOptions({
  queryFn: restoreSession,
  queryKey: authKeys.session(),
  retry: false,
  staleTime: Number.POSITIVE_INFINITY,
})

export function useAuthSession() {
  return useQuery(authSessionQueryOptions)
}

export async function refreshCachedSession(
  queryClient: QueryClient,
): Promise<AuthSession> {
  const session = await refreshSession()
  queryClient.setQueryData(authKeys.session(), session)
  return session
}
