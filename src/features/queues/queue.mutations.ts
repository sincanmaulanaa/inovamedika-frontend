import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  callNextQueue,
  createQueue,
  recallQueue,
  requeueQueue,
  skipQueue,
  startQueue,
} from './queue.api'
import { queueKeys } from './queue.queries'
import type { CallNextQueueData, CreateQueueData } from './queue.types'
import { registrationKeys } from '../registrations'

export const useCreateQueueMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateQueueData) => createQueue(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queueKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: registrationKeys.detail(data.registrationId),
      })
    },
  })
}

export const useCallNextQueueMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      polyclinicId,
      data,
    }: {
      polyclinicId: string
      data: CallNextQueueData
    }) => callNextQueue(polyclinicId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queueKeys.lists() })
    },
  })
}

export const useRecallQueueMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, rowVersion }: { id: string; rowVersion: number }) =>
      recallQueue(id, rowVersion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queueKeys.lists() })
    },
  })
}

export const useSkipQueueMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, rowVersion }: { id: string; rowVersion: number }) =>
      skipQueue(id, rowVersion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queueKeys.lists() })
    },
  })
}

export const useRequeueQueueMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, rowVersion }: { id: string; rowVersion: number }) =>
      requeueQueue(id, rowVersion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queueKeys.lists() })
    },
  })
}

export const useStartQueueMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, rowVersion }: { id: string; rowVersion: number }) =>
      startQueue(id, rowVersion),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queueKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: registrationKeys.detail(data.registrationId),
      })
    },
  })
}
