import { queryOptions } from '@tanstack/react-query'
import { getRegistration, getRegistrations } from './registration.api'
import type { RegistrationListQuery } from './registration.types'

export const registrationKeys = {
  all: ['registrations'] as const,
  lists: () => [...registrationKeys.all, 'list'] as const,
  list: (filters: RegistrationListQuery) =>
    [...registrationKeys.lists(), filters] as const,
  details: () => [...registrationKeys.all, 'detail'] as const,
  detail: (id: string) => [...registrationKeys.details(), id] as const,
}

export const registrationsQueryOptions = (query: RegistrationListQuery) =>
  queryOptions({
    queryKey: registrationKeys.list(query),
    queryFn: () => getRegistrations(query),
  })

export const registrationQueryOptions = (id: string) =>
  queryOptions({
    queryKey: registrationKeys.detail(id),
    queryFn: () => getRegistration(id),
  })
