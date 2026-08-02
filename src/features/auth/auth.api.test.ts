import type { AxiosResponse } from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { restoreSession } from '@/features/auth/auth.api'
import { apiClient } from '@/lib/http/http-client'
import { clearAuthCredentials } from '@/lib/http/auth-token'
import {
  createAuthSessionFixture,
  createIssuedAuthSessionFixture,
} from '@/test/auth-session.fixture'

describe('authentication API', () => {
  afterEach(() => {
    document.cookie = 'inovamedika_csrf=; Max-Age=0; Path=/'
    clearAuthCredentials()
  })

  it('uses the browser-wide CSRF cookie to restore a session after reload', async () => {
    const session = createAuthSessionFixture()
    const issuedSession = createIssuedAuthSessionFixture(
      'REGISTRATION_OFFICER',
      session,
    )
    document.cookie = `${encodeURIComponent('inovamedika_csrf')}=${encodeURIComponent(
      issuedSession.csrfToken,
    )}; Path=/`
    const requestSpy = vi.spyOn(apiClient, 'request').mockResolvedValue({
      data: { data: issuedSession, message: 'Sesi tetap aktif', success: true },
      status: 200,
    } as AxiosResponse)

    await expect(restoreSession()).resolves.toEqual(session)
    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: { 'X-CSRF-Token': issuedSession.csrfToken },
        skipAccessToken: true,
        skipAuthRecovery: true,
        url: '/refresh',
      }),
    )
  })
})
