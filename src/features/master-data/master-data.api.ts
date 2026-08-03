import { apiClient } from '@/lib/http/http-client'
import type {
  DoctorData,
  MedicationData,
  PayerData,
  PolyclinicData,
} from './master-data.types'

export const getActiveDoctors = async (): Promise<readonly DoctorData[]> => {
  const response = await apiClient.get<{
    readonly data: readonly DoctorData[]
  }>('/api/v1/master-data/doctors')
  return response.data.data
}

export const getActivePolyclinics = async (): Promise<
  readonly PolyclinicData[]
> => {
  const response = await apiClient.get<{
    readonly data: readonly PolyclinicData[]
  }>('/api/v1/master-data/polyclinics')
  return response.data.data
}

export const getActivePayers = async (): Promise<readonly PayerData[]> => {
  const response = await apiClient.get<{ readonly data: readonly PayerData[] }>(
    '/api/v1/master-data/payers',
  )
  return response.data.data
}

export const getActiveMedications = async (): Promise<
  readonly MedicationData[]
> => {
  const response = await apiClient.get<{
    readonly data: readonly MedicationData[]
  }>('/api/v1/master-data/medications')
  return response.data.data
}
