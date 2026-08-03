export type QueueStatus = 'WAITING' | 'SERVING' | 'COMPLETED' | 'SKIPPED'

export interface QueueData {
  readonly id: string
  readonly registrationId: string
  readonly polyclinicId: string
  readonly queueNumber: string
  readonly status: QueueStatus
  readonly serviceDate: string
  readonly callCount: number
  readonly lastCalledAt: string | null
  readonly createdAt: string
  readonly rowVersion: number
}

export interface QueueListData {
  readonly items: readonly QueueData[]
}

export interface QueueListQuery {
  readonly polyclinicId?: string
  readonly status?: QueueStatus
  readonly serviceDate?: string
}

export interface CreateQueueData {
  readonly registrationId: string
}

export interface CallNextQueueData {
  readonly serviceDate: string
}
