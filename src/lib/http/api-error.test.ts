import {
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { describe, expect, it } from 'vitest'
import { normalizeApiError } from '@/lib/http/api-error'

const requestConfig = {
  headers: new AxiosHeaders(),
} as InternalAxiosRequestConfig

describe('normalizeApiError', () => {
  it('keeps the safe backend error contract', () => {
    const response: AxiosResponse = {
      config: requestConfig,
      data: {
        success: false,
        message: 'Pendaftaran aktif sudah ada.',
        code: 'ACTIVE_REGISTRATION_EXISTS',
        requestId: 'req-123',
      },
      headers: {},
      status: 409,
      statusText: 'Conflict',
    }
    const error = new AxiosError(
      'Request failed',
      'ERR_BAD_RESPONSE',
      requestConfig,
      undefined,
      response,
    )

    expect(normalizeApiError(error)).toMatchObject({
      code: 'ACTIVE_REGISTRATION_EXISTS',
      message: 'Pendaftaran aktif sudah ada.',
      requestId: 'req-123',
      status: 409,
    })
  })

  it('normalizes a network failure without exposing transport details', () => {
    const error = new AxiosError('socket detail', 'ERR_NETWORK')

    expect(normalizeApiError(error)).toMatchObject({
      code: 'NETWORK_ERROR',
      message: 'Layanan belum dapat dihubungi. Periksa koneksi lalu coba lagi.',
      status: null,
    })
  })

  it('does not expose an HTTP status in fallback copy', () => {
    const response: AxiosResponse = {
      config: requestConfig,
      data: '<html>upstream failure</html>',
      headers: {},
      status: 502,
      statusText: 'Bad Gateway',
    }
    const error = new AxiosError(
      'Request failed with status code 502',
      'ERR_BAD_RESPONSE',
      requestConfig,
      undefined,
      response,
    )
    const normalizedError = normalizeApiError(error)

    expect(normalizedError.message).toBe(
      'Layanan sedang mengalami kendala. Coba lagi beberapa saat lagi.',
    )
    expect(normalizedError.message).not.toContain('502')
  })
})
