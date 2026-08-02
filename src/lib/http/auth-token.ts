let accessToken: string | null = null

export function getAccessToken(): string | null {
  return accessToken
}

export function setAccessToken(token: string): void {
  const normalizedToken = token.trim()

  if (!normalizedToken) {
    throw new Error('Access token cannot be empty')
  }

  accessToken = normalizedToken
}

export function clearAccessToken(): void {
  accessToken = null
}
