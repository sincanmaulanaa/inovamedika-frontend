import 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    authCredentialVersion?: number
    authRetryAttempted?: boolean
    skipAccessToken?: boolean
    skipAuthRecovery?: boolean
  }

  interface InternalAxiosRequestConfig {
    authCredentialVersion?: number
    authRetryAttempted?: boolean
    skipAccessToken?: boolean
    skipAuthRecovery?: boolean
  }
}
