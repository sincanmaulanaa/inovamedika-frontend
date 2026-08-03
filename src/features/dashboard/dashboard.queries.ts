import { queryOptions } from '@tanstack/react-query'
import { getDashboardSummary } from './dashboard.api'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: (date?: string) =>
    [...dashboardKeys.all, 'summary', date] as const,
}

export const dashboardSummaryQueryOptions = (date?: string) =>
  queryOptions({
    queryKey: dashboardKeys.summary(date),
    queryFn: () => getDashboardSummary(date),
    refetchInterval: 1000 * 60, // Refetch every minute
  })
