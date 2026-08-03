import { apiClient } from '@/lib/http/http-client'
import type {
  PrescriptionData,
  PrescriptionFinalizeData,
  PrescriptionListData,
  PrescriptionListQuery,
  PrescriptionMutationData,
  PrescriptionUpdateData,
} from './prescription.types'

export const getPrescriptions = async (
  query: PrescriptionListQuery,
): Promise<PrescriptionListData> => {
  const searchParams = new URLSearchParams()
  if (query.page) searchParams.set('page', query.page.toString())
  if (query.limit) searchParams.set('limit', query.limit.toString())
  searchParams.set('patientId', query.patientId)
  if (query.doctorId) searchParams.set('doctorId', query.doctorId)

  const response = await apiClient.get<{ readonly data: PrescriptionListData }>(
    `/api/v1/prescriptions?${searchParams.toString()}`,
  )
  return response.data.data
}

export const getPrescription = async (
  id: string,
): Promise<PrescriptionData> => {
  const response = await apiClient.get<{ readonly data: PrescriptionData }>(
    `/api/v1/prescriptions/${id}`,
  )
  return response.data.data
}

export const createPrescription = async (
  data: PrescriptionMutationData,
): Promise<PrescriptionData> => {
  const response = await apiClient.post<{ readonly data: PrescriptionData }>(
    '/api/v1/prescriptions',
    data,
  )
  return response.data.data
}

export const updatePrescription = async (
  id: string,
  data: PrescriptionUpdateData,
): Promise<PrescriptionData> => {
  const response = await apiClient.put<{ readonly data: PrescriptionData }>(
    `/api/v1/prescriptions/${id}`,
    data,
  )
  return response.data.data
}

export const finalizePrescription = async (
  id: string,
  data: PrescriptionFinalizeData,
): Promise<PrescriptionData> => {
  const response = await apiClient.post<{ readonly data: PrescriptionData }>(
    `/api/v1/prescriptions/${id}/finalize`,
    data,
  )
  return response.data.data
}

export const cancelPrescription = async (
  id: string,
  data: PrescriptionFinalizeData,
): Promise<PrescriptionData> => {
  const response = await apiClient.post<{ readonly data: PrescriptionData }>(
    `/api/v1/prescriptions/${id}/cancel`,
    data,
  )
  return response.data.data
}
