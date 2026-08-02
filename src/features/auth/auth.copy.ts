import { ApiError } from '@/lib/http/api-error'

interface AuthErrorFeedback {
  readonly message: string
  readonly title: string
  readonly requestId?: string
}

const authErrorMessages = {
  ACCOUNT_INACTIVE:
    'Akun ini belum dapat digunakan. Hubungi administrator klinik untuk memeriksa akses.',
  ACCOUNT_LOCKED:
    'Terlalu banyak percobaan masuk. Tunggu beberapa menit lalu coba lagi.',
  CSRF_CHECK_FAILED:
    'Halaman perlu dimuat ulang sebelum melanjutkan. Muat ulang lalu coba lagi.',
  INVALID_CREDENTIALS:
    'Nama pengguna atau kata sandi belum tepat. Periksa kembali lalu coba lagi.',
  LOGIN_RATE_LIMITED:
    'Terlalu banyak percobaan masuk. Tunggu beberapa menit lalu coba lagi.',
  NETWORK_ERROR:
    'Layanan belum dapat dihubungi. Periksa koneksi lalu coba lagi.',
  REQUEST_ORIGIN_REJECTED:
    'Halaman ini belum dapat terhubung dengan aman. Muat ulang lalu coba lagi.',
  REQUEST_TIMEOUT:
    'Layanan membutuhkan waktu lebih lama dari biasanya. Coba lagi.',
  SESSION_EXPIRED: 'Sesi Anda telah berakhir. Silakan masuk kembali.',
} as const

export function getAuthErrorFeedback(error: unknown): AuthErrorFeedback {
  if (error instanceof ApiError) {
    const message =
      authErrorMessages[error.code as keyof typeof authErrorMessages] ??
      'Layanan sedang mengalami kendala. Coba lagi beberapa saat lagi.'

    return {
      message,
      requestId: error.requestId,
      title: getErrorTitle(error.code),
    }
  }

  return {
    message: 'Layanan sedang mengalami kendala. Coba lagi beberapa saat lagi.',
    title: 'Belum dapat masuk',
  }
}

function getErrorTitle(code: string): string {
  if (code === 'SESSION_EXPIRED') {
    return 'Sesi telah berakhir'
  }

  if (code === 'ACCOUNT_INACTIVE') {
    return 'Akun belum dapat digunakan'
  }

  return 'Belum dapat masuk'
}
