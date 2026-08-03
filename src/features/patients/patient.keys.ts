import type { PatientListParams } from '@/features/patients/patient.types'

export const patientKeys = {
  all: ['patients'] as const,
  detail: (patientId: string) => [...patientKeys.details(), patientId] as const,
  details: () => [...patientKeys.all, 'detail'] as const,
  list: (params: PatientListParams) =>
    [...patientKeys.lists(), params] as const,
  lists: () => [...patientKeys.all, 'list'] as const,
}
