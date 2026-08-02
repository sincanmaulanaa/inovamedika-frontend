let accessToken: string | null = null
let csrfToken: string | null = null
let credentialVersion = 0

const csrfCookieName = 'inovamedika_csrf'

export function getAccessToken(): string | null {
  return accessToken
}

export function getCredentialVersion(): number {
  return credentialVersion
}

export function setAccessToken(token: string): void {
  const normalizedToken = token.trim()

  if (!normalizedToken) {
    throw new Error('Access token cannot be empty')
  }

  accessToken = normalizedToken
  credentialVersion += 1
}

export function getCsrfToken(): string | null {
  return csrfToken ?? readCookieValue(csrfCookieName)
}

export function setCsrfToken(token: string): void {
  const normalizedToken = token.trim()

  if (!normalizedToken) {
    throw new Error('CSRF token cannot be empty')
  }

  csrfToken = normalizedToken
}

export function clearAccessToken(): void {
  accessToken = null
  credentialVersion += 1
}

export function clearAuthCredentials(): void {
  accessToken = null
  csrfToken = null
  credentialVersion += 1
}

function readCookieValue(name: string): string | null {
  if (typeof document === 'undefined') {
    return null
  }

  const cookiePrefix = `${encodeURIComponent(name)}=`
  const cookie = document.cookie
    .split(';')
    .map((value) => value.trim())
    .find((value) => value.startsWith(cookiePrefix))

  if (!cookie) {
    return null
  }

  const value = cookie.slice(cookiePrefix.length)

  try {
    return decodeURIComponent(value) || null
  } catch {
    return null
  }
}
