import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login, logout, refreshSession } from '@/features/auth/auth.api'
import { authKeys } from '@/features/auth/auth.keys'
import { useUiStore } from '@/shared/stores/ui.store'

export function useLoginMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      queryClient.setQueryData(authKeys.session(), session)
    },
  })
}

export function useRefreshSessionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: refreshSession,
    onSuccess: (session) => {
      queryClient.setQueryData(authKeys.session(), session)
    },
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSettled: async () => {
      await queryClient.cancelQueries()
      queryClient.clear()
      queryClient.setQueryData(authKeys.session(), null)
      useUiStore.getState().resetUi()
    },
  })
}
