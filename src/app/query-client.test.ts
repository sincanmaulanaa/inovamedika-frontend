import { describe, expect, it } from 'vitest'
import {
  createAppQueryClient,
  shouldRetryServerQuery,
} from '@/app/query-client'
import { ApiError } from '@/lib/http/api-error'

describe('query client defaults', () => {
  it('makes the ADR cache and refetch contract explicit', () => {
    const options = createAppQueryClient().getDefaultOptions()

    expect(options.queries).toMatchObject({
      gcTime: 300_000,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    })
    expect(options.mutations?.retry).toBe(false)
  })

  it('retries a network or server failure at most once', () => {
    const serverError = new ApiError({
      message: 'Server unavailable',
      code: 'HTTP_ERROR',
      status: 503,
    })
    const conflictError = new ApiError({
      message: 'Conflict',
      code: 'ACTIVE_REGISTRATION_EXISTS',
      status: 409,
    })

    expect(shouldRetryServerQuery(0, serverError)).toBe(true)
    expect(shouldRetryServerQuery(1, serverError)).toBe(false)
    expect(shouldRetryServerQuery(0, conflictError)).toBe(false)
  })
})
