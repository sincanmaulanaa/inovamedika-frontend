import { queryOptions } from '@tanstack/react-query'
import {
  getActiveDoctors,
  getActiveMedications,
  getActivePayers,
  getActivePolyclinics,
} from './master-data.api'

export const masterDataKeys = {
  all: ['master-data'] as const,
  doctors: () => [...masterDataKeys.all, 'doctors'] as const,
  medications: () => [...masterDataKeys.all, 'medications'] as const,
  payers: () => [...masterDataKeys.all, 'payers'] as const,
  polyclinics: () => [...masterDataKeys.all, 'polyclinics'] as const,
}

export const doctorsQueryOptions = queryOptions({
  queryKey: masterDataKeys.doctors(),
  queryFn: getActiveDoctors,
  staleTime: 1000 * 60 * 60, // 1 hour
})

export const polyclinicsQueryOptions = queryOptions({
  queryKey: masterDataKeys.polyclinics(),
  queryFn: getActivePolyclinics,
  staleTime: 1000 * 60 * 60,
})

export const payersQueryOptions = queryOptions({
  queryKey: masterDataKeys.payers(),
  queryFn: getActivePayers,
  staleTime: 1000 * 60 * 60,
})

export const medicationsQueryOptions = queryOptions({
  queryKey: masterDataKeys.medications(),
  queryFn: getActiveMedications,
  staleTime: 1000 * 60 * 60,
})
