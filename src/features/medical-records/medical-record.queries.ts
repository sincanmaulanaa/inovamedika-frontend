import { queryOptions, useQuery } from '@tanstack/react-query'
import { getMedicalRecord, getMedicalRecords } from './medical-record.api'
import type { MedicalRecordListQuery } from './medical-record.types'

export const medicalRecordKeys = {
  all: ['medical-records'] as const,
  lists: () => [...medicalRecordKeys.all, 'list'] as const,
  list: (filters: MedicalRecordListQuery) =>
    [...medicalRecordKeys.lists(), filters] as const,
  details: () => [...medicalRecordKeys.all, 'detail'] as const,
  detail: (id: string) => [...medicalRecordKeys.details(), id] as const,
}

export const medicalRecordsQueryOptions = (query: MedicalRecordListQuery) =>
  queryOptions({
    queryKey: medicalRecordKeys.list(query),
    queryFn: () => getMedicalRecords(query),
    enabled: Boolean(query.patientId),
  })

export const medicalRecordQueryOptions = (id: string) =>
  queryOptions({
    queryKey: medicalRecordKeys.detail(id),
    queryFn: () => getMedicalRecord(id),
    enabled: Boolean(id),
  })

export const useMedicalRecordDetailQuery = (id: string) => {
  return useQuery(medicalRecordQueryOptions(id))
}
