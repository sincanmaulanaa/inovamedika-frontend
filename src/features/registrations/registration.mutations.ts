import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createRegistration, updateRegistration } from './registration.api'
import { registrationKeys } from './registration.queries'
import type {
  CreateRegistrationData,
  UpdateRegistrationData,
} from './registration.types'

export const useCreateRegistrationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRegistrationData) => createRegistration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: registrationKeys.lists() })
    },
  })
}

export const useUpdateRegistrationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRegistrationData }) =>
      updateRegistration(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: registrationKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: registrationKeys.detail(data.id),
      })
    },
  })
}
