import { apiClient } from '@/lib/http/http-client'
import type {
  MedicalRecordAmendmentData,
  MedicalRecordData,
  MedicalRecordFinalizeData,
  MedicalRecordListData,
  MedicalRecordListQuery,
  MedicalRecordMutationData,
  MedicalRecordUpdateData,
} from './medical-record.types'

export const getMedicalRecords = async (
  query: MedicalRecordListQuery,
): Promise<MedicalRecordListData> => {
  const searchParams = new URLSearchParams()
  if (query.page) searchParams.set('page', query.page.toString())
  if (query.limit) searchParams.set('limit', query.limit.toString())
  searchParams.set('patientId', query.patientId)
  if (query.doctorId) searchParams.set('doctorId', query.doctorId)
  if (query.polyclinicId) searchParams.set('polyclinicId', query.polyclinicId)

  const response = await apiClient.get<{
    readonly data: MedicalRecordListData
  }>(`/api/v1/medical-records?${searchParams.toString()}`)
  return response.data.data
}

export const getMedicalRecord = async (
  id: string,
): Promise<MedicalRecordData> => {
  const response = await apiClient.get<{ readonly data: MedicalRecordData }>(
    `/api/v1/medical-records/${id}`,
  )
  return response.data.data
}

export const createMedicalRecord = async (
  data: MedicalRecordMutationData,
): Promise<MedicalRecordData> => {
  const response = await apiClient.post<{ readonly data: MedicalRecordData }>(
    '/api/v1/medical-records',
    data,
  )
  return response.data.data
}

export const updateMedicalRecord = async (
  id: string,
  data: MedicalRecordUpdateData,
): Promise<MedicalRecordData> => {
  const response = await apiClient.put<{ readonly data: MedicalRecordData }>(
    `/api/v1/medical-records/${id}`,
    data,
  )
  return response.data.data
}

export const amendMedicalRecord = async (
  id: string,
  data: MedicalRecordAmendmentData,
): Promise<MedicalRecordData> => {
  const response = await apiClient.post<{ readonly data: MedicalRecordData }>(
    `/api/v1/medical-records/${id}/amend`,
    data,
  )
  return response.data.data
}

export const finalizeMedicalRecord = async (
  id: string,
  data: MedicalRecordFinalizeData,
): Promise<MedicalRecordData> => {
  const response = await apiClient.post<{ readonly data: MedicalRecordData }>(
    `/api/v1/medical-records/${id}/finalize`,
    data,
  )
  return response.data.data
}
