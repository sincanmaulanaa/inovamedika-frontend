import { z } from 'zod'
import {
  patientFormValuesToRequest,
  patientListSchema,
  patientSchema,
  type CreatePatientRequest,
  type Patient,
  type PatientList,
  type PatientListParams,
  type UpdatePatientRequest,
} from '@/features/patients/patient.types'
import { requestApi } from '@/lib/http/http-client'

const emptyResponseSchema = z.null()

export async function listPatients(
  params: PatientListParams,
  signal?: AbortSignal,
): Promise<PatientList> {
  return requestApi({
    method: 'GET',
    schema: patientListSchema,
    url: '/api/v1/patients',
    params: { ...params } as Record<
      string,
      string | number | boolean | undefined
    >,
    signal,
  })
}

export async function getPatient(
  patientId: string,
  signal?: AbortSignal,
): Promise<Patient> {
  return requestApi({
    schema: patientSchema,
    signal,
    url: `/patients/${patientId}`,
  })
}

export async function createPatient(
  values: CreatePatientRequest,
): Promise<Patient> {
  return requestApi({
    data: values,
    method: 'POST',
    schema: patientSchema,
    url: '/patients',
  })
}

export async function updatePatient(input: {
  readonly patientId: string
  readonly values: UpdatePatientRequest
}): Promise<Patient> {
  return requestApi({
    data: input.values,
    method: 'PUT',
    schema: patientSchema,
    url: `/patients/${input.patientId}`,
  })
}

export async function deletePatient(patientId: string): Promise<void> {
  await requestApi({
    method: 'DELETE',
    schema: emptyResponseSchema,
    url: `/patients/${patientId}`,
  })
}

export { patientFormValuesToRequest }
