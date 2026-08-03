import type { PatientListParams } from '@/features/patients/patient.types'

const defaultPage = 1
const defaultLimit = 10
const allowedLimits = [10, 25, 50] as const

export const patientPageSizeOptions = [...allowedLimits]

export function readPatientListSearchParams(
  searchParams: URLSearchParams,
): PatientListParams {
  const page = readPositiveInteger(searchParams.get('page'), defaultPage)
  const limitValue = readPositiveInteger(
    searchParams.get('limit'),
    defaultLimit,
  )
  const limit = allowedLimits.includes(
    limitValue as (typeof allowedLimits)[number],
  )
    ? limitValue
    : defaultLimit
  const search = searchParams.get('search')?.trim()

  return {
    limit,
    page,
    ...(search ? { search } : {}),
  }
}

export function createPatientListSearchParams(
  params: PatientListParams,
): URLSearchParams {
  const searchParams = new URLSearchParams()
  searchParams.set('page', String(params.page))
  searchParams.set('limit', String(params.limit))

  if (params.search) {
    searchParams.set('search', params.search)
  }

  return searchParams
}

function readPositiveInteger(value: string | null, fallback: number): number {
  if (!value) {
    return fallback
  }

  const parsedValue = Number(value)
  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback
}
