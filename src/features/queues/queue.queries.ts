import { queryOptions } from '@tanstack/react-query'
import { getQueues } from './queue.api'
import type { QueueListQuery } from './queue.types'

export const queueKeys = {
  all: ['queues'] as const,
  lists: () => [...queueKeys.all, 'list'] as const,
  list: (filters: QueueListQuery) => [...queueKeys.lists(), filters] as const,
}

export const queuesQueryOptions = (query: QueueListQuery) =>
  queryOptions({
    queryKey: queueKeys.list(query),
    queryFn: () => getQueues(query),
    refetchInterval: 1000 * 10, // Poll every 10 seconds for real-time queue updates
  })
