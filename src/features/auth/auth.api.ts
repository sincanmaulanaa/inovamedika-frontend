import { z } from 'zod'
import {
  issuedAuthSessionSchema,
  type AuthSession,
  type IssuedAuthSession,
  type LoginCredentials,
} from '@/features/auth/auth.types'
import { requestApi } from '@/lib/http/http-client'
import {
  clearAuthCredentials,
  getCsrfToken,
  setAccessToken,
  setCsrfToken,
} from '@/lib/http/auth-token'

const emptyResponseSchema = z.null()

export async function login(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  const session = await requestApi({
    data: credentials,
    method: 'POST',
    schema: issuedAuthSessionSchema,
    skipAccessToken: true,
    skipAuthRecovery: true,
    url: '/api/v1/login',
  })

  return acceptIssuedSession(session)
}

export async function refreshSession(): Promise<AuthSession> {
  const csrfToken = getCsrfToken()

  if (!csrfToken) {
    throw new Error('CSRF token is not available')
  }

  const session = await requestApi({
    headers: { 'X-CSRF-Token': csrfToken },
    method: 'POST',
    schema: issuedAuthSessionSchema,
    skipAccessToken: true,
    skipAuthRecovery: true,
    url: '/api/v1/refresh',
  })

  return acceptIssuedSession(session)
}

export async function restoreSession(): Promise<AuthSession | null> {
  if (!getCsrfToken()) {
    clearAuthCredentials()
    return null
  }

  try {
    return await refreshSession()
  } catch (error) {
    clearAuthCredentials()

    if (isExpiredSessionError(error)) {
      return null
    }

    throw error
  }
}

export async function logout(): Promise<void> {
  const csrfToken = getCsrfToken()

  if (!csrfToken) {
    clearAuthCredentials()
    return
  }

  try {
    await requestApi({
      headers: { 'X-CSRF-Token': csrfToken },
      method: 'POST',
      schema: emptyResponseSchema,
      skipAccessToken: true,
      skipAuthRecovery: true,
      url: '/api/v1/logout',
    })
  } finally {
    clearAuthCredentials()
  }
}

function acceptIssuedSession(session: IssuedAuthSession): AuthSession {
  setAccessToken(session.accessToken)
  setCsrfToken(session.csrfToken)

  return {
    accessTokenExpiresInSeconds: session.accessTokenExpiresInSeconds,
    profile: session.profile,
    sessionExpiresAt: session.sessionExpiresAt,
  }
}

function isExpiredSessionError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'SESSION_EXPIRED'
  )
}
