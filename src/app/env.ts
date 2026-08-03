import { z } from 'zod'

const apiBaseUrlSchema = z.string().trim().min(1).refine(isValidApiBaseUrl, {
  message: 'must be an absolute HTTP(S) URL or a root-relative path',
})

const environmentSchema = z.object({
  VITE_API_BASE_URL: apiBaseUrlSchema.default(''),
  VITE_API_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .min(1_000)
    .max(60_000)
    .default(10_000),
})

function isValidApiBaseUrl(value: string): boolean {
  if (value.startsWith('/') && !value.startsWith('//')) {
    return true
  }

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const parsedEnvironment = environmentSchema.safeParse(import.meta.env)

if (!parsedEnvironment.success) {
  throw new Error('Frontend environment configuration is invalid')
}

export const appEnv = Object.freeze({
  apiBaseUrl: parsedEnvironment.data.VITE_API_BASE_URL,
  apiTimeoutMs: parsedEnvironment.data.VITE_API_TIMEOUT_MS,
})
