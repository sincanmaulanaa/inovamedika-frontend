import axios, { type AxiosRequestConfig, type Method } from 'axios'
import { z } from 'zod'
import { appEnv } from '@/app/env'
import { ApiError, normalizeApiError } from '@/lib/http/api-error'
import { recoverAuthentication } from '@/lib/http/auth-recovery'
import { getAccessToken, getCredentialVersion } from '@/lib/http/auth-token'

const successEnvelopeSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.unknown(),
})

export const apiClient = axios.create({
  baseURL: appEnv.apiBaseUrl,
  timeout: appEnv.apiTimeoutMs,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken()

  if (accessToken && !config.skipAccessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`)
    config.authCredentialVersion = getCredentialVersion()
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(normalizeApiError(error))
    }

    const requestConfig = error.config
    const canRecover =
      error.response?.status === 401 &&
      requestConfig !== undefined &&
      !requestConfig.authRetryAttempted &&
      !requestConfig.skipAuthRecovery

    if (!canRecover) {
      return Promise.reject(normalizeApiError(error))
    }

    const hasNewerCredentials =
      getAccessToken() !== null &&
      requestConfig.authCredentialVersion !== undefined &&
      requestConfig.authCredentialVersion !== getCredentialVersion()

    try {
      requestConfig.authRetryAttempted = true

      if (!hasNewerCredentials) {
        await recoverAuthentication()
      }

      return await apiClient.request(requestConfig)
    } catch (recoveryError) {
      return Promise.reject(normalizeApiError(recoveryError))
    }
  },
)

interface ApiRequest<TSchema extends z.ZodType> {
  readonly method?: Method
  readonly url: string
  readonly schema: TSchema
  readonly signal?: AbortSignal
  readonly params?: Readonly<
    Record<string, string | number | boolean | undefined>
  >
  readonly data?: unknown
  readonly headers?: AxiosRequestConfig['headers']
  readonly skipAccessToken?: boolean
  readonly skipAuthRecovery?: boolean
}

export async function requestApi<TSchema extends z.ZodType>({
  method = 'GET',
  url,
  schema,
  signal,
  params,
  data,
  headers,
  skipAccessToken,
  skipAuthRecovery,
}: ApiRequest<TSchema>): Promise<z.output<TSchema>> {
  const response = await apiClient.request<unknown>({
    method,
    url,
    data,
    headers,
    params,
    signal,
    skipAccessToken,
    skipAuthRecovery,
  })
  const parsedResponse = successEnvelopeSchema.safeParse(response.data)

  if (!parsedResponse.success) {
    throw new ApiError({
      message:
        'Layanan sedang mengalami kendala. Coba lagi beberapa saat lagi.',
      code: 'INVALID_API_RESPONSE',
      status: response.status,
      details: parsedResponse.error.flatten(),
    })
  }

  const parsedData = schema.safeParse(parsedResponse.data.data)

  if (!parsedData.success) {
    throw new ApiError({
      message:
        'Layanan sedang mengalami kendala. Coba lagi beberapa saat lagi.',
      code: 'INVALID_API_DATA',
      status: response.status,
      details: parsedData.error.issues,
    })
  }

  return parsedData.data
}
