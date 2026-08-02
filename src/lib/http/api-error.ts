import axios from 'axios'
import { z } from 'zod'

const errorEnvelopeSchema = z.object({
  success: z.literal(false),
  message: z.string().min(1),
  code: z.string().min(1).optional(),
  errors: z.unknown().optional(),
  requestId: z.string().min(1).optional(),
})

interface ApiErrorOptions {
  readonly message: string
  readonly code: string
  readonly status: number | null
  readonly requestId?: string
  readonly details?: unknown
  readonly cause?: unknown
}

export class ApiError extends Error {
  readonly code: string
  readonly status: number | null
  readonly requestId?: string
  readonly details?: unknown

  constructor(options: ApiErrorOptions) {
    super(options.message, { cause: options.cause })
    this.name = 'ApiError'
    this.code = options.code
    this.status = options.status
    this.requestId = options.requestId
    this.details = options.details
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (axios.isCancel(error)) {
    return new ApiError({
      message: 'Permintaan dibatalkan.',
      code: 'REQUEST_CANCELED',
      status: null,
      cause: error,
    })
  }

  if (!axios.isAxiosError(error)) {
    return new ApiError({
      message:
        'Layanan sedang mengalami kendala. Coba lagi beberapa saat lagi.',
      code: 'UNEXPECTED_ERROR',
      status: null,
      cause: error,
    })
  }

  const parsedEnvelope = errorEnvelopeSchema.safeParse(error.response?.data)
  const status = error.response?.status ?? null

  if (parsedEnvelope.success) {
    return new ApiError({
      message: parsedEnvelope.data.message,
      code: parsedEnvelope.data.code ?? 'API_ERROR',
      status,
      requestId: parsedEnvelope.data.requestId,
      details: parsedEnvelope.data.errors,
      cause: error,
    })
  }

  return new ApiError({
    message: getTransportErrorMessage(error.code, status),
    code: getTransportErrorCode(error.code, status),
    status,
    cause: error,
  })
}

export function isRetryableApiError(error: unknown): boolean {
  if (!(error instanceof ApiError)) {
    return false
  }

  if (error.code === 'REQUEST_CANCELED') {
    return false
  }

  return error.status === null || error.status >= 500
}

function getTransportErrorMessage(
  axiosCode: string | undefined,
  status: number | null,
): string {
  if (axiosCode === 'ECONNABORTED') {
    return 'Layanan membutuhkan waktu lebih lama dari biasanya. Coba lagi.'
  }

  if (status !== null) {
    return 'Layanan sedang mengalami kendala. Coba lagi beberapa saat lagi.'
  }

  return 'Layanan belum dapat dihubungi. Periksa koneksi lalu coba lagi.'
}

function getTransportErrorCode(
  axiosCode: string | undefined,
  status: number | null,
): string {
  if (axiosCode === 'ECONNABORTED') {
    return 'REQUEST_TIMEOUT'
  }

  return status === null ? 'NETWORK_ERROR' : 'HTTP_ERROR'
}
