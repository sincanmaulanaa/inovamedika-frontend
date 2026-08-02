import axios, { type Method } from 'axios'
import { z } from 'zod'
import { appEnv } from '@/app/env'
import { ApiError, normalizeApiError } from '@/lib/http/api-error'
import { getAccessToken } from '@/lib/http/auth-token'

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

  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`)
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeApiError(error)),
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
}

export async function requestApi<TSchema extends z.ZodType>({
  method = 'GET',
  url,
  schema,
  signal,
  params,
  data,
}: ApiRequest<TSchema>): Promise<z.output<TSchema>> {
  const response = await apiClient.request<unknown>({
    method,
    url,
    data,
    params,
    signal,
  })
  const parsedResponse = successEnvelopeSchema.safeParse(response.data)

  if (!parsedResponse.success) {
    throw new ApiError({
      message: 'Respons server tidak sesuai kontrak.',
      code: 'INVALID_API_RESPONSE',
      status: response.status,
      details: parsedResponse.error.flatten(),
    })
  }

  const parsedData = schema.safeParse(parsedResponse.data.data)

  if (!parsedData.success) {
    throw new ApiError({
      message: 'Data respons server tidak sesuai kontrak.',
      code: 'INVALID_API_DATA',
      status: response.status,
      details: parsedData.error.issues,
    })
  }

  return parsedData.data
}
