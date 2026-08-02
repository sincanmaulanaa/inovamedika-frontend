import type { AuthSession, IssuedAuthSession } from '@/features/auth/auth.types'

export function createAuthSessionFixture(
  role: AuthSession['profile']['role'] = 'REGISTRATION_OFFICER',
): AuthSession {
  return {
    accessTokenExpiresInSeconds: 900,
    profile: {
      displayName: role === 'DOCTOR' ? 'dr. Budi Santoso' : 'Siti Rahma',
      id: 'b7be4441-d69d-48db-b2f8-ad8c87cbd42b',
      permissions: [],
      role,
      username: role === 'DOCTOR' ? 'doctor.test' : 'registration.test',
    },
    sessionExpiresAt: new Date(Date.now() + 8 * 60 * 60_000).toISOString(),
  }
}

export function createIssuedAuthSessionFixture(
  role: AuthSession['profile']['role'] = 'REGISTRATION_OFFICER',
  session: AuthSession = createAuthSessionFixture(role),
): IssuedAuthSession {
  return {
    ...session,
    accessToken: 'header.payload.signature',
    csrfToken: 'csrf-token-for-testing',
  }
}
