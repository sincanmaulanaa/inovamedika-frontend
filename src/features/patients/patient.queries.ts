import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'
import { getPatient, listPatients } from '@/features/patients/patient.api'
import { patientKeys } from '@/features/patients/patient.keys'
import type { PatientListParams } from '@/features/patients/patient.types'

export function patientListQueryOptions(params: PatientListParams) {
  return queryOptions({
    placeholderData: keepPreviousData,
    queryFn: ({ signal }) => listPatients(params, signal),
    queryKey: patientKeys.list(params),
  })
}

export function patientDetailQueryOptions(patientId: string) {
  return queryOptions({
    enabled: patientId.length > 0,
    queryFn: ({ signal }) => getPatient(patientId, signal),
    queryKey: patientKeys.detail(patientId),
  })
}

export function usePatientListQuery(params: PatientListParams) {
  return useQuery(patientListQueryOptions(params))
}

export function usePatientDetailQuery(patientId: string) {
  return useQuery(patientDetailQueryOptions(patientId))
}
