import { ApiError } from '@/lib/http/api-error'

export interface PatientFeedback {
  readonly message: string
  readonly requestId?: string
  readonly title: string
}

const patientErrorMessages = {
  FORBIDDEN:
    'Akses Anda belum dapat membuka data pasien. Hubungi administrator klinik bila perlu.',
  NETWORK_ERROR:
    'Layanan belum dapat dihubungi. Periksa koneksi lalu coba lagi.',
  PATIENT_HAS_REGISTRATIONS:
    'Pasien sudah memiliki pendaftaran, sehingga data belum dapat dihapus.',
  PATIENT_NIK_EXISTS:
    'NIK sudah digunakan oleh pasien lain. Periksa kembali NIK pasien.',
  PATIENT_NOT_FOUND:
    'Data pasien tidak ditemukan. Mungkin data sudah dihapus atau alamat halaman berubah.',
  PATIENT_VERSION_CONFLICT:
    'Data pasien sudah berubah di tempat lain. Muat ulang halaman sebelum menyimpan lagi.',
  REQUEST_TIMEOUT:
    'Layanan membutuhkan waktu lebih lama dari biasanya. Coba lagi.',
  VALIDATION_ERROR:
    'Beberapa data belum sesuai. Periksa kembali isian yang ditandai.',
} as const

export function getPatientErrorFeedback(error: unknown): PatientFeedback {
  if (error instanceof ApiError) {
    const message =
      patientErrorMessages[error.code as keyof typeof patientErrorMessages] ??
      'Layanan sedang mengalami kendala. Coba lagi beberapa saat lagi.'

    return {
      message,
      requestId: error.requestId,
      title: getPatientErrorTitle(error.code),
    }
  }

  return {
    message: 'Layanan sedang mengalami kendala. Coba lagi beberapa saat lagi.',
    title: 'Data pasien belum dapat diproses',
  }
}

function getPatientErrorTitle(code: string): string {
  if (code === 'PATIENT_NIK_EXISTS') {
    return 'NIK sudah terdaftar'
  }

  if (code === 'PATIENT_NOT_FOUND') {
    return 'Pasien tidak ditemukan'
  }

  if (code === 'PATIENT_VERSION_CONFLICT') {
    return 'Data perlu dimuat ulang'
  }

  if (code === 'PATIENT_HAS_REGISTRATIONS') {
    return 'Data pasien belum dapat dihapus'
  }

  return 'Data pasien belum dapat diproses'
}
