import { apiClient } from '@/lib/http/http-client'
import type {
  CreateRegistrationData,
  RegistrationData,
  RegistrationListData,
  RegistrationListQuery,
  UpdateRegistrationData,
} from './registration.types'

export const getRegistrations = async (
  query: RegistrationListQuery,
): Promise<RegistrationListData> => {
  const searchParams = new URLSearchParams()
  if (query.page) searchParams.set('page', query.page.toString())
  if (query.limit) searchParams.set('limit', query.limit.toString())
  if (query.date) searchParams.set('date', query.date)
  if (query.status) searchParams.set('status', query.status)
  if (query.doctorId) searchParams.set('doctorId', query.doctorId)
  if (query.polyclinicId) searchParams.set('polyclinicId', query.polyclinicId)
  if (query.search) searchParams.set('search', query.search)

  const response = await apiClient.get<{ readonly data: RegistrationListData }>(
    `/api/v1/registrations?${searchParams.toString()}`,
  )
  return response.data.data
}

export const getRegistration = async (
  id: string,
): Promise<RegistrationData> => {
  const response = await apiClient.get<{ readonly data: RegistrationData }>(
    `/api/v1/registrations/${id}`,
  )
  return response.data.data
}

export const createRegistration = async (
  data: CreateRegistrationData,
): Promise<RegistrationData> => {
  const response = await apiClient.post<{ readonly data: RegistrationData }>(
    '/api/v1/registrations',
    data,
  )
  return response.data.data
}

export const updateRegistration = async (
  id: string,
  data: UpdateRegistrationData,
): Promise<RegistrationData> => {
  const response = await apiClient.put<{ readonly data: RegistrationData }>(
    `/api/v1/registrations/${id}`,
    data,
  )
  return response.data.data
}
