import { apiClient } from '@/lib/http/http-client'
import type { DashboardSummaryData } from './dashboard.types'

export const getDashboardSummary = async (
  date?: string,
): Promise<DashboardSummaryData> => {
  const searchParams = new URLSearchParams()
  if (date) searchParams.set('date', date)

  const response = await apiClient.get<{ readonly data: DashboardSummaryData }>(
    `/api/v1/dashboard/summary?${searchParams.toString()}`,
  )
  return response.data.data
}
