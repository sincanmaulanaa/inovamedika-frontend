import { queryOptions } from '@tanstack/react-query'
import { getPrescription, getPrescriptions } from './prescription.api'
import type { PrescriptionListQuery } from './prescription.types'

export const prescriptionKeys = {
  all: ['prescriptions'] as const,
  lists: () => [...prescriptionKeys.all, 'list'] as const,
  list: (filters: PrescriptionListQuery) =>
    [...prescriptionKeys.lists(), filters] as const,
  details: () => [...prescriptionKeys.all, 'detail'] as const,
  detail: (id: string) => [...prescriptionKeys.details(), id] as const,
}

export const prescriptionsQueryOptions = (query: PrescriptionListQuery) =>
  queryOptions({
    queryKey: prescriptionKeys.list(query),
    queryFn: () => getPrescriptions(query),
    enabled: Boolean(query.patientId),
  })

export const prescriptionQueryOptions = (id: string) =>
  queryOptions({
    queryKey: prescriptionKeys.detail(id),
    queryFn: () => getPrescription(id),
    enabled: Boolean(id),
  })
