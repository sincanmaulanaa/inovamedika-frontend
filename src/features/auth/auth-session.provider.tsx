import { useQueryClient } from '@tanstack/react-query'
import { useEffect, type ReactNode } from 'react'
import { authKeys } from '@/features/auth/auth.keys'
import { refreshCachedSession } from '@/features/auth/auth.queries'
import { registerAuthRecoveryHandler } from '@/lib/http/auth-recovery'
import { clearAuthCredentials } from '@/lib/http/auth-token'

interface AuthSessionProviderProps {
  readonly children: ReactNode
}

export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  const queryClient = useQueryClient()

  useEffect(() => {
    return registerAuthRecoveryHandler(async () => {
      try {
        await refreshCachedSession(queryClient)
      } catch (error) {
        clearAuthCredentials()
        queryClient.setQueryData(authKeys.session(), null)
        throw error
      }
    })
  }, [queryClient])

  return children
}
