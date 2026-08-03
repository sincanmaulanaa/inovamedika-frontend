import { apiClient } from '@/lib/http/http-client'
import type {
  CallNextQueueData,
  CreateQueueData,
  QueueData,
  QueueListData,
  QueueListQuery,
} from './queue.types'

export const getQueues = async (
  query: QueueListQuery,
): Promise<QueueListData> => {
  const searchParams = new URLSearchParams()
  if (query.polyclinicId) searchParams.set('polyclinicId', query.polyclinicId)
  if (query.status) searchParams.set('status', query.status)
  if (query.serviceDate) searchParams.set('serviceDate', query.serviceDate)

  const response = await apiClient.get<{ readonly data: QueueListData }>(
    `/api/v1/queues?${searchParams.toString()}`,
  )
  return response.data.data
}

export const createQueue = async (
  data: CreateQueueData,
): Promise<QueueData> => {
  const response = await apiClient.post<{ readonly data: QueueData }>(
    '/api/v1/queues',
    data,
  )
  return response.data.data
}

export const callNextQueue = async (
  polyclinicId: string,
  data: CallNextQueueData,
): Promise<QueueData> => {
  const response = await apiClient.post<{ readonly data: QueueData }>(
    `/api/v1/queues/lanes/${polyclinicId}/call-next`,
    data,
  )
  return response.data.data
}

export const recallQueue = async (
  id: string,
  rowVersion: number,
): Promise<QueueData> => {
  const response = await apiClient.post<{ readonly data: QueueData }>(
    `/api/v1/queues/${id}/recall`,
    { rowVersion },
  )
  return response.data.data
}

export const skipQueue = async (
  id: string,
  rowVersion: number,
): Promise<QueueData> => {
  const response = await apiClient.post<{ readonly data: QueueData }>(
    `/api/v1/queues/${id}/skip`,
    { rowVersion },
  )
  return response.data.data
}

export const requeueQueue = async (
  id: string,
  rowVersion: number,
): Promise<QueueData> => {
  const response = await apiClient.post<{ readonly data: QueueData }>(
    `/api/v1/queues/${id}/requeue`,
    { rowVersion },
  )
  return response.data.data
}

export const startQueue = async (
  id: string,
  rowVersion: number,
): Promise<QueueData> => {
  const response = await apiClient.post<{ readonly data: QueueData }>(
    `/api/v1/queues/${id}/start`,
    { rowVersion },
  )
  return response.data.data
}
