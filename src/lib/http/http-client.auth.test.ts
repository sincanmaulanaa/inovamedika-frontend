import {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { registerAuthRecoveryHandler } from '@/lib/http/auth-recovery'
import { setAccessToken } from '@/lib/http/auth-token'
import { apiClient } from '@/lib/http/http-client'

const defaultAdapter = apiClient.defaults.adapter

describe('authenticated HTTP client', () => {
  afterEach(() => {
    apiClient.defaults.adapter = defaultAdapter
  })

  it('refreshes once and retries concurrent unauthorized requests once', async () => {
    let releaseRecovery: () => void = () => undefined
    let recoveryCount = 0
    const recoveryBarrier = new Promise<void>((resolve) => {
      releaseRecovery = resolve
    })
    const attempts = new Map<string, number>()
    const retryAuthorizationHeaders: string[] = []
    const adapter: AxiosAdapter = async (config) => {
      const url = config.url ?? ''
      const attempt = (attempts.get(url) ?? 0) + 1
      attempts.set(url, attempt)

      if (attempt === 1) {
        throw createUnauthorizedError(config)
      }

      const authorizationHeader = config.headers.get('Authorization')
      retryAuthorizationHeaders.push(
        typeof authorizationHeader === 'string' ? authorizationHeader : '',
      )
      return {
        config,
        data: { request: url },
        headers: new AxiosHeaders(),
        status: 200,
        statusText: 'OK',
      }
    }
    apiClient.defaults.adapter = adapter
    setAccessToken('expired-access-token')
    const unregister = registerAuthRecoveryHandler(async () => {
      recoveryCount += 1
      await recoveryBarrier
      setAccessToken('refreshed-access-token')
    })

    const firstRequest = apiClient.get('/first')
    const secondRequest = apiClient.get('/second')

    await vi.waitFor(() => {
      expect(recoveryCount).toBe(1)
    })
    releaseRecovery()

    await expect(
      Promise.all([firstRequest, secondRequest]),
    ).resolves.toHaveLength(2)
    expect(recoveryCount).toBe(1)
    expect(attempts).toEqual(
      new Map([
        ['/first', 2],
        ['/second', 2],
      ]),
    )
    expect(retryAuthorizationHeaders).toEqual([
      'Bearer refreshed-access-token',
      'Bearer refreshed-access-token',
    ])
    unregister()
  })
})

function createUnauthorizedError(
  config: InternalAxiosRequestConfig,
): AxiosError {
  const response: AxiosResponse = {
    config,
    data: {
      code: 'SESSION_EXPIRED',
      message: 'Sesi Anda telah berakhir. Silakan masuk kembali.',
      success: false,
    },
    headers: new AxiosHeaders(),
    status: 401,
    statusText: 'Unauthorized',
  }

  return new AxiosError(
    'Unauthorized',
    'ERR_BAD_RESPONSE',
    config,
    undefined,
    response,
  )
}
